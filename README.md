# Projeto de Controle de Gastos

## Descrição
Este é um projeto acadêmico desenvolvido para a disciplina de Arquitetura de Software. Trata-se de um sistema web para controle de gastos pessoais, permitindo o gerenciamento de receitas e despesas, com funcionalidades como cadastro, edição, exclusão e acompanhamento de status (em aberto/pago). O sistema é dividido em backend (API REST com Django) e frontend (interface web com React).

## Funcionalidades
- **Cadastro de Lançamentos**: Adicionar receitas e despesas com descrição, valor, categoria e data.
- **Gerenciamento de Despesas**: Marcar despesas como pagas, editar ou excluir (apenas despesas em aberto).
- **Filtros e Indicadores**: Filtrar por mês, ano, status e tipo; visualizar totais de receitas, despesas pagas/em aberto e saldo.
- **Interface Responsiva**: Frontend moderno e intuitivo para desktop e mobile.

## Tecnologias Utilizadas
- **Backend**:
  - Python 3.x
  - Django 4.x
  - Django REST Framework
  - SQLite (banco de dados)
- **Frontend**:
  - Node.js 16+
  - React 18+
  - Axios (para requisições HTTP)
  - React Router (roteamento)
- **Outros**:
  - Git (versionamento)
  - VS Code (desenvolvimento)

## Arquitetura
O projeto segue o padrão MVC (Model-View-Controller):
- **Model**: Representado pelo modelo `Lancamento` no Django, gerenciando dados no banco.
- **View**: Componentes React no frontend para renderização da interface; serialização JSON no backend.
- **Controller**: ViewSets do Django REST Framework no backend para lógica de negócio; serviços API no frontend para comunicação.

## Instalação e Configuração

### Pré-requisitos
- Python 3.8+
- Node.js 16+
- Git

### Backend (Django)
1. Navegue até a pasta `backend`:
   ```
   cd backend
   ```
2. Crie um ambiente virtual (opcional, mas recomendado):
   ```
   python -m venv venv
   venv\Scripts\activate  # No Windows
   ```
3. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```
4. Execute as migrações do banco:
   ```
   python manage.py migrate
   ```
5. (Opcional) Popule o banco com dados de exemplo:
   ```
   python manage.py shell < seed.py
   ```
6. Inicie o servidor:
   ```
   python manage.py runserver
   ```
   O backend estará disponível em `http://localhost:8000`.

### Frontend (React)
1. Navegue até a pasta `frontend`:
   ```
   cd frontend
   ```
2. Instale as dependências:
   ```
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```
   npm start
   ```
   O frontend estará disponível em `http://localhost:3000`.

## Como Usar
1. Certifique-se de que o backend esteja rodando.
2. Acesse o frontend no navegador.
3. Na página inicial (Home), visualize os indicadores e clique em "Novo Lançamento" para adicionar receitas/despesas.
4. Use filtros por mês/ano para visualizar dados específicos.
5. Na página de lista de lançamentos, edite, pague ou exclua despesas (regras aplicam-se a despesas em aberto).

## API Endpoints
- `GET /api/lancamentos/` - Listar lançamentos (com filtros opcionais: `?status=em_aberto&mes=4&ano=2026&tipo=despesa`)
- `POST /api/lancamentos/` - Criar novo lançamento
- `GET /api/lancamentos/{id}/` - Detalhes de um lançamento
- `PATCH /api/lancamentos/{id}/` - Editar lançamento
- `DELETE /api/lancamentos/{id}/` - Excluir lançamento
- `PATCH /api/lancamentos/{id}/pagar/` - Marcar despesa como paga
- `GET /api/lancamentos/indicadores/` - Obter indicadores (totais e saldo)

## Estrutura do Projeto
```
projeto-gastos/
├── backend/
│   ├── core/          # Configurações do Django
│   ├── gastos/        # App principal (models, views, serializers, urls)
│   ├── db.sqlite3     # Banco de dados
│   ├── manage.py      # Comando Django
│   ├── requirements.txt
│   └── seed.py        # Script para popular banco
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # Componentes React reutilizáveis
│   │   ├── pages/       # Páginas principais (Home, ListaLancamentos)
│   │   ├── services/    # API client (api.js)
│   │   ├── App.jsx      # Componente raiz
│   │   └── index.js
│   └── package.json
└── README.md
```

## Contribuição
Este é um projeto acadêmico. Para contribuições:
1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`).
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`).
4. Push para a branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## Licença
Este projeto é para fins educacionais e não possui licença específica.

## Autor
Desenvolvido como parte da disciplina de Arquitetura de Software.</content>
<filePath>filePath">c:\Users\PC\Desktop\Faculdade\Arquitetura de software\projeto-gastos\projeto-gastos\README.md