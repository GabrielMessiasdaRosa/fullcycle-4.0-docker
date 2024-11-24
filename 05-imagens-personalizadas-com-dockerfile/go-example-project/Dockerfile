FROM golang:latest AS builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 go build -o server main.go

FROM scratch
COPY --from=builder /app/server /app/server
CMD ["./server"]