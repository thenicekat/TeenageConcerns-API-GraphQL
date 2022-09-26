import axios from "axios";
import argon2 from 'argon2';
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
    async githubAuthRegister(
        @Arg("code") code: string,
        @Arg("password") password: string,
        @Ctx() { db }: Context
    ) {
        axios.post('https://github.com/login/oauth/access_token', {
            client_id: GITHUB_CLIENT_ID,
            code: code,
            redirect_url: GITHUB_REDIRECT_URL,
            client_secret: GITHUB_CLIENT_SECRET
        }, {
            headers: {
                "Accept": "application/json"
            }
        })
        .then(res => {
            axios.get('https://api.github.com/user', {
                headers: {
                    "Authorization": "Bearer " + res.data.access_token
                }
            })
            .then(async resp => {
                const mentor = await db.manager.findOne(Mentor, {
                    where: {
                        email: resp.data.email as string
                    }
                })

                if (!mentor) {
                    //If mentor doesn't exist
                    //Uses username instead of name
                    const hash = await argon2.hash(password);
                    const mentor = db.manager.create(Mentor, {
                        name: resp.data.login as string,
                        email: resp.data.email as string,
                        password: hash,
                        users: []
                    })

                    try {
                        await db.manager.save(mentor);
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

                    return {
                        userInfo: mentor
                    };
                }

                return {
                    errors: [{
                        field: "Github Registration",
                        message: "Error using github auth"
                    }]
                }
            })
            .catch(err => console.log(err))   
        })
        .catch(err => console.log(err))
    } 
}