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
flask run
```

A API ficará disponível em `http://127.0.0.1:5000`.

## Deploy na Vercel

Crie um projeto Vercel separado para o backend usando `backend` como Root Directory. O arquivo `vercel.json` e `api/index.py` expõem a aplicação Flask como uma função serverless.

Para um teste temporário, é possível omitir `DATABASE_URL`: na Vercel o backend usará SQLite em `/tmp/ifpar.db`. Esse arquivo não é persistente e pode ser apagado entre execuções. Para uso real, configure `DATABASE_URL` com um banco PostgreSQL persistente.

Configure também `CORS_ORIGINS` com a URL pública do frontend e mantenha `SUAP_SYNC_SECRET` idêntico ao valor configurado no projeto frontend.

## Organização da API

- `POST /login`: autentica um usuário e retorna um token JWT.
- `/users`: operações de usuários.
- `/tags`: operações de tags.
- `/posts`: CRUD de posts protegido por autenticação administrativa.

Os endpoints e suas regras de autorização devem ser confirmados nas blueprints em `routes/`, que são a fonte de verdade enquanto não houver uma especificação OpenAPI.

## Documentação

Veja [ARCHITECTURE.md](ARCHITECTURE.md) para o fluxo da aplicação, responsabilidades dos módulos e pontos de extensão.
