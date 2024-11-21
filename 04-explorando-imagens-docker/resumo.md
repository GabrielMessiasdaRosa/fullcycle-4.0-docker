# Explorando imagens docker

## 1. Imagens Docker
 - Imagens Docker sao pacotes imutaveis contendo codigo, libs e configs necessarias para executar aplicaçoes. Elas servem como modelo para criar containers. 

 ### Camadas de imagens
 - Contuidas em camadas, como cada instruçao do dockerfile criando uma nova.
 - Camadas sao compartilhadas entre imagens, economizando espaço e acelerando downloads.

 ### Tipos de imagens 

 - **Oficiais**: Mantidas pela comunidade ou pelo DOcker, confiaveis (ex: nginx, mysql)
 - **De terceiros**: Criadas por usuarios ou organizaços (ex: user/some-image)

 ## 2.Gerenciamento de Imagens
 ### Comandos basicos
- **Listar imagens locais**:
```bash
 docker images`
```
- **Remover imagem**:
```bash
 docker rmi nginx`
```
- **Inspecionar detalhes**:
```bash
 docker inspect nginx`
```

### Limpeza e filtros 
- **Remover imagens nao utilizadas**: 
```bash
docker image prune -a
```
- **Filtrar imagens por data ou tag**: 
```bash
docker images --filter before=nginx:1.19
```

## 3. Registres e Docker Hub
### Registries
- **Docker hub**: Principal Registry publico
- Outros: Amazon ECR, Google GCR, Azure ACR

### Busca e Download
- **Buscar imagens**: 
```bash
docker search ubuntu
```
- **Baixar Imagem**: 
```bash
docker pull nginx:tag
```

### Reoisitorios

***Publicos***: Acesso livre
**Privados**: Acesso restrito. ideial para imagens internas

### Organizaçao de tags
- Representam versoes (ex: nginx:1.22)
- padrao: latest (nginx:latest = nginx)

## 4. comandos uteis
- **Ver espaço em disco**: 
```bash
docker system df
```
- **Limpar recursos nao utilizados**: 
```bash
docker system prune
```

- **Remover multiplas imagens**: 
```bash
docker rmi $(docker images -q)
```
## 5. Segurança e SBOM
- **SBOM**. Lista de componentes e dependencias de uma imagem.
*imagens verificadas possuem segurança adicional, incluindo varreduras de vulnerabilidades*

## 6. Automaçao com docker hub
- **Build automatizado**: Integraçao com repositorios github
- **Webhooks**: Integraçao com pipelines CI/CD para notificaçoes e deploys automaticos.