"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const ws_1 = __importDefault(require("ws"));
const ws_2 = require("graphql-ws/lib/use/ws");
const http_1 = require("http");
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const type_graphql_1 = require("type-graphql");
const data_source_1 = require("./data-source");
const ioredis_1 = __importDefault(require("ioredis"));
const user_resolver_1 = require("./resolvers/user.resolver");
const mentor_resolver_1 = require("./resolvers/mentor.resolver");
const common_resolver_1 = require("./resolvers/common.resolver");
const constants_1 = require("./constants");
const chalk_1 = __importDefault(require("chalk"));
const message_resolver_1 = require("./resolvers/message.resolver");
let redisStore = (0, connect_redis_1.default)(express_session_1.default);
data_source_1.AppDataSource.initialize()
    .then(async () => {
    const app = (0, express_1.default)();
    const server = (0, http_1.createServer)(app);
    const redis = new ioredis_1.default();
    const pubSub = new graphql_redis_subscriptions_1.RedisPubSub({
        publisher: new ioredis_1.default(),
        subscriber: new ioredis_1.default(),
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
    const wsServer = new ws_1.default.Server({
        server,
        path: "/graphql",
    });
    const schema = (0, type_graphql_1.buildSchema)({
        resolvers: [
            user_resolver_1.UserResolver,
            mentor_resolver_1.MentorResolver,
            common_resolver_1.CommonResolver,
            message_resolver_1.MessageResolver,
        ],
        validate: false,
        pubSub: pubSub,
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await schema,
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
            db: data_source_1.AppDataSource,
            req,
            res,
        }),
    });
    (0, ws_2.useServer)({
        schema: await schema,
    }, wsServer);
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