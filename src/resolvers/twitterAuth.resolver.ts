import { Arg, Mutation, Resolver } from "type-graphql";
import Client, { auth } from "twitter-api-sdk";
import { TWITTER_CLIENT_SECRET, TWITTER_REDIRECT_URL, TWITTER_CLIENT_ID } from './../constants';

const authClient = new auth.OAuth2User({
    client_id: TWITTER_CLIENT_ID as string,
    client_secret: TWITTER_CLIENT_SECRET  as string,
    callback: TWITTER_REDIRECT_URL  as string,
    scopes: ["tweet.read", "users.read", "offline.access"],
});

@Resolver()
export class TwitterAuthResolver {
    @Mutation(() => String)
    twitterAuthURL() {
        const authUrl = authClient.generateAuthURL({
            state: "state",
            code_challenge_method: "plain",
            code_challenge: "code_challenge"
        });
        return authUrl;
    }

    @Mutation(() => Number)
    async twitterAuthRegister(
        @Arg("code") code: string
    ){
        authClient.generateAuthURL({
            state: "state",
            code_challenge_method: "plain",
            code_challenge: "code_challenge"
        });
        const token = await authClient.requestAccessToken(code);
        const client = new Client(token.token?.access_token as string);
        const data = await client.users.findMyUser({
            "tweet.fields":["text"]
        });
        console.log(data)
    }
}