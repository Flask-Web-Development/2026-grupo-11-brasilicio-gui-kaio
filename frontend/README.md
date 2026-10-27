# Portal de Apoio ao Estudante - _Frontend_

## Tecnologias utilizadas

- Next.js
- React
- TypeScript
- Tailwind CSS
- CSS

## Como rodar o frontend

Na raiz do repositório, acesse a pasta do frontend:

```bash
cd ./frontend/
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente. Copie o arquivo de exemplo para `.env.local` e ajuste a URL da API, se necessário:

```bash
cp .env.example .env.local
```

No Windows PowerShell, o equivalente é:

```powershell
Copy-Item .env.example .env.local
```

Rode o servidor Next.js:

```bash
npm run dev
```

O frontend estará disponível em:

```text
http://localhost:3000
```

Para validar a aplicação:

```bash
npm run lint
npm run build
```

Para informações sobre a estrutura dos módulos existentes, consulte [ARCHITECTURE.md](ARCHITECTURE.md).

### Login de usuários

O usuário pode autenticar pelo OAuth do SUAP ou pelo formulário de matrícula/e-mail e senha. O formulário valida as credenciais na API pública do SUAP:

- matrícula + senha podem criar a conta no primeiro login;
- e-mail só funciona depois que a matrícula já tiver criado a conta;
- o primeiro login via OAuth leva o usuário a definir uma senha local;
- todos os usuários são criados como `User`;
- a promoção para `Admin` continua sendo feita pelo administrador no backend.

### Deploy

O frontend e o backend devem ser configurados como projetos separados na Vercel.

Para o frontend, use `frontend` como Root Directory e configure:

- `NEXT_PUBLIC_API_URL`: URL pública do backend;
- `OAUTH2_CLIENT_ID` e `OAUTH2_CLIENT_SECRET`: credenciais OAuth do SUAP;
- `OAUTH2_REDIRECT_URI`: URL pública do frontend seguida de `/auth/callback`;
- `SESSION_SECRET`: segredo com pelo menos 32 caracteres;
- `SUAP_SYNC_SECRET`: mesmo valor configurado no backend.

Para o backend, use `backend` como Root Directory. Configure as variáveis do arquivo `.env.example`, incluindo `CORS_ORIGINS` com a URL pública do frontend. Para este teste, o backend pode omitir `DATABASE_URL` e usará SQLite em `/tmp`; os dados podem desaparecer entre execuções. Para produção, use PostgreSQL, Neon, Supabase ou outro banco persistente em `DATABASE_URL`.

A URL configurada no SUAP deve ser exatamente a mesma de `OAUTH2_REDIRECT_URI`, incluindo protocolo, domínio, caminho e ausência ou presença de barra final.

## Autenticação via SUAP

O fluxo SUAP usa Authorization Code em Route Handlers do Next.js com `passport` e `passport-oauth2`. As credenciais OAuth e a chave de sessão são lidas somente no servidor:

- `OAUTH2_CLIENT_ID`
- `OAUTH2_CLIENT_SECRET`
- `OAUTH2_REDIRECT_URI`
- `SESSION_SECRET` (mínimo de 32 caracteres aleatórios)
- `SUAP_SYNC_SECRET` (segredo compartilhado apenas entre o frontend e o backend para sincronizar usuários SUAP)

No desenvolvimento, `OAUTH2_REDIRECT_URI` deve ser `http://localhost:3000/auth/callback`. Em produção, configure a URL HTTPS real registrada no SUAP; não use a URL local. O callback consulta `https://suap.ifrn.edu.br/api/rh/eu/` após trocar o código em `https://suap.ifrn.edu.br/o/token/`. A autorização começa em `https://suap.ifrn.edu.br/o/authorize/`.

A sessão é um cookie assinado e `HttpOnly`; tokens OAuth não são enviados ao navegador nem armazenados em `localStorage`. A autenticação SUAP, por si só, não concede acesso administrativo. Todo usuário SUAP é criado como `User`; a promoção para `Admin` deve ser feita pelo administrador existente no backend.

As cópias locais dos arquivos alterados ficam em `.passport-copies/` e são ignoradas pelo Git. Elas servem como backup da migração e não devem ser publicadas, pois incluem cópias dos arquivos de ambiente.
