#app/models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class TransportModel(models.Model):
    name = models.CharField("Модель транспорта", max_length=50, unique=True)

    def __str__(self):
        return self.name

class PackagingType(models.Model):
    name = models.CharField("Тип упаковки", max_length=100, unique=True)

    def __str__(self):
        return self.name

class Service(models.Model):
    name = models.CharField("Услуга", max_length=100, unique=True)

    def __str__(self):
        return self.name

class DeliveryStatus(models.Model):
    name = models.CharField("Статус доставки", max_length=50, unique=True)

    def __str__(self):
        return self.name

class CargoType(models.Model):
    name = models.CharField("Тип груза", max_length=100, unique=True)

    def __str__(self):
        return self.name

class Delivery(models.Model):
    TECH_STATE_CHOICES = [
        ('good', 'Исправно'),
        ('bad', 'Неисправно'),
    ]

    transport_model = models.ForeignKey(
        TransportModel, verbose_name="Модель транспорта",
        on_delete=models.PROTECT, related_name="deliveries"
    )
    transport_number = models.CharField("Номер транспорта", max_length=50)

    departure_time = models.DateTimeField("Время отправки")
    arrival_time = models.DateTimeField("Время доставки")

    distance_km = models.DecimalField("Дистанция (км)", max_digits=6, decimal_places=2)

    media_file = models.FileField(
        "Медиафайл", upload_to='deliveries/media/', blank=True, null=True
    )

    services = models.ManyToManyField(
        Service, verbose_name="Услуги", blank=True, related_name="deliveries"
    )
    packaging = models.ForeignKey(
        PackagingType, verbose_name="Упаковка",
        on_delete=models.PROTECT, related_name="deliveries"
    )
    status = models.ForeignKey(
        DeliveryStatus, verbose_name="Статус",
        on_delete=models.PROTECT, related_name="deliveries"
    )
    cargo_type = models.ForeignKey(
        CargoType, verbose_name="Тип груза", 
        on_delete=models.SET_NULL, null=True, blank=True, related_name="deliveries"
    )

    technical_state = models.CharField(
        "Техническое состояние", max_length=4,
        choices=TECH_STATE_CHOICES, default='good'
    )

    created_by = models.ForeignKey(
        User, verbose_name="Создал", on_delete=models.SET_NULL,
        null=True, blank=True, related_name="created_deliveries"
    )
    created_at = models.DateTimeField("Создано", auto_now_add=True)
    updated_at = models.DateTimeField("Обновлено", auto_now=True)

    class Meta:
        verbose_name = "Доставка"
        verbose_name_plural = "Доставки"
        ordering = ['-departure_time']

    def __str__(self):
        return f"Доставка #{self.id} ({self.transport_model} {self.transport_number})"

    @property
    def duration(self):
        """Время в пути как разница между доставкой и отправкой."""
        return self.arrival_time - self.departure_time
