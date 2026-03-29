from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from django.utils import timezone
import datetime

from .models import Lancamento
from .serializers import LancamentoSerializer


class LancamentoViewSet(viewsets.ModelViewSet):
    
    serializer_class = LancamentoSerializer

    def get_queryset(self):
        queryset = Lancamento.objects.all()

        # Filtro por status
        status_param = self.request.query_params.get('status')
        if status_param:
            queryset = queryset.filter(status=status_param)

        # Filtro por mês e ano
        mes = self.request.query_params.get('mes')
        ano = self.request.query_params.get('ano')

        if mes and ano:
            queryset = queryset.filter(
                data_lancamento__month=int(mes),
                data_lancamento__year=int(ano)
            )
        elif mes:
            ano_atual = timezone.now().year
            queryset = queryset.filter(
                data_lancamento__month=int(mes),
                data_lancamento__year=ano_atual
            )
        elif ano:
            queryset = queryset.filter(data_lancamento__year=int(ano))

        # Filtro por tipo
        tipo = self.request.query_params.get('tipo')
        if tipo:
            queryset = queryset.filter(tipo=tipo)

        return queryset
    
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        tipo = data.get('tipo')

        if tipo == 'despesa':
            if not data.get('status'):
                return Response(
                    {'erro': 'Despesas precisam de status (em_aberto ou pago).'},
                    status=400
                )

        if tipo == 'receita':
            data['status'] = None

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=201)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.tipo == 'despesa' and instance.status != 'em_aberto':
            return Response(
                {'erro': 'Apenas despesas com status "Em Aberto" podem ser excluídas.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        """Regra: só podem ser editadas despesas com status 'em_aberto'."""
        instance = self.get_object()
        if instance.tipo == 'despesa' and instance.status != 'em_aberto':
            return Response(
                {'erro': 'Apenas despesas com status "Em Aberto" podem ser editadas.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """Regra: só podem ser editadas despesas com status 'em_aberto'."""
        instance = self.get_object()
        if instance.tipo == 'despesa' and instance.status != 'em_aberto':
            return Response(
                {'erro': 'Apenas despesas com status "Em Aberto" podem ser editadas.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        kwargs['partial'] = True
        return super().update(request, *args, **kwargs)


    @action(detail=True, methods=['patch'], url_path='pagar')
    def payment(self, request, pk=None):
        lancamento = self.get_object()

        if lancamento.tipo != 'despesa':
            return Response(
                {'erro': 'Apenas despesas podem ser pagas.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if lancamento.status == 'pago':
            return Response(
                {'erro': 'Despesa já está paga.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        lancamento.status = 'pago'
        lancamento.save()

        return Response({'status': 'pago'})

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
