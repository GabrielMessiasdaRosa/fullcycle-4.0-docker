
# Imagem base, no caso a imagem do node
FROM node:latest

# Copia o arquivo package.json para a pasta /app do container. 
# A pasta /app é criada automaticamente pelo Docker.
WORKDIR /app

# Copia todos os arquivos do diretório atual para a pasta /app do container.
COPY . .

# executa o arquivo index.js
CMD ["node", "index.js"]


