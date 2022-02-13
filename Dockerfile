FROM node:alpine AS client
COPY client /app
WORKDIR /app
RUN npm i && npm run build

FROM golang:1.16 AS server
COPY server /recipes
WORKDIR /recipes
RUN go get && GOOS=linux CGO_ENABLED=0 go build -o fastserver

FROM alpine:latest
COPY --from=client /app/public /app/public
COPY --from=server /recipes/fastserver /app/fastserver
WORKDIR /app
ENTRYPOINT ["./fastserver"]
