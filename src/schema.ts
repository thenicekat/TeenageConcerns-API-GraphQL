import Redis from "ioredis";
import { RedisPubSub } from "graphql-redis-subscriptions";

import { buildSchema } from "type-graphql";

import { CommonResolver } from "./resolvers/common.resolver";
import { MentorResolver } from "./resolvers/mentor.resolver";
import { MessageResolver } from "./resolvers/message.resolver";
import { UserResolver } from "./resolvers/user.resolver";

export const pubSub = new RedisPubSub({
  publisher: new Redis({ host: "redis" }),
  subscriber: new Redis({ host: "redis" }),
});

export const createSchema = () => buildSchema({
  resolvers: [UserResolver, MentorResolver, CommonResolver, MessageResolver],
  validate: false,
  pubSub: pubSub,
});