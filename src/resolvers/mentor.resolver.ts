import { Mentor } from "../entity/Mentor";
import { Context } from "../types";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver, UseMiddleware } from "type-graphql";
import argon2 from "argon2";
import { ErrorType } from "../types";
import { isAuthMentor } from "../middleware/auth.middleware";
import { isAuthUser } from './../middleware/auth.middleware';

@ObjectType()
export class MentorReturn {
  @Field(() => Mentor, { nullable: true })
  mentor?: Mentor;

  @Field(() => [ErrorType], { nullable: true })
  errors?: ErrorType[];
}

@Resolver()
export class MentorResolver {
  @Mutation(() => MentorReturn)
  async mentorRegister(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { db, req }: Context
  ): Promise<MentorReturn> {
    if (!name || !email || !password) {
      return {
        errors: [
          {
            field: "all",
            message: "Invalid Form of Credentials",
          },
        ],
      };
    }

    const hash = await argon2.hash(password);
    const mentor = db.manager.create(Mentor, {
      name,
      email,
      password: hash,
      users: [],
    });
    try {
      await db.manager.save(mentor);
    } catch (e) {
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

    req.session.isMentor = true;
    req.session.mentorId = mentor.id;

    return { mentor };
  }

  @Mutation(() => MentorReturn)
  async mentorLogin(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { db, req }: Context
  ): Promise<MentorReturn> {
    if (!email || !password) {
      return {
        errors: [
          {
            field: "all",
            message: "Invalid Form of Credentials",
          },
        ],
      };
    }

    const mentor = await db
      .getRepository(Mentor)
      .createQueryBuilder("mentor")
      .leftJoinAndSelect("mentor.users", "user")
      .where("user.mentorId = mentor.id")
      .where("mentor.email = :email", { email: email })
      .getOne();

    if (!mentor) {
      return {
        errors: [
          {
            field: "email",
            message: "account doesn't exist",
          },
        ],
      };
    }

    const verified = await argon2.verify(mentor.password, password);

    if (!verified) {
      return {
        errors: [
          {
            field: "password",
            message: "password doesn't match",
          },
        ],
      };
    }

    req.session.isMentor = true;
    req.session.mentorId = mentor.id;

    return { mentor };
  }

  @UseMiddleware(isAuthMentor)
  @Mutation(() => Boolean)
  mentorLogout(@Ctx() { req }: Context) {
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

  @UseMiddleware(isAuthUser)
  @Mutation(() => Number)
  async mentorRate(
    @Arg("rating") rating: number,
    @Arg("id") id: number,
    @Ctx() { db }: Context
  ) {
    //Get existing Rating
    const mentor = await db.getRepository(Mentor).findOne({
      where: { id: id }
    })

    //If mentor doesn't exist
    if (!mentor) {
      return 0;
    }

    //Calculate new rating from the existing rating and save it
    const newRating = mentor?.rating == 0 ? rating : ((Number(mentor?.rating) + rating) /2)
    //console.log(Number(mentor?.rating), rating, newRating)
    const res = await db.manager.save(Mentor, {
      id: id,
      rating: newRating
    })

    if(res) return newRating;
    return 0;
  }

  @Mutation(() => Boolean)
  async mentorChangeWorkState(
    @Arg("id") id: number,
    @Ctx() { db }: Context
  ){
    const mentor = await db.getRepository(Mentor).findOne({
      where: { id: id }
    })
    if(!mentor) return false;
    const currState = mentor?.freeToWork;
    const newState = !currState;
    const newMentor = {
      ...mentor,
      freeToWork: newState
    }
    await db.manager.save(Mentor, newMentor);
    return true;
  }
}
