from django.db import models


class Despesa(models.Model):
    TIPO_CHOICES = [
        ('fixa', 'Fixa'),
        ('variavel', 'Variável'),
    ]

    STATUS_CHOICES = [
        ('em_aberto', 'Em Aberto'),
        ('pago', 'Pago'),
    ]

    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='variavel')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='em_aberto')
    categoria = models.CharField(max_length=100, blank=True, null=True)
    data_vencimento = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Despesa'
        verbose_name_plural = 'Despesas'

    def __str__(self):
        return f"{self.descricao} - R$ {self.valor} ({self.get_status_display()})"

class Receita(models.Model):
    descricao = models.CharField(max_length=255)
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    data_recebimento = models.DateField()
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Receita'
        verbose_name_plural = 'Receitas'

    def __str__(self):
        return f"{self.descricao} - R$ {self.valor}"
