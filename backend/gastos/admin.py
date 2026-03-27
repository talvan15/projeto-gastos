from django.contrib import admin
from .models import Despesa


@admin.register(Despesa)
class DespesaAdmin(admin.ModelAdmin):
    list_display = ['descricao', 'valor', 'tipo', 'status', 'data_vencimento', 'criado_em']
    list_filter = ['status', 'tipo', 'data_vencimento']
    search_fields = ['descricao', 'categoria']
    ordering = ['-criado_em']
