import { testCall } from "./testCall";
import { whoAmI } from "./../graphql/queries/whoami";
import { pubSub } from "./../src/schema";
import { faker } from "@faker-js/faker";
import { MentorRegisterMutation } from "../graphql/mutations/mentorRegisterMutation";
import { Mentor } from "../src/entity/Mentor";
import { db } from "./../src/data-source";
import { UserRegister } from "../graphql/mutations/userRegister";
import { User } from './../src/entity/User';

beforeAll(async () => {
    await db.initialize();
});

describe("Tests the whoami query", () => {
    it("whoami when no details are given", async () => {
        const res = await testCall({
            source: whoAmI,
        });

        expect(res.data).toBeDefined();
        expect(res.data?.whoAmI).toBeDefined();
        expect(res.data?.whoAmI.userId).toBeNull();
        expect(res.data?.whoAmI.mentorId).toBeNull();
    });

    let user: User;
    let mentor: Mentor;
    let tempMentor: any;

    it("creates a test mentor", () => {
        tempMentor = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
    });

    it("registers a test mentor", async () => {
        const result = await testCall({
            source: MentorRegisterMutation,
            variables: {
                name: tempMentor.name,
                email: tempMentor.email,
                password: tempMentor.password,
            },
        });

        console.log(result);
        expect(result).toBeDefined();

        expect(result.errors).toBeUndefined();

        expect(result.data?.mentorRegister).toBeDefined();
        expect(result.data?.mentorRegister.mentor).toBeDefined();

        expect(result.data?.mentorRegister.mentor.name).toBe(tempMentor.name);
        expect(result.data?.mentorRegister.mentor.email).toBe(tempMentor.email);
        expect(result.data?.mentorRegister.mentor.noOfUsers).toBe(0);

        mentor = result.data?.mentorRegister.mentor;
    });

    it('creates a test user with existing mentors', async () => {
        const res = await testCall({
            source: UserRegister,
            isMentor: false,
        });

        expect(res).toBeDefined();
        expect(res.data).toBeDefined();
        expect(res.data?.userCreate).toBeDefined();

        expect(res.data?.userCreate.user).toBeDefined();
        expect(res.data?.userCreate.errors).toBeNull();

        expect(res.data?.userCreate.user.mentorId).toBe(mentor.id)

        user = res.data?.userCreate.user;
    })

    it("whoami for mentor", async () => {
        const res = await testCall({
            source: whoAmI,
            mentorId: mentor.id,
            isMentor: true,
        });

        expect(res.data).toBeDefined();
        expect(res.data?.whoAmI).toBeDefined();
        expect(res.data?.whoAmI.userId).toBeNull();
        expect(res.data?.whoAmI.mentorId).toBe(mentor.id);
    });

    it("whoami for user", async () => {
        const res = await testCall({
            source: whoAmI,
            userId: user.uuid,
            isMentor: false,
        });

        expect(res.data).toBeDefined();
        expect(res.data?.whoAmI).toBeDefined();
        expect(res.data?.whoAmI.userId).toBe(user.uuid);
        expect(res.data?.whoAmI.mentorId).toBeNull();
    });
});

afterAll(() => {
    db.destroy();
    pubSub.close();
});
