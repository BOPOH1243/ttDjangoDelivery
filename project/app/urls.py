# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('report/', views.report_view, name='report'),
    path('chart-data/', views.chart_data, name='chart_data'),
    path('deliveries-data/', views.deliveries_data, name='deliveries_data'),
]
