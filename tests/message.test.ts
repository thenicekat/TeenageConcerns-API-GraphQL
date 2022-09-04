// import { testMutation, testSubscription } from './testKit';
import "reflect-metadata";
import { SendMessage } from './../graphql/mutations/sendMutation';
import { pubSub } from './../src/schema';
import { ReceiveMessage } from './../graphql/subscriptions/receiveMessage';
// import { graphql } from 'graphql';
import { graphql, GraphQLSchema, parse, subscribe } from "graphql";
import { createSchema } from "../src/schema";

let schema: GraphQLSchema;

describe('test the messaging resolver', () => {
    it('tests the messaging service', async () => {
        if (!schema) schema = await createSchema();
        // const triggerSubscription = testMutation({
        //     source: SendMessage,
        //     variables: {
        //         message: "Hello!",
        //         channel: "testChannel"
        //     }
        // })

        // const result: any = await testSubscription({
        //     subscription: ReceiveMessage,
        //     mutation: triggerSubscription, 
        //     variablesSubscription: {
        //         topic: "testChannel"
        //     }
        // })

        const triggerSubscription = graphql({
            schema: schema,
            source: SendMessage,
            variableValues: {
                message: "Hello!",
                channel: "testChannel"
            }
        });

        const result: any = await subscribe({
            schema: schema,
            document: parse(ReceiveMessage),
            rootValue: triggerSubscription,
            variableValues: {
                topic: "testChannel"
            }
        });

        expect((await result.next()).value.data).toEqual({
            UserAdded: {
              user: {
                name: 'Awesome Name',
                username: 'awesomeusername',
                email: null,
                isActive: true,
                followers: {
                  totalCount: 0,
                },
                following: {
                  totalCount: 0,
                },
              },
            }
          });
          
    })
})

afterAll(() => {
    pubSub.close();
})