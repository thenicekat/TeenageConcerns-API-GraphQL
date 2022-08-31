
// import { testMutation, testSubscription } from './testKit';
// import { SendMessage } from './../graphql/mutations/sendMutation';
// import { pubSub } from './../src/schema';
// import { ReceiveMessage } from './../graphql/subscriptions/receiveMessage';

// describe('test the messaging resolver', () => {
//     it('tests the messaging service', async () => {
//         const triggerSubscription = testMutation({
//             source: SendMessage,
//             variables: {
//                 message: "Hello!",
//                 channel: "testChannel"
//             }
//         })

//         const result = await testSubscription({
//             subscription: ReceiveMessage,
//             mutation: triggerSubscription, 
//             variablesSubscription: {
//                 topic: "testChannel"
//             }
//         })

//         expect((await result.next()).value.data).toEqual()
//     })
// })

// afterAll(() => {
//     pubSub.close();
// })