# app/urls.py
from django.urls import path
from .views import DeliveryReportView, DeliveryListAPIView

urlpatterns = [
    path('', DeliveryReportView.as_view(), name='delivery_report'),             # Страница отчёта
    path('api/deliveries/', DeliveryListAPIView.as_view(), name='delivery_list'),  # API для фильтрации
]
