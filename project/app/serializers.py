# app/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Delivery

class DeliverySerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField()  # Отображаем имя пользователя
    class Meta:
        model = Delivery
        fields = [
            'id', 'transport_model', 'transport_number', 'departure_time',
            'arrival_time', 'distance_km', 'services', 'packaging',
            'status', 'cargo_type', 'technical_state', 'created_by'
        ]
