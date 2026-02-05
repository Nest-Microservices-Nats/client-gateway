
# Client Gateway 

The gateway is the entrypoint of comunication between are clients and services.

## Dev

1. clone repository
2. install dependencies `yarn` or `npm install`
3. clone file `.env.example` and rename to `.env`
4. Running all microservices
5. running project: `yarn start:dev` or `npm start:dev`

## Nats

```
docker run -d --name nats-main -p 4222:4222 -p 8222:8222 nats
```