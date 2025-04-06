# Build stage
FROM node:20-alpine as build

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências com flag para resolver conflitos
RUN npm install --legacy-peer-deps

# Copiar código fonte
COPY . .

# Buildar a aplicação
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copiar dependências de produção
COPY package*.json ./
RUN npm install --production --legacy-peer-deps

# Copiar build da aplicação
COPY --from=build /app/build ./build

# Expor porta 8080
EXPOSE 8080

# Variável de ambiente para a porta
ENV PORT=8080

# Iniciar a aplicação
CMD ["npm", "start"]