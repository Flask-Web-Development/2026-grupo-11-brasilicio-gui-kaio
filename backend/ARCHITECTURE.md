# Arquitetura do backend

## Estrutura de Pastas

```text
backend/
├── models/                 # Entidades persistidas e relacionamentos do domínio
├── routes/                 # Blueprints e endpoints HTTP
├── schemas/                # Validação dos dados de entrada e saída
├── services/               # Operações de negócio e persistência
├── __init__.py             # App factory e registro dos módulos
├── __main__.py             # Entrada para execução como módulo
├── app.py                  # Instância Flask, JWT e login
├── auth.py                 # Autenticação e autorização das rotas
└── database.py             # Configuração compartilhada do SQLAlchemy
```

## Módulos

### `models/`

Representa os dados persistidos pela aplicação. Atualmente concentra as entidades de usuários, posts, tags e imagens, além das relações entre posts e seus recursos.

### `routes/`

Recebe as requisições HTTP e organiza os endpoints por recurso. As rotas aplicam autorização, validam os dados com `schemas/`, chamam os serviços e montam as respostas JSON.

### `schemas/`

Define os formatos esperados pela API usando Pydantic. Essa camada separa a validação dos payloads da lógica de negócio e da persistência.

### `services/`

Concentra as operações de negócio e as transações com o banco. Consultas e alterações persistentes devem ficar nessa camada, e não diretamente nas rotas.

### Arquivos de inicialização e suporte

- `__init__.py`: expõe `create_app`, carrega as configurações, inicializa o banco, registra as rotas e importa os modelos.
- `app.py`: cria a aplicação Flask, configura o JWT e implementa os endpoints transversais `/hello` e `/login`.
- `auth.py`: disponibiliza as verificações usadas para restringir operações administrativas e validar o usuário autenticado.
- `database.py`: fornece a instância compartilhada do SQLAlchemy.
- `__main__.py`: permite executar o backend como módulo Python.

## Fluxo de uma requisição

```text
Requisição HTTP
      |
      v
routes/
      |
      +--> auth.py       # verifica acesso quando necessário
      +--> schemas/      # valida os dados recebidos
      +--> services/     # executa a operação
      +--> models/       # representa os dados persistidos
      |
      v
Resposta JSON
```

## Convenções

- Novos endpoints devem ser adicionados à Blueprint do recurso em `routes/`.
- A validação de payloads deve ficar em `schemas/`.
- Consultas e alterações persistentes devem ficar no serviço correspondente.
- Novas entidades devem ser representadas em `models/` e importadas durante a criação da aplicação.
