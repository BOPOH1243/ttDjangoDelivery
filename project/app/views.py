# app/views.py
from rest_framework import generics, permissions, viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import Delivery
from .serializers import DeliverySerializer
from .filters import DeliveryFilter
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from rest_framework import viewsets
from .models import (
    TransportModel, PackagingType,
    Service, DeliveryStatus, CargoType
)
from .serializers import (
    TransportModelSerializer, PackagingTypeSerializer,
    ServiceSerializer, DeliveryStatusSerializer, CargoTypeSerializer
)

class TransportModelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TransportModel.objects.all()
    serializer_class = TransportModelSerializer

class PackagingTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PackagingType.objects.all()
    serializer_class = PackagingTypeSerializer

class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

class DeliveryStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DeliveryStatus.objects.all()
    serializer_class = DeliveryStatusSerializer

class CargoTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CargoType.objects.all()
    serializer_class = CargoTypeSerializer


class DeliveryListAPIView(generics.ListAPIView):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DeliveryFilter

class DeliveryReportView(LoginRequiredMixin, TemplateView):
    template_name = 'app/delivery_report.html'

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]
