import {
  Resolver,
  Subscription,
  Mutation,
  PubSub,
  Arg,
  Root,
  ObjectType,
  Field,
} from "type-graphql";
import { PubSubEngine } from "graphql-subscriptions";

@ObjectType()
class MessagePayload {
  @Field()
  message: string;
}

@Resolver()
export class MessageResolver {
    //Send a message
    @Mutation(() => String)
    async sendMessage(
        @Arg("channel") channel: string,
        @Arg("message") message: string,
        @PubSub() pubSub: PubSubEngine
    ): Promise<string> {
        await pubSub.publish(channel, { message });
        return message;
    }

    //Receive a message
    @Subscription(() => MessagePayload, {
        topics: ({ args }) => args.topic,
    })
    async receiveMessage(
        @Arg("topic") topic: string,
        @Root() root: MessagePayload
    ): Promise<MessagePayload> {
        console.log(topic)
        return root;
    }
}
