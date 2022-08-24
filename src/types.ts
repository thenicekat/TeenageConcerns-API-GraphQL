import { Request, Response } from "express";
import { ObjectType, Field } from "type-graphql";
import { DataSource } from "typeorm";
import { Session } from "express-session";

export type Context = {
    db: DataSource,
    req: Request & { session?: Session & { isMentor?: boolean, userId?: string, mentorId?: number } },
    res: Response
}

@ObjectType()
export class ErrorType {
    @Field()
    field: string

    @Field()
    message: string
}