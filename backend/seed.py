"""
Script para popular o banco de dados com despesas de exemplo.
Execute com: python seed.py
"""
import os
import sys
import django
from datetime import date

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from gastos.models import Despesa

# Limpa dados anteriores
Despesa.objects.all().delete()

despesas = [
    # Despesas fixas pagas
    {'descricao': 'Aluguel', 'valor': 1500.00, 'tipo': 'fixa', 'status': 'pago', 'categoria': 'Moradia', 'data_vencimento': date(2025, 1, 5)},
    {'descricao': 'Internet', 'valor': 99.90, 'tipo': 'fixa', 'status': 'pago', 'categoria': 'Serviços', 'data_vencimento': date(2025, 1, 10)},
    {'descricao': 'Academia', 'valor': 89.00, 'tipo': 'fixa', 'status': 'pago', 'categoria': 'Saúde', 'data_vencimento': date(2025, 1, 15)},

    # Despesas variáveis pagas
    {'descricao': 'Supermercado', 'valor': 450.00, 'tipo': 'variavel', 'status': 'pago', 'categoria': 'Alimentação', 'data_vencimento': date(2025, 1, 20)},
    {'descricao': 'Farmácia', 'valor': 75.50, 'tipo': 'variavel', 'status': 'pago', 'categoria': 'Saúde', 'data_vencimento': date(2025, 1, 22)},

    # Despesas em aberto
    {'descricao': 'Energia Elétrica', 'valor': 180.00, 'tipo': 'variavel', 'status': 'em_aberto', 'categoria': 'Moradia', 'data_vencimento': date(2025, 2, 5)},
    {'descricao': 'Água', 'valor': 65.00, 'tipo': 'fixa', 'status': 'em_aberto', 'categoria': 'Moradia', 'data_vencimento': date(2025, 2, 8)},
    {'descricao': 'Plano de Saúde', 'valor': 320.00, 'tipo': 'fixa', 'status': 'em_aberto', 'categoria': 'Saúde', 'data_vencimento': date(2025, 2, 10)},
    {'descricao': 'Gasolina', 'valor': 200.00, 'tipo': 'variavel', 'status': 'em_aberto', 'categoria': 'Transporte', 'data_vencimento': date(2025, 2, 15)},
    {'descricao': 'Streaming', 'valor': 45.90, 'tipo': 'fixa', 'status': 'em_aberto', 'categoria': 'Lazer', 'data_vencimento': date(2025, 2, 18)},
]

for d in despesas:
    Despesa.objects.create(**d)
    print(f"  ✓ {d['descricao']} — R$ {d['valor']:.2f} [{d['status']}]")

print(f"\n✅ {len(despesas)} despesas criadas com sucesso!")
