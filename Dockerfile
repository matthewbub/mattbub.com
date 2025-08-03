# Stage 1: Build Vite app
FROM node:20-alpine AS frontend-builder
WORKDIR /web
COPY web/package.json web/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY web/ .
RUN pnpm run build

# Stage 2: Build Go app
FROM golang:1.23-alpine AS backend-builder
WORKDIR /app
COPY go.mod ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags "-X main.GitCommit=$(git rev-parse HEAD)" -o matthewbub .

# Stage 3: Final image
FROM alpine:latest
RUN apk add --no-cache sqlite
WORKDIR /root/
COPY --from=backend-builder /app/matthewbub .
COPY --from=frontend-builder /web/dist ./web/dist
RUN mkdir -p data
EXPOSE 8090
CMD ["./matthewbub"]