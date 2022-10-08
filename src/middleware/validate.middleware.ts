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
    if(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(args.password)){
        throw new Error("Check if the password contains Minimum 8 Characters,a Symbol, UpperCase Letter, LowerCase Letter and a number")
    }
    return next();
}