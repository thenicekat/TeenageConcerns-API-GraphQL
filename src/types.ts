import { Request, Response } from "express";
import { ObjectType, Field } from "type-graphql";
import { DataSource } from "typeorm";
import { Session } from "express-session";
import { User } from "./entity/User";
import { Mentor } from "./entity/Mentor";

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

@ObjectType()
export class UserReturn {
    @Field({ nullable: true })
    user?: User

    @Field(() => [ErrorType], { nullable: true })
    errors?: ErrorType[]
}

@ObjectType()
export class MentorReturn {
  @Field(() => Mentor, { nullable: true })
  mentor?: Mentor;

  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];
}

//User info returning from Google Oauth
@ObjectType()
export class GauthUserinfo {
    /**
     * The user's email address.
     */
    @Field(() => String, { nullable: true })
    email?: string | null;
    /**
     * The user's last name.
     */
    @Field(() => String, { nullable: true })
    family_name?: string | null;
    /**
     * The user's gender.
     */
    @Field(() => String, { nullable: true })
    gender?: string | null;
    /**
     * The user's first name.
     */
    @Field(() => String, { nullable: true })
    given_name?: string | null;
    /**
     * The hosted domain e.g. example.com if the user is Google apps user.
     */
    @Field(() => String, { nullable: true })
    hd?: string | null;
    /**
     * The obfuscated ID of the user.
     */
    @Field(() => String, { nullable: true })
    id?: string | null;
    /**
     * URL of the profile page.
     */
    @Field(() => String, { nullable: true })
    link?: string | null;
    /**
     * The user's preferred locale.
     */
    @Field(() => String, { nullable: true })
    locale?: string | null;
    /**
     * The user's full name.
     */
    @Field(() => String, { nullable: true })
    name?: string | null;
    /**
     * URL of the user's picture image.
     */
    @Field(() => String, { nullable: true })
    picture?: string | null;
    /**
     * Boolean flag which is true if the email address is verified. Always verified because we only return the user's primary email address.
     */
    @Field(() => Boolean, { nullable: true })
    verified_email?: boolean | null;
}
