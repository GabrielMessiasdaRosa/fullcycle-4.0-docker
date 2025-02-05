# Docker Buildx: Guia Prático

## 1. Visão Geral do Docker Buildx

Ferramenta avançada que estende o comando \`docker build\` com recursos adicionais:

- **Builds Multiarquitetura:** Construção simultânea para diferentes plataformas (amd64, arm64, etc.)
- **Ambiente Isolado:** Execução em container dedicado sem interferir no Docker principal
- **Emulação Transparente:** Uso automático do QEMU para builds cross-platform
- **Otimização de Cache:** Estratégias avançadas de reutilização de camadas
- **Builds Aninhados:** Suporte a Docker-in-Docker para isolamento completo

## 2. Conceitos Essenciais

### Builders e Contextos

| Componente   | Descrição                                                         |
| ------------ | ----------------------------------------------------------------- |
| **Builder**  | Ambiente de execução com configurações específicas (local/remoto) |
| **Contexto** | Conexão com instância Docker (gerencia comunicação com daemon)    |

### Drivers Disponíveis

| Driver               | Características                                                 |
| -------------------- | --------------------------------------------------------------- |
| **docker**           | Usa daemon local, sem isolamento, limitações em multiplataforma |
| **docker-container** | Container dedicado, suporte completo a multiplataforma via QEMU |

### Funcionalidades Chave

- **QEMU Integration:** Emulação automática de diferentes arquiteturas de CPU
- **Isolamento:** Container temporário com próprio daemon Docker para builds
- **Buildx CLI:** Interface unificada para gerenciamento de builders e operações

## 3. Gerenciamento de Builders

### Ciclo de Vida Básico

**Criação de Builder:**

```bash
docker buildx create --name advanced-builder --driver docker-container --bootstrap --use
```

**Inicialização:**

```bash
docker buildx inspect --bootstrap
```

**Listagem:**

```bash
docker buildx ls  # Lista builders disponíveis
docker context ls  # Exibe contextos associados
```

**Remoção Segura:**

```bash
docker context rm <context-name>  # Remove contexto associado
docker buildx rm <builder-name>   # Remove builder após contexto
```

## 4. Builds Multiplataforma

### Fluxo de Trabalho Básico

1. Preparar Dockerfile multiplataforma
2. Configurar builder com suporte a QEMU
3. Executar build com flags específicas

**Exemplo Prático:**

```bash
docker buildx build \\
  --platform linux/amd64,linux/arm64,linux/ppc64le \\
  -t user/app:multiarch \\
  --push .
```

### Estrutura de Comando

| Parâmetro      | Função                                                          |
| -------------- | --------------------------------------------------------------- |
| \`--platform\` | Lista de arquiteturas-alvo (separadas por vírgulas)             |
| \`--push\`     | Envio automático para registry após build bem-sucedido          |
| \`--load\`     | Carrega imagem no daemon local (apenas para builds single-arch) |

## 5. Gerenciamento de Cache

### Estratégias de Armazenamento

**Cache Local:**

```bash
docker buildx build --cache-to type=local,dest=./cache_dir --cache-from type=local,src=./cache_dir .
```

**Cache Remoto (Registry):**

```bash
docker buildx build \\
  --cache-to type=registry,ref=username/image:buildcache \\
  --cache-from type=registry,ref=username/image:buildcache .
```

**Limpeza de Cache:**

```bash
docker buildx prune --all  # Remove todo cache
docker buildx prune --filter 'until=72h'  # Limpa cache antigo
```

## 6. Exemplos Aplicados

### Caso 1: Aplicação Node.js Multiplataforma

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --production
CMD ["node", "dist/index.js"]
```

**Comando de Build:**

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t user/node-app:v2 --push .
```

### Caso 2: Build Complexo com Cache

```bash
docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  --cache-to type=registry,ref=user/app:cache \\
  --cache-from type=registry,ref=user/app:cache \\
  -t user/app:latest \\
  --push .
```
