import "reflect-metadata";
//Express and Apollo Server Imports
import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import express from "express";
import session from "express-session";
//Imports for web socker
import { useServer } from "graphql-ws/lib/use/ws";
import { createServer } from "http";
import ws from "ws";
//Importing env
require('dotenv').config()
//Importing Database
import { db } from "./data-source";
//Importing Redis
import Redis from "ioredis";
//Importing Constants
import { COOKIE_KEY, PORT, __local__, __prod__ } from "./constants";
//Importing chalk for colorful outputs
import chalk from "chalk";
//Importing schema
import { createSchema } from "./schema";

//Redis store for storing the cookies
let redisStore = connectRedis(session);

db.initialize()
  .then(async () => {
    const app = express();
    const server = createServer(app);

    const redis = new Redis({
      host: __local__ ? "localhost" : "redis"
    });

    app.use(
      session({
        name: "tc-session-id",
        secret: COOKIE_KEY,
        store: new redisStore({
          client: redis,
          disableTouch: true,
        }),
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 3,
          httpOnly: true,
          secure: __prod__,
          sameSite: "lax",
        },
        saveUninitialized: false,
        resave: false,
      })
    );

    const wsServer = new ws.Server({
      server,
      path: "/graphql",
    });

    const apolloServer = new ApolloServer({
      schema: await createSchema(),
      plugins: [
        {
          async serverWillStart() {
            return {
              async drainServer() {
                wsServer.close();
              },
            };
          },
        },
      ],
      context: ({ req, res }) => ({
        db: db,
        req,
        res,
      }),
    });

    useServer(
      { schema: await createSchema() },
      wsServer
    );

    await apolloServer.start();
    apolloServer.applyMiddleware({ app });

    server.listen(PORT, () => {
      console.log(chalk.blue(`Server is running on PORT ${PORT}`));
    });
  })
  .catch((err) => {
    console.log(chalk.red("DBError::> " + err));
  });
