# Manipulando Containers

## 1. **Executando o primeiro container**

- Para verificar se o docker esta instalado:
 ```bash
 docker run hello-world 
 ```
 este comando baixa a imagem *hello-world* (se necessario) e executa um container qu eexibe uma mensagem de confirmaçao. 

 ## 2. Nomeando e configurando containers

 - Nome personalizado:
 ```bash 
 docker run --name nginx-app nginx
 ```

  ```bash 
 docker run -d --name nginx-app nginx
 ```
Aqui, o "-d" significa "detached" ou "Desatachado" algo assim. Executa o container e nao "segura" o terminal. 

  ```bash 
 docker run -d -p 8080:80 nginx
 ```
 Aqui a porta 80 do container é mapeada para a porta 8080 do host;

 ## 3.Gerenciando Containers

### Listar containers: 

- *Apenas containers em execuçao*
```bash
docker ps
```
- *Todos os containers, incluindo os parados*
```bash
docker ps -a
```

### Parar, iniciar e remover containers.
- *Para o container*
```bash
docker stop nginx-app
```

- *Inicia o container*
```bash
docker start nginx-app
```
- *Remove o container*
```bash
docker rm nginx-app
```

- *Remove container de forma forçada*
```bash
docker rm -f nginx-app
```
## Attach e Detach
- *Conectar ao processo principal do container*
```bash
docker attach nginx-app
```
- Sair sem parar o container: 
 CTRL+P CTRL+Q

## Ececutando comandos;
- *Executar comando em um novo container*
```bash
docker run nginx ls -la
```

- *Acessar o bash em um novo container*
```bash
docker run -it nginx bash
```

- *Executar comando em container existente*
```bash
docker exec -it nginx-app bash
```

**Diferenças**:
- `docker run`: cria e inicia um novo container

- `docker exec`: Executa comandos em um container em execuçao.

- *Remover container automaticamente após execução*
```bash
docker run --rm nginx ls -la
```

## 6. Remoçao em massa

- *Remover totos os containers parados*
```bash
docker rm $(docker ps -a -q)
```

- *Remover Todos os containers. incluindo em execuçao*
```bash
docker rm -f $(docker ps -a -q)
```

## 7. Publicaçoes de portas 

- *Publicar a porta de um servidor Nginx*
```bash
docker run -d -p 8080:80 nginx
```
o Nginx fica acessivel em http://localhost:8080

8. Execuçao interativa e acesso ao shell

- *Acessar o shell de um container*
```bash
docker exec -it nginx-app bash
```

- Diferença:
    -docker exec: Abre um novo processo no container (ex.: shell bash).
    -docker attach: Conecta ao processo principal (ex.: visualizar logs em tempo real).