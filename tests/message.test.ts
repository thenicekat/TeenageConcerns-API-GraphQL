// import { testMutation, testSubscription } from './testKit';
import "reflect-metadata";
import { SendMessage } from './../graphql/mutations/sendMutation';
import { ReceiveMessage } from './../graphql/subscriptions/receiveMessage';
import { testMutation, testSubscription } from "./testKit";

describe('test the messaging resolver', () => {
    it('tests the messaging service', async () => {
        const triggerSubscription = testMutation({
            source: SendMessage,
            variables: {
                message: "Hello!",
                channel: "testChannel"
            }
        })

        const result: any = await testSubscription({
            subscription: ReceiveMessage,
            mutation: triggerSubscription, 
            variablesSubscription: {
                topic: "testChannel"
            }
        })

        console.log(result.next());
          
    })
})

afterAll(() => {
})