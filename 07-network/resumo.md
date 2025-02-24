# Docker Networking: Guia Detalhado

## 1. Introdução ao Docker Networking

O **Docker Networking** é um sistema que gerencia a comunicação entre containers, redes externas e o host. Ele permite:

- **Isolamento**: Segmentar serviços em redes virtuais separadas.
- **Comunicação**: Conectar containers entre si (mesmo em hosts diferentes) e a serviços externos.
- **Escalabilidade**: Facilitar a criação de arquiteturas distribuídas (ex: microsserviços).

---

## 2. Tipos de Redes no Docker

### Rede Bridge (Padrão)

- **O que é**: Uma rede virtual isolada criada pelo Docker.
- **Funcionamento**:
  - Cada container recebe um IP interno (ex: 172.17.0.2).
  - Comunicação via **DNS interno** entre containers na mesma rede.
  - Acesso externo via mapeamento de portas (ex: \`-p 8080:80\`).
- **Uso típico**: Ambientes de desenvolvimento ou aplicações isoladas.
- **Comando para criar uma rede bridge personalizada**:  
  ```docker  
  docker network create minha-rede  
  ```

### Rede Host

- **O que é**: O container compartilha diretamente a interface de rede do host.
- **Funcionamento**:
  - Sem isolamento de rede: o container usa o IP do host.
  - Portas do container são expostas diretamente (ex: porta 80 no host = porta 80 no container).
- **Limitações**:
  - Não funciona bem no Docker Desktop (macOS/Windows) por questões de virtualização.
  - Risco de conflito de portas.
- **Uso típico**: Aplicações críticas de desempenho (ex: streaming de alta taxa de transferência).

---

## 3. Comunicação entre Containers

### Exemplo Prático: Node.js + MongoDB

#### Passo a Passo:

1. **Criar uma rede bridge personalizada**:  
   ```docker  
   docker network create app-network  
   ```

2. **Subir o MongoDB na rede**:  
   ```docker  
   docker run -d --name db --network app-network mongo:latest  
   ```

   - O nome \`db\` é resolvido para o IP do container pelo DNS interno do Docker.

3. **Subir a aplicação Node.js**:  
   ```docker  
   docker run -d --name app --network app-network minha-app-node  
   ```
   - Código de conexão ao MongoDB:  
     ```javascript  
     mongoose.connect("mongodb://db:27017/meu-banco")  
     ```

#### Como Funciona:

- **DNS Automático**: Containers na mesma rede resolvem nomes (ex: \`db\`) para IPs internos.
- **Isolamento**: Containers fora de \`app-network\` não enxergam o MongoDB.

---

## 4. Comunicação Container → Host

### Método 1: Usando \`host.docker.internal\`

- **O que é**: Um alias que aponta para o IP do host machine.
- **Funcionamento**:
  - No macOS/Windows: Funciona nativamente.
  - No Linux: Requer configuração (ex: \`--add-host=host.docker.internal:host-gateway\`).
- **Exemplo de Uso**:  
  ```docker  
  docker run --add-host=host.docker.internal:host-gateway nginx  
  ```
  - Acesso a um serviço no host: \`http://host.docker.internal:3000\`.

### Método 2: Usando a rede \`host\` (Linux)

- **Comando**:  
  ```docker  
  docker run --network host minha-app  
  ```
- **Vantagem**: Performance máxima (sem NAT).

---

## 5. Redes Múltiplas e Isolamento

### Cenário: Isolar Banco de Dados

1. **Criar redes segmentadas**:  
   ```docker  
   docker network create frontend  
   docker network create backend  
   ```

2. **Conectar containers a redes específicas**:
   - Banco de dados:  
     ```docker  
     docker run -d --name mysql --network backend mysql:latest  
     ```
   - Aplicação:  
     ```docker  
     docker run -d --name app --network frontend minha-app  
     docker network connect backend app  
     ```

#### Benefícios:

- **Segurança**: O MySQL só é acessível por containers na rede \`backend\`.
- **Controle**: A aplicação está em duas redes, mas o frontend não tem acesso direto ao banco.

---

## 6. Modos de Rede: Comparação Detalhada

| **Característica**  | **Bridge**                          | **Host**                       |
| ------------------- | ----------------------------------- | ------------------------------ |
| **Isolamento**      | Alto                                | Nenhum                         |
| **DNS Interno**     | Suportado                           | Não aplicável                  |
| **Performance**     | Moderado (NAT envolvido)            | Máxima (sem overhead)          |
| **Portas**          | Mapeamento manual (\`-p\`)          | Usa portas do host diretamente |
| **Uso Recomendado** | Desenvolvimento, ambientes isolados | Cargas críticas em Linux       |

---

## 7. Comandos Úteis

- **Listar redes**:  
  ```docker  
  docker network ls  
  ```

- **Inspecionar uma rede**:  
  ```docker  
  docker network inspect app-network  
  ```

- **Conectar container a uma rede existente**:  
  ```docker  
  docker network connect minha-rede meu-container  
  ```

- **Remover redes não utilizadas**:  
  ```docker  
  docker network prune  
  ```

---

## 8. Melhores Práticas

1. \*\*Evite a rede padrão \`bridge\*\*": Crie redes personalizadas para maior controle.
2. **Use nomes de containers como hosts**: Simplifica a configuração (ex: \`db\`, \`redis\`).
3. **Limite o acesso**: Conecte containers apenas a redes necessárias.
4. **No Linux**, prefira \`host-gateway\` em vez de mapeamento complexo de IPs.
5. **Monitore redes**: Use \`docker network inspect\` para diagnosticar problemas.
