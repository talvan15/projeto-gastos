from django.contrib import admin
from .models import Despesa, Receita


@admin.register(Despesa)
class DespesaAdmin(admin.ModelAdmin):
    list_display = ['descricao', 'valor', 'tipo', 'status', 'data_vencimento', 'criado_em']
    list_filter = ['status', 'tipo', 'data_vencimento']
    search_fields = ['descricao', 'categoria']
    ordering = ['-criado_em']

@admin.register(Receita)
class ReceitaAdmin(admin.ModelAdmin):
    list_display = ['descricao', 'valor', 'categoria', 'data_recebimento', 'criado_em']
    list_filter = ['categoria', 'data_recebimento']
    search_fields = ['descricao', 'categoria']
    ordering = ['-criado_em']