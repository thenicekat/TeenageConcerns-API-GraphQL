import { Arg, Ctx, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { v4 as uuidv4 } from 'uuid';
import { Context, UserReturn } from '../types';

import { User } from '../entity/User';
import { Mentor } from "../entity/Mentor";
import { isAuthUser } from "../middleware/auth.middleware";
import { sendEmail } from "../utils/sendEmail";


@Resolver()
export class UserResolver {
    //Login an User
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

        if (resultUser == undefined) {
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

    //Create a new User
    @Mutation(() => UserReturn)
    async userCreate(
        @Ctx() { db, req }: Context
    ): Promise<UserReturn> {
        const newUUID = uuidv4();
        const mentors = await db.manager.find(Mentor, {
            order: {
                rating: "DESC"
            }
        });

        // Check if mentors are available
        if (mentors.length < 1) {
            return {
                errors: [{
                    field: "user",
                    message: "No Mentors Available"
                }]
            }
        }

        //Find the first user who is free to work
        let i;
        for (i = 0; i < mentors.length; i++) {
            if (mentors[i].freeToWork) {
                break;
            }
        }

        if (i >= mentors.length) {
            return {
                errors: [{
                    field: "Mentor Avaliablility",
                    message: "No Free Mentor Available"
                }]
            }
        }

        // Create a user
        const user = db.manager.create(User, {
            uuid: newUUID,
            mentorId: mentors[i].id
        })
        await db.manager.save(user);
        mentors[i].noOfUsers = mentors[i].noOfUsers + 1;
        await db.manager.save(mentors[i]);

        //Send an email to the mentor
        await sendEmail(mentors[i].email, user);

        const resultUser = await db.getRepository(User).
            createQueryBuilder("user")
            .innerJoinAndSelect(
                "user.mentor",
                "m",
                'm.id = user.mentorId'
            )
            .where({ id: user.id })
            .getOne();

        if (resultUser == undefined) {
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

    //Delete an user
    @UseMiddleware(isAuthUser)
    @Mutation(() => Boolean)
    async userDelete(
        @Arg('uuid') uuid: string,
        @Ctx() { req, db }: Context
    ) {
        const user = await User.find({
            where: { uuid: uuid }
        });
        if (!user.length) return false;
        await User.delete({
            uuid: uuid
        })
        const mentor = await Mentor.findOne({
            where: {
                id: user[0].mentorId
            }
        })
        const updatedUserLength = mentor?.noOfUsers && (mentor?.noOfUsers - 1);
        await db.manager.save(Mentor, {
            ...mentor,
            noOfUsers: updatedUserLength
        })
        req.session.destroy((err) => {
            return err && false;
        })
        return true;
    }

    //Logout an user
    @UseMiddleware(isAuthUser)
    @Mutation(() => Boolean)
    userLogout(@Ctx() { req }: Context) {
        return new Promise((res) =>
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                    res(false);
                }
                res(true);
            })
        );
    }
}