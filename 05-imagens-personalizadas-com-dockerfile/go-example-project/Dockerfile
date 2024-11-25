FROM golang:latest AS builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 go build -o server main.go

FROM scratch
COPY --from=builder /app/server /app/server
# CMD ["./server"] 
# cmd é substituído pelo comando que será executado quando o container for iniciado
# Idealmente, o comando deve ser o mesmo que o ENTRYPOINT do container base
ENTRYPOINT ["./server"]