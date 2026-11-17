# Portal de Apoio ao Estudante - Backend

API REST responsável por autenticação, usuários, posts, tags, imagens e Ouvidoria. A aplicação usa Flask, Flask-SQLAlchemy, SQLAlchemy, Pydantic e JWT.

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

Caso deseje simplesmente gerar valores aleatórios para os tokens, use o seguinte script:
```bash
python create_env.py
```

Inicie o servidor:

```bash
flask run
```

A API ficará disponível em `http://127.0.0.1:5000`.

## Deploy na Vercel

Crie um projeto Vercel separado para o backend usando `backend` como Root Directory. O arquivo `vercel.json` e `api/index.py` expõem a aplicação Flask como uma função serverless.

Para um teste temporário, é possível omitir `DATABASE_URL`: na Vercel o backend usará SQLite em `/tmp/ifpar.db`. Esse arquivo não é persistente e pode ser apagado entre execuções. Para uso real, configure `DATABASE_URL` com um banco PostgreSQL persistente.

Configure também `CORS_ORIGINS` com a URL pública do frontend e mantenha `SUAP_SYNC_SECRET` idêntico ao valor configurado no projeto frontend. Configure `ADMIN_USERNAME` e `ADMIN_PASSWORD` para o login independente do Admin Master.
Configure `CRON_SECRET` como um segredo aleatório na Vercel para autorizar o expurgo diário de posts removidos há mais de 60 dias.

## Organização da API

- `POST /login`: autentica matrícula e senha diretamente no SUAP e retorna um token JWT.
- `POST /login/master`: autentica o Admin Master usando `ADMIN_USERNAME` e `ADMIN_PASSWORD`; não cria registro em `User`.
- `POST /login/oauth`: troca a identidade já sincronizada no callback OAuth por um JWT; exige `X-SUAP-Sync-Secret` e `user_id`.
- O Admin Master pode acessar as operações administrativas, mas não pode publicar posts nem enviar mensagens na Ouvidoria, pois essas ações exigem autoria vinculada a um usuário SUAP.
- O OAuth do SUAP é concluído pelo callback do frontend; `POST /users/suap` sincroniza o perfil usando `SUAP_SYNC_SECRET`.
- Os JWTs expiram em 8 horas. O frontend os mantém em uma sessão HttpOnly criptografada e encaminha as chamadas pelo proxy `/api/backend/*`; clientes externos devem enviar `Authorization: Bearer <token>`.
- `/users`: operações de usuários.
- `/tags`: leitura pública e gerenciamento administrativo de tags.
- `/posts/public`: listagem paginada de posts publicados; aceita `q` e `tag_id`.
- `/posts/public/<slug>`: leitura pública por slug.
- `/posts`: gerenciamento administrativo de posts; inclui lixeira, restauração e dashboard.
- `DELETE /images/<image_id>`: exige `?confirm=true`; sem confirmação retorna o número de publicações que usam a imagem.
- `PUT /users/<user_id>/role`: alteração administrativa de papel (não permite alterar o próprio papel).
- `GET /maintenance/purge-expired-posts`: rotina interna da Vercel, protegida por `CRON_SECRET`.

Os endpoints e suas regras de autorização devem ser confirmados nas blueprints em `routes/`, que são a fonte de verdade enquanto não houver uma especificação OpenAPI.

## Documentação

Veja [ARCHITECTURE.md](ARCHITECTURE.md) para o fluxo da aplicação, responsabilidades dos módulos e pontos de extensão.
