# Docker Compose: Guia Detalhado

## 1. Introdução ao Docker Compose

O **Docker Compose** é uma ferramenta que permite definir e gerenciar aplicações multicontainer usando um arquivo YAML. Com ele, você pode:

- **Simplificar**: Configurar e iniciar vários serviços com um único comando.
- **Padronizar**: Compartilhar ambientes de desenvolvimento e produção de forma consistente.
- **Escalar**: Gerenciar serviços de forma eficiente.

### História

- **Docker Compose V1**: Lançado em 2014 como uma ferramenta separada.
- **Docker Compose V2+**: Integrado ao Docker CLI, com melhor desempenho e funcionalidades.

### Por que usar?

- **Simplicidade**: Gerencia múltiplos containers com facilidade.
- **Reprodutibilidade**: Compartilhe ambientes idênticos entre times.
- **Escalabilidade**: Adicione ou remova serviços conforme necessário.

---

## 2. Criando os Primeiros Serviços

### Serviço Node.js

#### Estrutura de Arquivos

- **Diretório**: \`./node/\`
- **Arquivos**: \`Dockerfile\`, \`index.js\`, \`package.json\`, \`.env\`, \`.dockerignore\`.

#### Código da Aplicação (\`index.js\`)

```javascript
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://mongo:27017/test")
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log(err));
```

- **Funcionamento**: Conecta ao MongoDB no host \`mongo\` na porta 27017.

#### Dockerfile

```dockerfile
FROM node:lts-alpine
WORKDIR /app
COPY package\*.json .
RUN npm install
COPY . .
CMD ["node", "index.js"]
```

- **Base**: Usa a imagem \`node:lts-alpine\` para uma imagem leve.
- **Passos**: Instala dependências e copia o código da aplicação.

#### Configuração no \`docker-compose.yml\`

```yaml
services:
  nodeapp:
  build:
  context: ./node
  dockerfile: Dockerfile
```

- **build**: Define o diretório e o Dockerfile para construir a imagem.

### Serviço Nginx

#### Estrutura de Arquivos

- **Diretório**: \`./nginx-html/\`
- **Arquivo**: \`index.html\`.

#### Conteúdo do \`index.html\`

```jsx
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Nginx Container</title>
  </head>
  <body>
    Hello World
  </body>
</html>
```

#### Configuração no \`docker-compose.yml\`

```yaml
services:
  nginx:
  image: nginx:latest
  ports:
    - "8080:80"
  volumes:
    - ./nginx-html:/usr/share/nginx/html
```

- **image**: Usa a imagem oficial do Nginx.
- **ports**: Mapeia a porta 8080 do host para a porta 80 do container.
- **volumes**: Monta o diretório local \`./nginx-html\` no container.

---

## 3. Definindo Dependências e Healthchecks

### Serviço MongoDB

#### Configuração no \`docker-compose.yml\`

```yaml
services:
  mongo:
  image: mongo:latest
  healthcheck:
  test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
  interval: 5s
  retries: 5
  start_period: 10s
  timeout: 5s
```

- **healthcheck**: Verifica se o MongoDB está pronto.

### Dependência no Serviço Node.js

```yaml
services:
  nodeapp:
  depends_on:
  mongo:
  condition: service_healthy
```

- **depends_on**: Garante que o Node.js só inicie após o MongoDB estar saudável.

---

## 4. Trabalhando com Volumes e Bind Mounts

### Persistindo Dados com Volumes

```yaml
services:
  mongo:
  volumes:
    - mongo_data:/data/db

volumes:
  mongo_data:
```

- **volumes**: Persiste os dados do MongoDB no volume \`mongo_data\`.

### Bind Mounts para Desenvolvimento

```yaml
services:
  nodeapp:
  volumes:
    - ./node:/app
```

- **volumes**: Sincroniza o código local com o container.

---

## 5. Variáveis de Ambiente e env_file

### Definindo Variáveis no Compose

```yaml
services:
  nodeapp:
  environment:
    - MY_VAR=123456
```

### Usando Arquivos \`.env\`

```yaml
services:
  nodeapp:
  env_file:
    - ./node/.env
```

---

## 6. Gerenciando Redes no Docker Compose

### Criando Redes Personalizadas

```yaml
networks:
  backend:
  db-net:
  frontend:
```

### Conectando Serviços às Redes

```yaml
services:
  nodeapp:
  networks:
    - backend
    - db-net

mongo:
  networks:
    - db-net

nginx:
  networks:
    - frontend
```

---

## 7. Utilizando extra_hosts para Acessar o Host

```yaml
services:
  nodeapp:
  extra_hosts:
    - "host.docker.internal:host-gateway"
```

---

## 8. Introdução ao Compose Watch

### Configurando o Compose Watch

```yaml
services:
 nodeapp-watch:
 develop:
 watch:
 - path: ./node
 target: /app
 action: sync
 ignore:
 - "./node/node_modules"
 - path: ./node/package.json
 action: rebuild
 - path: ./node/index.js
 target: /app/index.js
 action: sync+restart
```

### Comando para Iniciar

```bash
docker compose watch
```

---

## 9. Arquivo \`docker-compose.yml\` Completo

```yaml
services:
 nodeapp:
 build:
 context: ./node
 dockerfile: Dockerfile
 depends_on:
 mongo:
 condition: service_healthy
 environment:
 - MY_VAR=123456
 env_file:
 - ./node/.env
 volumes:
 - ./node:/app
 networks:
 - backend
 - db-net
 extra_hosts:
 - "host.docker.internal:host-gateway"

nodeapp-watch:
 build:
 context: ./node
 dockerfile: Dockerfile
 depends_on:
 mongo:
 condition: service_healthy
 develop:
 watch:
 - path: ./node
 target: /app
 action: sync
 ignore:
 - "./node/node_modules"
 - path: ./node/package.json
 action: rebuild
 - path: ./node/index.js
 target: /app/index.js
 action: sync+restart
 networks:
 - backend
 - db-net

nginx:
 image: nginx:latest
 ports:
 - "8080:80"
 volumes:
 - ./nginx-html:/usr/share/nginx/html
 networks:
 - frontend

mongo:
 image: mongo:latest
 healthcheck:
 test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
 interval: 5s
 retries: 5
 start_period: 10s
 timeout: 5s
 volumes:
 - mongo_data:/data/db
 networks:
 - db-net

volumes:
 mongo_data:

networks:
 db-net:
 backend:
 frontend:
```
