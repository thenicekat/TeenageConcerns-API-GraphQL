"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = exports.pubSub = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const graphql_redis_subscriptions_1 = require("graphql-redis-subscriptions");
const type_graphql_1 = require("type-graphql");
const common_resolver_1 = require("./resolvers/common.resolver");
const mentor_resolver_1 = require("./resolvers/mentor.resolver");
const message_resolver_1 = require("./resolvers/message.resolver");
const user_resolver_1 = require("./resolvers/user.resolver");
const gauth_resolver_1 = require("./resolvers/gauth.resolver");
const constants_1 = require("./constants");
const twitterAuth_resolver_1 = require("./resolvers/twitterAuth.resolver");
const githubAuth_resolver_1 = require("./resolvers/githubAuth.resolver");
exports.pubSub = new graphql_redis_subscriptions_1.RedisPubSub({
    publisher: new ioredis_1.default({ host: constants_1.__local__ ? "localhost" : "redis" }),
    subscriber: new ioredis_1.default({ host: constants_1.__local__ ? "localhost" : "redis" }),
});
const createSchema = () => (0, type_graphql_1.buildSchema)({
    resolvers: [user_resolver_1.UserResolver, mentor_resolver_1.MentorResolver, common_resolver_1.CommonResolver, message_resolver_1.MessageResolver, gauth_resolver_1.GoogleAuthResolver, twitterAuth_resolver_1.TwitterAuthResolver, githubAuth_resolver_1.GithubAuthResolver],
    validate: false,
    pubSub: exports.pubSub,
});
exports.createSchema = createSchema;
//# sourceMappingURL=schema.js.map