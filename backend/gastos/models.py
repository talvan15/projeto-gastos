from django.db import models


class Lancamento(models.Model):
    TIPO_CHOICES = [
        ('receita', 'Receita'),
        ('despesa', 'Despesa'),
    ]

    STATUS_CHOICES = [
        ('em_aberto', 'Em Aberto'),
        ('pago', 'Pago'),
    ]

    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)

    tipo = models.CharField(
        max_length=10,
        choices=TIPO_CHOICES,
        default='despesa'
    )

    status = models.CharField(
        max_length=10,
        choices=STATUS_CHOICES,
        blank=True,
        null=True
    )

    categoria = models.CharField(max_length=100, blank=True, null=True)
    data_lancamento = models.DateField()

    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Lançamento'
        verbose_name_plural = 'Lançamentos'

    def __str__(self):
        status = self.get_status_display() if self.status else 'Sem status'
        return f"{self.get_tipo_display()} - {self.descricao} - R$ {self.valor} ({status})"