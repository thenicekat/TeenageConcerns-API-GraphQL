import axios from "axios";
import { Context, MentorReturn } from "../types";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URL, GITHUB_CLIENT_SECRET } from './../constants';
import { Mentor } from "../entity/Mentor";

@Resolver()
export class GithubAuthResolver {
    @Mutation(() => String)
    githubAuthURL() {
        return "https://github.com/login/oauth/authorize?scope=user:email&client_id=" + GITHUB_CLIENT_ID;
    }

    @Mutation(() => MentorReturn)
    async githubAuth(
        @Arg("code") code: string,
        @Ctx() { db }: Context
    ): Promise<MentorReturn> {

        const res = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: GITHUB_CLIENT_ID,
            code: code,
            redirect_url: GITHUB_REDIRECT_URL,
            client_secret: GITHUB_CLIENT_SECRET
        }, {
            headers: {
                "Accept": "application/json"
            }
        })

        if(!res.data.access_token){
            return {
                errors: [{
                    field: res.data.error,
                    message: res.data.error_description as string
                }]
            }
        } 

        const resp = await axios.get('https://api.github.com/user', {
            headers: {
                "Authorization": "Bearer " + res.data.access_token
            }
        });

        const mentor = await db.manager.findOne(Mentor, {
            where: {
                email: resp.data.email as string
            }
        })

        if (!mentor) {
            console.log("Mentor does not exist, Creating new account")
            //Uses username instead of name to create a new account
            const mentor = db.manager.create(Mentor, {
                name: resp.data.login as string,
                email: resp.data.email as string,
                users: []
            })

            try {
                await db.manager.save(mentor);
                return {
                    mentor: mentor
                };
            }
            catch (e) {
                if (e.message.includes("duplicate key value")) {
                    return {
                        errors: [
                            {
                                field: "email",
                                message: "Account already exists",
                            },
                        ],
                    };
                }
            }
        }else{
            console.log("Mentor Already Exists Login")
            return {
                mentor: mentor
            }
        }

        return {
            errors: [{
                field: "Github Registration Auth",
                message: "Some error occured"
            }]
        }

    }
}