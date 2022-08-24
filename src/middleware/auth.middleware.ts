import { Context } from "../types";
import { MiddlewareFn } from "type-graphql";

export const isAuthUser: MiddlewareFn<Context> = ({ context }, next) => {
    if(!context.req.session.userId || context.req.session.isMentor){
        throw Error("Not an Authenticated User");
    }
    return next();
}

export const isAuthMentor: MiddlewareFn<Context> = ({ context }, next) => {
    if(context.req.session.userId || !context.req.session.isMentor){
        throw Error("Not an Authenticated Mentor");
    }
    return next();
}