# Arquitetura do frontend

## Estrutura de Pastas

```text
frontend/
├── app/                         # Páginas e rotas da aplicação
│   ├── admin/                   # Área administrativa
│   ├── blog/                    # Área pública de publicações
│   │   └── [postId]/            # Rota dinâmica de uma publicação
│   ├── LandingPage.tsx          # Conteúdo da página inicial
│   ├── globals.css              # Estilos globais
│   ├── layout.tsx               # Layout raiz
│   └── page.tsx                 # Rota inicial
├── components/                  # Componentes compartilhados entre rotas
├── lib/                         # Lógica reutilizável da aplicação
│   ├── api/                     # Comunicação com o backend
│   │   └── endpoints/           # Operações organizadas por recurso da API
│   └── hooks/                   # Hooks reutilizáveis
├── public/                      # Arquivos estáticos
└── types/                       # Tipos compartilhados do frontend
```

## Aliases

| Alias | Caminho | Descrição |
| ----- | ------- | --------- |
| `@/*` | `./*` | Acesso a arquivos do diretório raiz do frontend |

## Módulos

### `app/`

É o módulo de rotas do Next.js e usa o App Router. As pastas `admin/`, `blog/` e `blog/[postId]/` representam as áreas e rotas atuais da aplicação. `layout.tsx` define a estrutura global e `page.tsx` é a entrada da página inicial.

### `components/`

Contém componentes reutilizáveis entre diferentes rotas. Atualmente, o principal componente compartilhado é o cabeçalho da aplicação.

### `lib/api/`

É a fronteira de comunicação com a API Flask. O cliente HTTP, a configuração da URL base e os endpoints de posts, tags e usuários ficam organizados neste módulo.

### `lib/hooks/`

Agrupa hooks reutilizáveis para comportamentos como carregamento e controle do estado de requisições.

### `types/`

Define os tipos TypeScript usados pela interface e pelos dados trocados com o backend.

### `public/`

Armazena arquivos estáticos utilizados pela interface.

## Fluxo atual de dados

```text
Página em app/
      |
      v
Componentes da página
      |
      +--> lib/hooks/             controla comportamentos reutilizáveis
      +--> lib/api/endpoints/     escolhe a operação da API
      +--> lib/api/               envia a requisição
      |
      v
Backend Flask
```

## Convenções

- Rotas devem permanecer em `app/`, seguindo a convenção do App Router.
- Componentes específicos devem ficar próximos da rota que os utiliza.
- Componentes compartilhados devem ficar em `components/`.
- O acesso ao backend deve ficar em `lib/api/`.
- Tipos compartilhados devem ficar em `types/` e seguem o seu respectivo model no backend.
- A árvore deve ser atualizada quando novos módulos forem incorporados ao projeto.
