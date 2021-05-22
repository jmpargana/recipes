FROM node:alpine AS client
COPY client /app
WORKDIR /app
RUN npm run clean:test && npm ci && npm run build

FROM golang:1.16
COPY --from=client /app/build /recipes/build
COPY server /recipes
WORKDIR /recipes
RUN go get && go build
CMD ["./recipes"]
