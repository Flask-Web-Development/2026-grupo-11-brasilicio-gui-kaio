# Portal de Apoio ao Estudante - Backend

API REST responsável por autenticação, usuários, tags e posts. A aplicação usa Flask, Flask-SQLAlchemy, SQLAlchemy, Pydantic e JWT.

## Executar localmente

Na raiz do repositório:

```bash
cd backend
python -m venv venv
```

Ative o ambiente virtual conforme o seu shell:

```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate.bat

# Linux/macOS
source venv/bin/activate
```

Instale as dependências e configure o ambiente:

```bash
pip install -r requirements.txt
copy .env.example .env   # PowerShell/CMD
```

No Linux/macOS, use `cp .env.example .env`. Revise o `.env` antes de iniciar a aplicação; ele contém as chaves JWT e a URL do banco. O valor padrão usa SQLite local.

Inicie o servidor:

```bash
flask --app __init__:create_app run --debug
```

A API ficará disponível em `http://127.0.0.1:5000`.

## Organização da API

- `POST /login`: autentica um usuário e retorna um token JWT.
- `/users`: operações de usuários.
- `/tags`: operações de tags.
- `/posts`: CRUD de posts protegido por autenticação administrativa.

Os endpoints e suas regras de autorização devem ser confirmados nas blueprints em `routes/`, que são a fonte de verdade enquanto não houver uma especificação OpenAPI.

## Documentação

Veja [ARCHITECTURE.md](ARCHITECTURE.md) para o fluxo da aplicação, responsabilidades dos módulos e pontos de extensão.
