import { Arg, Ctx, Field, Mutation, ObjectType, Resolver, UseMiddleware } from "type-graphql";
import { v4 as uuidv4 } from 'uuid';
import { Context } from '../types';
import { ErrorType } from "../types";

import { User } from '../entity/User';
import { Mentor } from "../entity/Mentor";
import { isAuthUser } from "../middleware/auth.middleware";

@ObjectType()
export class UserReturn {
    @Field({ nullable: true })
    user?: User

    @Field(() => [ErrorType], { nullable: true })
    errors?: ErrorType[]
}

@Resolver()
export class UserResolver {
    @Mutation(() => UserReturn)
    async userLogin(
        @Arg("uuid") uuid: string,
        @Ctx() { db, req }: Context
    ): Promise<UserReturn> {
        const resultUser = await db.getRepository(User).
        createQueryBuilder("user")
        .innerJoinAndSelect(
            "user.mentor",
            "m",
            'm.id = user.mentorId'
        )
        .where({ uuid: uuid })
        .getOne();
        
        if(resultUser == undefined){
            return {
                errors: [{
                    field: "user",
                    message: "User does not exist or has been deleted"
                }]
            }
        }

        req.session.isMentor = false;
        req.session.userId = uuid;
        
        return { user: resultUser };
    }

    @Mutation(() => UserReturn)
    async userCreate (
        @Ctx() { db, req }: Context
    ): Promise<UserReturn>{
        const newUUID = uuidv4();
        const mentors = await db.manager.find(Mentor, {
            order: {
                noOfUsers: "ASC"
            }
        });

        // Check if mentors are available
        if(mentors.length < 1){
            return {
                errors: [{
                    field: "user",
                    message: "No Mentors Available"
                }]
            }
        }

        // Create a user
        const user = db.manager.create(User, {
            uuid: newUUID,
            mentorId: mentors[0].id
        })  
        await db.manager.save(user);
        mentors[0].noOfUsers = mentors[0].noOfUsers + 1;
        await db.manager.save(mentors[0]);

        const resultUser = await db.getRepository(User).
        createQueryBuilder("user")
        .innerJoinAndSelect(
            "user.mentor",
            "m",
            'm.id = user.mentorId'
        )
        .where({ id: user.id })
        .getOne();
        
        if(resultUser == undefined){
            return {
                errors: [{
                    field: "user",
                    message: "Error while creating user"
                }]
            }
        }

        req.session.isMentor = false;
        req.session.userId = newUUID;
        
        return { user: resultUser };
    }

    @UseMiddleware(isAuthUser)
    @Mutation(() => Boolean)
    async userDelete (
        @Arg('uuid') uuid: string,
        @Ctx() { req }: Context
    ){
        const user = await User.find({
            where: {uuid: uuid}
        });
        if(!user.length) return false;
        await User.delete({
            uuid: uuid
        })
        req.session.destroy((err) => {
            return err && false;
        })
        return true;
    }
}