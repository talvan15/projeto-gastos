from rest_framework import serializers
from .models import Despesa


class DespesaSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Despesa
        fields = [
            'id', 'descricao', 'valor', 'tipo', 'tipo_display',
            'status', 'status_display', 'categoria',
            'data_vencimento', 'criado_em', 'atualizado_em'
        ]
        read_only_fields = ['id', 'criado_em', 'atualizado_em']

    def validate_status(self, value):
        """Valida que o status só pode ser alterado para despesas em aberto."""
        if self.instance and self.instance.status == 'pago':
            raise serializers.ValidationError(
                "Despesas pagas não podem ser editadas."
            )
        return value
