import "reflect-metadata";
import { graphql, GraphQLSchema } from "graphql";
import { Maybe } from "graphql/jsutils/Maybe";
import { createSchema } from "../src/schema";
import { db } from "./../src/data-source";

type Options = {
  source: string;
  variables?: Maybe<{
    [key: string]: any;
  }>;
  isMentor?: Boolean;
  userId?: String;
  mentorId?: number;
};

let schema: GraphQLSchema;

export const testCall = async ({
  source,
  variables,
  isMentor,
  userId,
  mentorId,
}: Options) => {
  if (!schema) schema = await createSchema();

  return graphql({
    schema,
    source,
    variableValues: variables,
    contextValue: {
      db: db,
      req: {
        session: {
          isMentor: isMentor,
          userId: userId,
          mentorId: mentorId,
          destroy: jest.fn().mockImplementation((fn) => fn(false))
        },
      },
    },
  });
};
