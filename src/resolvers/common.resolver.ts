import { Context } from "../types";
import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";

@ObjectType()
export class MeReturn{
    @Field({ nullable: true })
    mentorId?: number
    
    @Field({ nullable: true })
    userId?: string
}

@Resolver()
export class CommonResolver{
    //Check who the user is logged in as
    @Query(() => MeReturn, { nullable: true })
    whoAmI (
        @Ctx() { req }: Context
    ){
        if(req.session.isMentor){
            return {
                mentorId: req.session.mentorId,
            }
        }

        return {
            userId: req.session.userId,
        };
        
    }
}