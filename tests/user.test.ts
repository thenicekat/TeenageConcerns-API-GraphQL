import { db } from "../src/data-source";
import { testMutation } from "./testKit";
import { UserRegister } from "./../graphql/mutations/userRegister";
import { Mentor } from './../src/entity/Mentor';
import { faker } from "@faker-js/faker";
import { MentorRegisterMutation } from "../graphql/mutations/mentorRegisterMutation";
import { User } from "../src/entity/User";
import { UserLogin } from './../graphql/mutations/userLogin';
import { UserDelete } from './../graphql/mutations/userDelete';
import { pubSub } from './../src/schema';

beforeAll(async () => {
  await db.initialize();
});

describe("Tests the user endpoints", () => {
    it("creates a test user without existing mentors", async () => {
        const res = await testMutation({
            source: UserRegister,
            isMentor: false,
        });

        expect(res).toBeDefined();
        expect(res.data).toBeDefined();
        expect(res.data?.userCreate).toBeDefined();

        expect(res.data?.userCreate.user).toBeNull();
        expect(res.data?.userCreate.errors).toBeDefined();

        expect(res.data?.userCreate.errors[0].message).toMatch(
        /No Mentors Available/
        );
        expect(res.data?.userCreate.errors[0].field).toMatch(/user/);
    });

    let tempMentor: any;
    let mentor: Mentor;
    let user: User;

    it("creates a test mentor", () => {
        tempMentor = {
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
    });

    it("registers a test mentor", async () => {
        const result = await testMutation({
            source: MentorRegisterMutation,
            variables: {
            name: tempMentor.name,
            email: tempMentor.email,
            password: tempMentor.password,
            },
        });

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
        const res = await testMutation({
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

    it('logs in with uuid', async () => {
        const res = await testMutation({
            source: UserLogin,
            variables: {
                uuid: user.uuid
            }
        })

        expect(res.data).toBeDefined()
        expect(res.data?.userLogin).toBeDefined()

        expect(res.data?.userLogin.errors).toBeNull()

        expect(res.data?.userLogin.user).toBeDefined()
        expect(res.data?.userLogin.user).toStrictEqual(user)
    })

    it('deletes the user account when user is not logged in', async () => {
        const res = await testMutation({
            source: UserDelete,
            variables: {
                uuid: user.uuid
            }
        })

        expect(res).toBeDefined();
        expect(res.errors).toBeDefined();

        expect(res.data).toBeNull();

        expect(res.errors?.toString()).toMatch(
        /Not an Authenticated User/
        );
    })

    it('deletes the user account when user is logged in', async () => {
        const res = await testMutation({
            source: UserDelete,
            variables: {
                uuid: user.uuid
            },
            isMentor: false,
            userId: user.uuid
        })

        expect(res).toBeDefined();
        expect(res.data).toBeDefined();
        expect(res.data?.userDelete).toBeDefined();

        expect(res.data?.userDelete).toBeTruthy();
    })
});

afterAll(() => {
  db.destroy();
  pubSub.close();
});
