import { MiddlewareFn } from "type-graphql";

export interface ValidateInputType {
    email: string
    password: string
    name?: string
}

export const isValidated: MiddlewareFn<ValidateInputType> = ({ args }, next) => {
    if(!args.email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)){
        throw new Error("Invalid Email Format")
    }
    return next();
}