"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const apollo_server_express_1 = require("apollo-server-express");
const connect_redis_1 = __importDefault(require("connect-redis"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const ws_1 = require("graphql-ws/lib/use/ws");
const http_1 = require("http");
const ws_2 = __importDefault(require("ws"));
require('dotenv').config();
const data_source_1 = require("./data-source");
const ioredis_1 = __importDefault(require("ioredis"));
const constants_1 = require("./constants");
const chalk_1 = __importDefault(require("chalk"));
const schema_1 = require("./schema");
let redisStore = (0, connect_redis_1.default)(express_session_1.default);
data_source_1.db.initialize()
    .then(async () => {
    const app = (0, express_1.default)();
    const server = (0, http_1.createServer)(app);
    const redis = new ioredis_1.default({
        host: constants_1.__local__ ? "localhost" : "redis"
    });
    app.use((0, express_session_1.default)({
        name: "tc-session-id",
        secret: constants_1.COOKIE_KEY,
        store: new redisStore({
            client: redis,
            disableTouch: true,
        }),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 3,
            httpOnly: true,
            secure: constants_1.__prod__,
            sameSite: "lax",
        },
        saveUninitialized: false,
        resave: false,
    }));
    const wsServer = new ws_2.default.Server({
        server,
        path: "/graphql",
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, schema_1.createSchema)(),
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
            db: data_source_1.db,
            req,
            res,
        }),
    });
    (0, ws_1.useServer)({ schema: await (0, schema_1.createSchema)() }, wsServer);
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    server.listen(constants_1.PORT, () => {
        console.log(chalk_1.default.blue(`Server is running on PORT ${constants_1.PORT}`));
    });
})
    .catch((err) => {
    console.log(chalk_1.default.red("DBError::> " + err));
});
//# sourceMappingURL=index.js.map