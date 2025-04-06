# Frontend React Router

Este é um projeto frontend construído com React, utilizando React Router para navegação e gerenciamento de rotas.

## 🛠 Tecnologias Utilizadas

- React 19.x
- React Router 7.x
- Material UI 7.x
- TypeScript
- Node.js 20.x
- Docker

## 📋 Pré-requisitos

Para rodar localmente:
- Node.js 20.x ou superior
- npm ou yarn

Para rodar com Docker:
- Docker
- Docker Compose

## 🚀 Como Executar

### Rodando Localmente

1. Clone o repositório:
```bash
git clone 
cd 
```

2. Instale as dependências:
```bash
npm install
```

3. Execute em modo de desenvolvimento:
```bash
npm run dev
```

4. Para build de produção:
```bash
npm run build
npm start
```

A aplicação estará disponível em `http://localhost:8080`

### Rodando com Docker

1. Clone o repositório:
```bash
git clone 
cd 
```

2. Construa e inicie os containers:
```bash
docker-compose up --build
```

Ou em modo detached (background):
```bash
docker-compose up --build -d
```

A aplicação estará disponível em `http://localhost:8080`

### Comandos Docker Úteis

- Parar os containers:
```bash
docker-compose down
```

- Visualizar logs:
```bash
docker-compose logs -f frontend
```

- Reiniciar os containers:
```bash
docker-compose restart
```

## 🔧 Variáveis de Ambiente

- `PORT`: Porta onde a aplicação será executada (default: 8080)
- `NODE_ENV`: Ambiente de execução (development/production)

## 📁 Estrutura do Projeto

```
frontend/
├── app/              # Código fonte da aplicação
├── public/           # Arquivos públicos
├── tests/            # Testes
├── Dockerfile        # Configuração Docker
├── docker-compose.yml # Configuração Docker Compose
├── package.json      # Dependências e scripts
└── tsconfig.json     # Configuração TypeScript
```

## 🧪 Testes

Para executar os testes:
```bash
# Executar todos os testes
npm test
```

## 📚 Documentação Adicional

- [React Router](https://reactrouter.com/)
- [Material UI](https://mui.com/)
- [TypeScript](https://www.typescriptlang.org/)

