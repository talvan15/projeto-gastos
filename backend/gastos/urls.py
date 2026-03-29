from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LancamentoViewSet

router = DefaultRouter()
router.register(r'lancamentos', LancamentoViewSet, basename='lancamento')

urlpatterns = [
    path('', include(router.urls)),
]
