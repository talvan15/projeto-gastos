from django.contrib import admin
from .models import Lancamento


@admin.register(Lancamento)
class LancamentoAdmin(admin.ModelAdmin):
    list_display = ['descricao', 'valor', 'tipo', 'status', 'data_lancamento', 'criado_em']
    list_filter = ['status', 'tipo', 'data_lancamento']
    search_fields = ['descricao', 'categoria']
    ordering = ['-data_lancamento']
