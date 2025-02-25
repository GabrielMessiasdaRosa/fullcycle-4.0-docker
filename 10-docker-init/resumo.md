# Docker Init: Guia Detalhado

## 1. O que é o Docker Init?  
O **docker init** é um comando que automatiza a criação de arquivos de configuração Docker (\`Dockerfile\`, \`compose.yaml\`, \`.dockerignore\`) para projetos.  

### Principais Benefícios:  
- **Automação**: Gera templates otimizados para diversas linguagens.  
- **Boas Práticas**: Configurações alinhadas com recomendações oficiais.  
- **Multiplataforma**: Suporte a builds para diferentes arquiteturas.  
- **Flexibilidade**: Personalização via prompts interativos.  

### Como Usar:  
```bash  
cd seu-projeto  
docker init  
```  
O comando interativo solicitará:  
1. Linguagem do projeto (Go, Node.js, Python, etc.)  
2. Porta da aplicação  
3. Versão da linguagem  
4. Inclusão de arquivos Compose  

---

## 2. Projeto Go com Docker Init  

### Passo a Passo:  
1. **Criar Projeto**:  
```bash  
mkdir my-go-app && cd my-go-app  
go mod init my-go-app  
```  

2. **Código (\`main.go\`)**:  
```go  
package main  

import (  
    "fmt"  
    "net/http"  
)  

func handler(w http.ResponseWriter, r *http.Request) {  
    fmt.Fprintf(w, "Hello, Docker!")  
}  

func main() {  
    http.HandleFunc("/", handler)  
    http.ListenAndServe(":8080", nil)  
}  
```  

3. **Executar Docker Init**:  
```bash  
docker init  
# Seleções: Go | Porta 8080 | Incluir Compose  
```  

---

### Análise do Dockerfile Go  
```dockerfile  
# syntax=docker/dockerfile:1  
ARG GO_VERSION=1.23.1  

# Etapa de Build  
FROM --platform=$BUILDPLATFORM golang:${GO_VERSION} AS build  
WORKDIR /src  

# Cache de Módulos Go  
RUN --mount=type=cache,target=/go/pkg/mod/ \\  
    --mount=type=bind,source=go.mod,target=go.mod \\  
    go mod download -x  

# Compilação Multiplataforma  
ARG TARGETARCH  
RUN --mount=type=cache,target=/go/pkg/mod/ \\  
    --mount=type=bind,target=. \\  
    CGO_ENABLED=0 GOARCH=$TARGETARCH go build -o /bin/server ./cmd/server  

# Etapa Final  
FROM alpine:latest AS final  
RUN --mount=type=cache,target=/var/cache/apk \\  
    apk --update add ca-certificates tzdata  

# Usuário Não Privilegiado  
ARG UID=10001  
RUN adduser --disabled-password --uid "${UID}" appuser  
USER appuser  

# Copiar Binário  
COPY --from=build /bin/server /bin/  
EXPOSE 8080  
ENTRYPOINT [ "/bin/server" ]  
```  

#### Explicação:  
- **Multi-Stage Build**: Separa compilação e runtime para imagens menores.  
- **Cache de Módulos**: Acelera builds subsequentes.  
- **Segurança**: Usuário \`appuser\` não-root.  
- **Multiplataforma**: Suporte a ARM/AMD via \`--platform=$BUILDPLATFORM\`.  

---

### Análise do compose.yaml Go  
```yaml  
services:  
  server:  
    build:  
      context: .  
      target: final  
    ports:  
      - "8080:8080"  
```  
- **target: final**: Usa a etapa final do Dockerfile.  
- **Port Mapping**: Expõe a porta 8080 do container.  

---

## 3. Projeto Node.js com Docker Init  

### Passo a Passo:  
1. **Criar Projeto**:  
```bash  
mkdir my-node-app && cd my-node-app  
npm init -y && npm install express  
```  

2. **Código (\`index.js\`)**:  
```javascript  
const express = require('express');  
const app = express();  

app.get('/', (req, res) => {  
  res.send('Hello, Docker!');  
});  

app.listen(3000, () => {  
  console.log('App listening on port 3000');  
});  
```  

3. **Executar Docker Init**:  
```bash  
docker init  
# Seleções: Node.js | Porta 3000 | Incluir Compose  
```  

---

### Análise do Dockerfile Node.js  
```dockerfile  
# syntax=docker/dockerfile:1  
ARG NODE_VERSION=21.1.0  

FROM node:${NODE_VERSION}-alpine  
ENV NODE_ENV production  

WORKDIR /usr/src/app  

# Instalação de Dependências com Cache  
RUN --mount=type=bind,source=package.json,target=package.json \\  
    --mount=type=bind,source=package-lock.json,target=package-lock.json \\  
    --mount=type=cache,target=/root/.npm \\  
    npm ci --omit=dev  

# Usuário Não-Root  
USER node  

# Copiar Código  
COPY . .  
EXPOSE 3000  
CMD ["node", "index.js"]  
```  

#### Explicação:  
- **Alpine Base**: Imagem leve (~5MB).  
- **Cache NPM**: Reutiliza \`node_modules\` entre builds.  
- **Non-Root User**: Executa como usuário \`node\` por segurança.  

---

## 4. Projeto Genérico com Docker Init  

### Configuração para Qualquer Linguagem:  
```bash  
docker init  
# Seleções: "Other"  
```  

### Dockerfile Gerado:  
```dockerfile  
# syntax=docker/dockerfile:1  
FROM alpine:latest as base  

# Etapa de Build  
FROM base as build  
RUN echo '#!/bin/sh\\n\\  
echo "Hello world from $(whoami)!"' > /bin/hello.sh  
RUN chmod +x /bin/hello.sh  

# Etapa Final  
FROM base AS final  
ARG UID=10001  
RUN adduser --disabled-password --uid "${UID}" appuser  
USER appuser  

COPY --from=build /bin/hello.sh /bin/  
ENTRYPOINT [ "/bin/hello.sh" ]  
```  

#### Funcionalidades:  
- **Multi-Stage Build**: Separa lógica de construção e execução.  
- **Usuário Seguro**: \`appuser\` com UID fixo.  

---

## 5. Secrets no Docker Compose  

### Exemplo de compose.yaml com PostgreSQL:  
```yaml  
services:  
  server:  
    depends_on:  
      db:  
        condition: service_healthy  

  db:  
    image: postgres  
    secrets:  
      - db-password  
    environment:  
      POSTGRES_PASSWORD_FILE: /run/secrets/db-password  

secrets:  
  db-password:  
    file: db/password.txt  
```  

### Tipos de Secrets:  
| **Ambiente**       | **Funcionalidades**                              | **Segurança**                  |  
|---------------------|------------------------------------------------|--------------------------------|  
| **Docker Swarm**    | Criptografia em trânsito/repouso, ACL          | Alta (TLS + Raft log cripto)   |  
| **Docker Compose**  | Arquivo montado como volume                    | Baixa (apenas para desenvolvimento) |  

---

## 6. Boas Práticas  
1. **Multi-Stage Builds**: Reduza o tamanho final da imagem.  
2. **Non-Root Users**: Minimize riscos de segurança.  
3. **Cache de Dependências**: Acelere o processo de build.  
4. **Secrets em Produção**: Use soluções como Vault ou Kubernetes Secrets.  

---
