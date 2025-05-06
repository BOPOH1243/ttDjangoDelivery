import django_filters
from .models import Delivery, TransportModel, DeliveryStatus, PackagingType, CargoType, Service

class DeliveryFilter(django_filters.FilterSet):
    departure_time__gte = django_filters.DateTimeFilter(field_name='departure_time', lookup_expr='gte', label='Отправлено после')
    departure_time__lte = django_filters.DateTimeFilter(field_name='departure_time', lookup_expr='lte', label='Отправлено до')
    transport_model = django_filters.ModelChoiceFilter(queryset=TransportModel.objects.all(), label='Модель транспорта')
    status = django_filters.ModelChoiceFilter(queryset=DeliveryStatus.objects.all(), label='Статус')
    packaging = django_filters.ModelChoiceFilter(queryset=PackagingType.objects.all(), label='Упаковка')
    cargo_type = django_filters.ModelChoiceFilter(queryset=CargoType.objects.all(), label='Тип груза')
    services = django_filters.ModelMultipleChoiceFilter(queryset=Service.objects.all(), label='Услуги', conjoined=True)

    class Meta:
        model = Delivery
        fields = []  # все поля описаны явно