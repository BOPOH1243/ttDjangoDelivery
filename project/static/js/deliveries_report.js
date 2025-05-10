// project/static/js/deliveries_report.js
document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('deliveriesChart').getContext('2d');
    let deliveriesChart = new Chart(ctx, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Доставки', data: [], backgroundColor: 'rgba(54, 162, 235, 0.5)' }] },
      options: { scales: { x: { title: { display: true, text: 'Дата' } }, y: { title: { display: true, text: 'Количество' } } } }
    });
  
    // Собираем параметры фильтра из формы
    function getFilterParams() {
      const params = new URLSearchParams();
      ['transport_model', 'transport_number', 'departure_time_after', 'departure_time_before',
       'arrival_time_after', 'arrival_time_before', 'distance_km_min', 'distance_km_max',
       'services', 'packaging', 'status', 'cargo_type', 'technical_state', 'created_by']
        .forEach(id => {
          const val = document.getElementById(id).value;
          if (val) params.append(id, val);
        });
      return params.toString();
    }
  
    // Обновление таблицы и графика
    function updateData() {
      const params = getFilterParams();
      fetch(`/reports/api/deliveries/filter/?${params}`, { credentials: 'same-origin' })
        .then(response => response.json())
        .then(data => {
          // Обновляем таблицу
          const tbody = document.getElementById('deliveries-table-body');
          tbody.innerHTML = '';
          data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${item.id}</td>
              <td>${item.transport_model}</td>
              <td>${item.transport_number}</td>
              <td>${item.departure_time.slice(0,10)}</td>
              <td>${item.arrival_time.slice(0,10)}</td>
              <td>${item.distance_km}</td>
              <td>${item.status}</td>
              <td>${item.created_by}</td>
            `;
            tbody.appendChild(row);
          });
  
          // Подготовка данных для графика (группировка по дате отправления)
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
  
    // Инициализируем при загрузке страницы
    updateData();
  });
  