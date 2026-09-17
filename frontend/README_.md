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
