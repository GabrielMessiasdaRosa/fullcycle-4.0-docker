# Persistencia de dados


### **Persistencia de Dados e Efemeridade dos Containers**

#### **1. Perda de Dados em Containers**
Os containers Docker, por natureza, sao efemeros: qualquer alteraçao feita dentro deles sera perdida ao serem removidos. Isso garante consistencia e portabilidade, mas pode ser problematico para aplicações que precisam armazenar dados persistentes, como bancos de dados ou logs.

##### **Camadas de Leitura e Escrita**
- **OverlayFS:** Sistema de arquivos unificador que utiliza camadas:
  - **Camadas de Imagem:** Somente leitura, compartilhadas por mUltiplos containers.
  - **Camada de Container:** Leitura e escrita, onde sao feitas as alterações durante a execuçao.

---

#### **2. Persistencia de Dados**
##### **Por que e Importante?**
Para garantir que dados sobrevivam ao ciclo de vida do container, como:
- Bancos de dados.
- Aplicações que geram logs.
- Sites que recebem uploads de arquivos.

##### **Formas de Persistencia**
1. **Volumes (Recomendado para Produçao):**
   - Gerenciados pelo Docker, independentes do host.
   - Podem ser locais ou remotos.
2. **Bind Mounts (Uteis no Desenvolvimento):**
   - Vinculam diretórios do host ao container.
   - Mais flexiveis, mas menos portateis.

---

#### **3. Bind Mounts**
##### **Configuraçao Basica**
1. **Flag \`-v\`:**
   ```bash
   docker run -v [caminho_host]:[caminho_container] [imagem]
   ```
2. **Flag \`--mount\`:**
   ```bash
   docker run --mount type=bind,source=[caminho_host],target=[caminho_container] [imagem]
   ```

##### **Exemplo: Nginx com Bind Mount**
1. **Preparaçao no Host:**
   ```bash
   mkdir ~/my_nginx_html
   echo "<h1>LEEEEEEROOOOOOOOOOOOOOY JENKINS!</h1>" > ~/my_nginx_html/index.html
   ```
2. **Executar Nginx:**
   ```bash
   docker run -d -p 8080:80 -v $(pwd)/my_nginx_html:/usr/share/nginx/html nginx
   ```
3. **Verificar no Navegador:** Acesse \`http://localhost:8080\`.

---

#### **4. Volumes**
##### **Tipos de Volumes**
- **Locais:** Armazenados no host.
- **Remotos:** Usam drivers para armazenamento em rede, como NFS ou serviços na nuvem.

##### **Comandos para Gerenciamento**
- **Criar Volume:**
  ```bash
  docker volume create my_volume
  ```
- **Listar Volumes:**
  ```bash
  docker volume ls
  ```
- **Montar em Containers:**
  ```bash
  docker run -d -p 8081:80 -v my_volume:/usr/share/nginx/html nginx
  ```

---

#### **5. Backup e Restauraçao**
##### **Backup:**
```bash
docker run --rm -v my_volume:/data -v $(pwd):/backup busybox tar czf /backup/backup.tar.gz /data
```
##### **Restauraçao:**
```bash
docker run --rm -v my_volume:/data -v $(pwd):/backup busybox tar xzf /backup/backup.tar.gz -C /
```

---

#### **Comparaçao: Volumes vs Bind Mounts**
| **Criterio**          | **Volumes**                                | **Bind Mounts**                          |
|------------------------|-------------------------------------------|------------------------------------------|
| **Gerenciamento**      | Pelo Docker                              | Pelo desenvolvedor/host                  |
| **Portabilidade**      | Independente do host                     | Depende da estrutura do host             |
| **Segurança**          | Melhor isolamento                        | Maior risco sem configuraçao adequada    |
| **Uso Recomendado**    | Produçao e dados sensiveis               | Desenvolvimento e acesso a arquivos do host |

Em resumo, **volumes** sao ideais para produçao devido à segurança e portabilidade, enquanto **bind mounts** sao mais adequados para desenvolvimento por sua flexibilidade.
