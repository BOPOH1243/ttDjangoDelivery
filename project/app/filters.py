# app/filters.py
import django_filters
from django_filters import rest_framework as filters
from .models import Delivery
from django.contrib.auth import get_user_model

User = get_user_model()

class DeliveryFilter(filters.FilterSet):
    transport_model = filters.CharFilter(lookup_expr='icontains')
    transport_number = filters.CharFilter(lookup_expr='icontains')
    departure_time = filters.DateFromToRangeFilter()
    arrival_time = filters.DateFromToRangeFilter()
    distance_km = filters.RangeFilter()
    services = filters.CharFilter(lookup_expr='icontains')
    packaging = filters.CharFilter(lookup_expr='icontains')
    status = filters.CharFilter(lookup_expr='icontains')
    cargo_type = filters.CharFilter(lookup_expr='icontains')
    technical_state = filters.CharFilter(lookup_expr='icontains')
    created_by = filters.ModelChoiceFilter(field_name='created_by', queryset=User.objects.all())

    class Meta:
        model = Delivery
        fields = [
            'transport_model', 'transport_number',
            'departure_time', 'arrival_time', 'distance_km',
            'services', 'packaging', 'status', 'cargo_type',
            'technical_state', 'created_by'
        ]
