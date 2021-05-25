FROM node:alpine AS client
COPY client /app
WORKDIR /app
RUN npm run clean:test && npm ci && npm run build

FROM golang:1.16 AS server
COPY server /recipes
WORKDIR /recipes
RUN go get && GOOS=linux CGO_ENABLED=0 go build

FROM alpine:latest
COPY --from=client /app/build /app/build
COPY --from=server /recipes/recipes /app/recipes
WORKDIR /app
ENTRYPOINT ["./recipes"]
