from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DespesaViewSet, ReceitaViewSet

router = DefaultRouter()
router.register(r'despesas', DespesaViewSet, basename='despesa')
router.register(r'receitas', ReceitaViewSet, basename='receita')

urlpatterns = [
    path('', include(router.urls)),
]