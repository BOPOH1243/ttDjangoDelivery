document.addEventListener('DOMContentLoaded', () => {
  const ctx = document.getElementById('deliveriesChart').getContext('2d');
  let deliveriesChart = new Chart(ctx, {
    type: 'bar',
    data: { labels: [], datasets: [{ label: 'Доставки', data: [], backgroundColor: 'rgba(54, 162, 235, 0.5)' }] },
    options: {
      scales: {
        x: { title: { display: true, text: 'Дата' } },
        y: { title: { display: true, text: 'Количество' } }
      }
    }
  });

  // Справочники и карты id -> name
  const lookupEndpoints = {
    transport_model: '/reports/api/transport-models/',
    status: '/reports/api/statuses/'
  };
  const transportModelsMap = {};
  const statusesMap = {};

  // Загрузка справочников и заполнение селектов + карт
  Object.entries(lookupEndpoints).forEach(([field, url]) => {
    fetch(url, { credentials: 'same-origin' })
      .then(res => res.json())
      .then(data => {
        const select = document.getElementById(field);
        if (!select) return;
        // Добавляем опцию "Все"
        const allOpt = new Option('Все', '');
        select.add(allOpt);

        data.forEach(item => {
          const opt = new Option(item.name, item.id);
          select.add(opt);
          // Заполняем локальную карту
          if (field === 'transport_model') transportModelsMap[item.id] = item.name;
          if (field === 'status') statusesMap[item.id] = item.name;
        });
      });
  });

  // Сбор параметров фильтра из формы
  function getFilterParams() {
    const params = new URLSearchParams();
    // текст и даты
    ['transport_number', 'departure_time_after', 'departure_time_before',
     'arrival_time_after', 'arrival_time_before', 'distance_km_min', 'distance_km_max']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el && el.value) params.append(id, el.value);
      });
    // селекты FK
    ['transport_model', 'services', 'packaging', 'status',
     'cargo_type', 'technical_state', 'created_by']
      .forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.multiple) {
          Array.from(el.selectedOptions)
               .filter(opt => opt.value)
               .forEach(opt => params.append(id, opt.value));
        } else if (el.value) {
          params.append(id, el.value);
        }
      });
    return params.toString();
  }

  // Обновление таблицы и графика
  function updateData() {
    const params = getFilterParams();
    fetch(`/reports/api/deliveries/filter/?${params}`, { credentials: 'same-origin' })
      .then(response => response.json())
      .then(data => {
        // обновляем таблицу
        const tbody = document.getElementById('deliveries-table-body');
        tbody.innerHTML = '';
        data.forEach(item => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${item.id}</td>
            <td>${transportModelsMap[item.transport_model] || item.transport_model}</td>
            <td>${item.transport_number}</td>
            <td>${item.departure_time.slice(0,10)}</td>
            <td>${item.arrival_time.slice(0,10)}</td>
            <td>${item.distance_km}</td>
            <td>${statusesMap[item.status] || item.status}</td>

          `;
          tbody.appendChild(row);
        });

        // обновляем график
        const countsByDate = {};
        data.forEach(item => {
          const date = item.departure_time.slice(0,10);
          countsByDate[date] = (countsByDate[date] || 0) + 1;
        });
        const labels = Object.keys(countsByDate).sort();
        const counts = labels.map(date => countsByDate[date]);
        deliveriesChart.data.labels = labels;
        deliveriesChart.data.datasets[0].data = counts;
        deliveriesChart.update();
      });
  }

  document.getElementById('apply-filters').addEventListener('click', updateData);
  // инициализация
  updateData();
});
