import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

import { buildSchema } from "type-graphql";

import { CommonResolver } from "./resolvers/common.resolver";
import { MentorResolver } from "./resolvers/mentor.resolver";
import { MessageResolver } from "./resolvers/message.resolver";
import { UserResolver } from "./resolvers/user.resolver";
import { GoogleAuthResolver } from "./resolvers/gauth.resolver";
import { __local__ } from "./constants";

export const pubSub = new RedisPubSub({
  publisher: new Redis({ host: __local__ ? "localhost" : "redis" }),
  subscriber: new Redis({ host: __local__ ? "localhost" : "redis" }),
});

export const createSchema = () => buildSchema({
  resolvers: [UserResolver, MentorResolver, CommonResolver, MessageResolver, GoogleAuthResolver],
  validate: false,
  pubSub: pubSub,
});