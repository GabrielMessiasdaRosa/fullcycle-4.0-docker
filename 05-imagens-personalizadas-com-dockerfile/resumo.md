# Resumo do Curso

## 1. Introdução ao Docker e Dockerfile

Docker é uma plataforma para empacotar, distribuir e executar aplicações em containers. Um Dockerfile é um script com instruções para construir uma imagem Docker.

## 2. Estrutura Básica de um Dockerfile

Exemplo de Dockerfile para uma aplicação Node.js:

```dockerfile
ARG NODE_VERSION=21.1.0
FROM node:${NODE_VERSION}

RUN apt-get update && apt-get install -y vim && rm -rf /var/lib/apt/lists/*
ENV PORT=3001 MESSAGE="Hello Docker!"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 CMD [ "curl","-f","http://localhost:3001" ]
EXPOSE 3001
CMD ["node", "index.js"]
```

## 3. Instruções Detalhadas do Dockerfile

- **FROM**: Define a imagem base.
- **ARG**: Define variáveis de build.
- **RUN**: Executa comandos durante a construção da imagem.
- **ENV**: Define variáveis de ambiente.
- **WORKDIR**: Define o diretório de trabalho.
- **COPY**: Copia arquivos do host para o container.
- **HEALTHCHECK**: Verifica a saúde do container.
- **EXPOSE**: Documenta a porta exposta.
- **CMD**: Define o comando padrão para executar no container.
- **ENTRYPOINT**: Define o executável principal do container.
- **USER**: Define o usuário para executar os processos no container.
- **LABEL**: Adiciona metadados à imagem.

## 4. Multi-stage Builds e Otimização de Imagens

Utilize multi-stage builds para reduzir o tamanho da imagem final. Exemplo para uma aplicação Node.js:

```dockerfile
FROM node:14 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:14-slim
WORKDIR /app
COPY --from=builder /app .
COPY . .
CMD ["node", "index.js"]
```

## 5. ONBUILD e Imagens Base Personalizadas

ONBUILD é usado para adicionar instruções que serão executadas quando a imagem for usada como base para outra.

## 6. Passando Variáveis e Argumentos no docker run

- **Variáveis de Ambiente**:
  ```sh
  docker run -e MESSAGE="Hello from Docker!" -e PORT=4000 -p 4000:4000 my-node-app
  ```
- **Argumentos para CMD/ENTRYPOINT**:
  ```sh
  docker run -p 8080:8080 my-go-app 8080
  ```
- **Sobrescrevendo ENTRYPOINT**:
  ```sh
  docker run --entrypoint /bin/sh my-go-app
  ```
- **Especificando o Usuário**:
  ```sh
  docker run -u 1001 my-node-app
  ```

## 7. Exemplos Práticos Passo a Passo

Aplicação Node.js
Estrutura de Diretórios:

- app/
  - Dockerfile
  - .dockerignore
  - package.json
  - package-lock.json
  - index.js

Conteúdo do .dockerignore:

```
node_modules
npm-debug.log
Dockerfile
.dockerignore
.git
```

Dockerfile Otimizado:

```dockerfile
ARG NODE_VERSION=21.1.0
FROM node:${NODE_VERSION}
ENV PORT=3001 MESSAGE="Hello Docker!"
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 CMD ["curl", "-f", "http://localhost:${PORT}"] || exit 1
EXPOSE ${PORT}
CMD ["node", "index.js"]
```

Código da Aplicação (index.js):

```js
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const message = process.env.MESSAGE || "Hello World!";

app.get("/", (req, res) => {
  res.send(message);
});

app.get("/health", (req, res) => {
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

## Comandos para Build e Run

- **Build da Imagem**:

  ```sh
  docker build -t my-node-app .
  ```

- **Executando o Container**:

  ```sh
  docker run -p 3001:3001 my-node-app
  ```

- **Passando Variáveis de Ambiente**:

  ```sh
  docker run -e MESSAGE="Hello from Docker!" -e PORT=4000 -p 4000:4000 my-node-app
  ```

  ## Resumo e Melhores Práticas

  - **Reaproveitamento de Cache**: Copie arquivos de dependência antes do código-fonte.
  - **Uso do .dockerignore**: Exclua arquivos desnecessários.
  - **CMD vs ENTRYPOINT**: CMD pode ser sobrescrito, ENTRYPOINT é fixo.
  - **Passando Variáveis e Argumentos**: Use '-e' ou '--env' para variáveis de ambiente.
  - **Multi-stage Builds**: Reduza o tamanho da imagem final.
  - **HEALTHCHECK**: Implemente um endpoint '/health'.
  - **Segurança com USER**: Use usuários não root.
  - **LABEL e Metadados**: Facilite a manutenção e automação.
