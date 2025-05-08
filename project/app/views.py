# app/views.py
from rest_framework import generics, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import Delivery
from .serializers import DeliverySerializer
from .filters import DeliveryFilter
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

class DeliveryListAPIView(generics.ListAPIView):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DeliveryFilter

class DeliveryReportView(LoginRequiredMixin, TemplateView):
    template_name = 'app/delivery_report.html'
