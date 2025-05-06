from django.contrib import admin
from .models import (
    TransportModel,
    PackagingType,
    Service,
    DeliveryStatus,
    CargoType,
    Delivery
)

@admin.register(TransportModel)
class TransportModelAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(PackagingType)
class PackagingTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(DeliveryStatus)
class DeliveryStatusAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(CargoType)
class CargoTypeAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Delivery)
class DeliveryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'transport_model',
        'transport_number',
        'departure_time',
        'arrival_time',
        'distance_km',
        'packaging',
        'status',
        'technical_state',
    )
    list_filter = (
        'status',
        'packaging',
        'technical_state',
        'services',
        'transport_model',
    )
    filter_horizontal = ('services',)
    search_fields = ('transport_number',)
    date_hierarchy = 'departure_time'
    ordering = ('-departure_time',)
