# app/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    DeliveryReportView,
    DeliveryListAPIView,
    DeliveryViewSet
)
from .views import (
    DeliveryViewSet, TransportModelViewSet, PackagingTypeViewSet,
    ServiceViewSet, DeliveryStatusViewSet, CargoTypeViewSet
)

router = DefaultRouter()
router.register(r'deliveries', DeliveryViewSet, basename='delivery')
router.register(r'transport-models', TransportModelViewSet, basename='transportmodel')
router.register(r'packagings', PackagingTypeViewSet, basename='packaging')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'statuses', DeliveryStatusViewSet, basename='status')
router.register(r'cargo-types', CargoTypeViewSet, basename='cargotype')

urlpatterns = [
    path('', DeliveryReportView.as_view(), name='delivery_report'),
    path('api/', include([
        # JWT аутентификация
        path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        
        # Кастомный фильтр (должен быть выше router URLs)
        path('deliveries/filter/', DeliveryListAPIView.as_view(), name='delivery_filter'),
        
        # Подключение ViewSet роутера
        path('', include(router.urls)),
    ])),
]