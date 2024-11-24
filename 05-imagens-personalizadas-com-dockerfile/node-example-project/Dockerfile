# ARG é uma variável que pode ser passada na hora de buildar a imagem
ARG NODE_VERSION=18.19.1
# Imagem base, no caso a imagem do node
FROM node:${NODE_VERSION}

# Variáveis de ambiente, que podem ser passadas na hora de buildar a 
# imagem e substituir o valor setado pelo software. 
# Ao contrario do ARG, esses valores podem ser usados no projeto.
ENV PORT=3001
ENV MESSAGE="Hello Docker!"

# Copia o arquivo package.json para a pasta /app do container. 
# A pasta /app é criada automaticamente pelo Docker.
WORKDIR /app

# Copia o arquivo package.json para a pasta /app do container.
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todos os arquivos do diretório atual para a pasta /app do container.
COPY . .

# Adiciona o usuário mynode ao container
RUN useradd -m mynode

USER mynode
# USER 1001 = Para usar o usuário padrão do sistema operacional

# HEALTHCHECK é uma instrução que permite que você verifique a saúde do seu aplicativo.
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \ 
    CMD [ "curl", "-f", "http://localhost:3001" ]

# VOLUME é uma instrução que cria um ponto de montagem com o nome especificado e marca-o para armazenamento persistente.
VOLUME /app/data

# Expõe a porta 3001 do container
EXPOSE ${PORT}
# executa o arquivo index.js
CMD ["node", "index.js"]


