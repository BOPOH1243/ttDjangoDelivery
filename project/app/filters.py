import django_filters
from django_filters import rest_framework as filters
from .models import Delivery, Service, TransportModel, PackagingType, DeliveryStatus, CargoType
from django.contrib.auth import get_user_model

User = get_user_model()

class DeliveryFilter(filters.FilterSet):
    transport_model = filters.ModelChoiceFilter(
        field_name='transport_model',
        queryset=TransportModel.objects.all(),
        label='Модель транспорта'
    )
    transport_number = filters.CharFilter(
        lookup_expr='icontains',
        label='Номер транспорта'
    )
    departure_time = filters.DateFromToRangeFilter(
        field_name='departure_time',
        label='Дата отправления'
    )
    arrival_time = filters.DateFromToRangeFilter(
        field_name='arrival_time',
        label='Дата прибытия'
    )
    distance_km = filters.RangeFilter(
        field_name='distance_km',
        label='Расстояние (км)'
    )
    services = filters.ModelMultipleChoiceFilter(
        field_name='services',
        queryset=Service.objects.all(),
        conjoined=False,
        label='Услуги'
    )
    packaging = filters.ModelChoiceFilter(
        field_name='packaging',
        queryset=PackagingType.objects.all(),
        label='Упаковка'
    )
    status = filters.ModelChoiceFilter(
        field_name='status',
        queryset=DeliveryStatus.objects.all(),
        label='Статус'
    )
    cargo_type = filters.ModelChoiceFilter(
        field_name='cargo_type',
        queryset=CargoType.objects.all(),
        label='Тип груза'
    )
    technical_state = filters.ChoiceFilter(
        field_name='technical_state',
        choices=Delivery.TECH_STATE_CHOICES,
        label='Тех. состояние'
    )
    created_by = filters.ModelChoiceFilter(
        field_name='created_by',
        queryset=User.objects.all(),
        label='Создал'
    )

    class Meta:
        model = Delivery
        fields = [
            'transport_model',
            'transport_number',
            'departure_time',
            'arrival_time',
            'distance_km',
            'services',
            'packaging',
            'status',
            'cargo_type',
            'technical_state',
            'created_by'
        ]
