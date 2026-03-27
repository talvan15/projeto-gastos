from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
import datetime

from .models import Despesa
from .serializers import DespesaSerializer


class DespesaViewSet(viewsets.ModelViewSet):
    
    serializer_class = DespesaSerializer

    def get_queryset(self):
        queryset = Despesa.objects.all()

        # Filtro por status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filtro por mês e ano
        mes = self.request.query_params.get('mes')
        ano = self.request.query_params.get('ano')

        if mes and ano:
            queryset = queryset.filter(
                data_vencimento__month=int(mes),
                data_vencimento__year=int(ano)
            )
        elif mes:
            ano_atual = timezone.now().year
            queryset = queryset.filter(
                data_vencimento__month=int(mes),
                data_vencimento__year=ano_atual
            )
        elif ano:
            queryset = queryset.filter(data_vencimento__year=int(ano))

        # Filtro por tipo
        tipo = self.request.query_params.get('tipo')
        if tipo:
            queryset = queryset.filter(tipo=tipo)

        return queryset

    def destroy(self, request, *args, **kwargs):
        """Regra: só podem ser excluídas despesas com status 'em_aberto'."""
        instance = self.get_object()
        if instance.status != 'em_aberto':
            return Response(
                {'erro': 'Apenas despesas com status "Em Aberto" podem ser excluídas.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        """Regra: só podem ser editadas despesas com status 'em_aberto'."""
        instance = self.get_object()
        if instance.status != 'em_aberto':
            return Response(
                {'erro': 'Apenas despesas com status "Em Aberto" podem ser editadas.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """Regra: só podem ser editadas despesas com status 'em_aberto'."""
        instance = self.get_object()
        if instance.status != 'em_aberto':
            return Response(
                {'erro': 'Apenas despesas com status "Em Aberto" podem ser editadas.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='indicadores')
    def indicadores(self, request):
        """
        Retorna os indicadores de gastos totais separados por status.
        Aceita filtros de mês/ano para o período desejado.
        """
        queryset = self.get_queryset()

        total_geral = queryset.aggregate(
            total=Sum('valor'),
            quantidade=Count('id')
        )

        em_aberto = queryset.filter(status='em_aberto').aggregate(
            total=Sum('valor'),
            quantidade=Count('id')
        )

        pagos = queryset.filter(status='pago').aggregate(
            total=Sum('valor'),
            quantidade=Count('id')
        )

        return Response({
            'total_geral': {
                'valor': total_geral['total'] or 0,
                'quantidade': total_geral['quantidade']
            },
            'em_aberto': {
                'valor': em_aberto['total'] or 0,
                'quantidade': em_aberto['quantidade']
            },
            'pagos': {
                'valor': pagos['total'] or 0,
                'quantidade': pagos['quantidade']
            }
        })
