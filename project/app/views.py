# views.py
from django.shortcuts import render
from django.http import JsonResponse
from .models import Delivery
from django.db.models import Count
from django.utils.timezone import now, timedelta

def report_view(request):
    # просто рендерим страницу, список будем подтягивать AJAX-ом
    return render(request, 'app/report.html')

def chart_data(request):
    last_30_days = now() - timedelta(days=30)
    data = (
        Delivery.objects
        .filter(departure_time__gte=last_30_days)
        .extra({'date': "date(departure_time)"})
        .values('date')
        .annotate(count=Count('id'))
        .order_by('date')
    )
    return JsonResponse(list(data), safe=False)

def deliveries_data(request):
    # Можно добавить пагинацию, фильтрацию по GET-параметрам и т.д.
    qs = Delivery.objects.select_related('transport_model', 'status')\
                          .order_by('-departure_time')[:100]  # например, последние 100
    data = []
    for d in qs:
        data.append({
            'id': d.id,
            'model': d.transport_model.name,
            'number': d.transport_number,
            'departure': d.departure_time.strftime('%Y-%m-%d %H:%M'),
            'arrival': d.arrival_time.strftime('%Y-%m-%d %H:%M'),
            'status': d.status.name,
        })
    return JsonResponse(data, safe=False)
