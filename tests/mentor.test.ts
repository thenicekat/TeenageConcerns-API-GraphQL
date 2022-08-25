import { faker } from "@faker-js/faker";
import { db } from "../src/data-source";
import { testMutation } from "./testKit";
import { MentorRegisterMutation } from "../graphql/mutations/mentorRegisterMutation";
import { MentorLoginMutation } from "../graphql/mutations/mentorLoginMutation";
import { Mentor } from './../src/entity/Mentor';
import { MentorLogoutMutation } from './../graphql/mutations/mentorLogoutMutation';
import { pubSub } from './../src/schema';

beforeAll(async () => {
  //Clear the database and initialize it
  await db.initialize();
});

describe("Tests the Mentor Endpoint", () => {
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

  it('logins in the test mentor', async () => {
    const res = await testMutation({
      source: MentorLoginMutation,
      variables: {
        email: tempMentor.email,
        password: tempMentor.password
      }
    })

    expect(res.errors).toBeUndefined();
    expect(res.data).toBeDefined();

    expect(res.data?.mentorLogin).toBeDefined();
    expect(res.data?.mentorLogin.mentor).toBeDefined();
    expect(res.data?.mentorLogin.mentor).toStrictEqual(mentor);
  });

  it('logging out the mentor without auth', async () => {
    const res = await testMutation({
      source: MentorLogoutMutation,
      isMentor: false
    })

    expect(res.errors).toBeDefined();
    expect(res.data).toBeNull();

    res.errors && expect(res.errors.toString()).toMatch(/Not an Authenticated Mentor/);
  })

  it('logging out the mentor with auth', async () => {
    const res = await testMutation({
      source: MentorLogoutMutation,
      isMentor: true,
      mentorId: mentor.id
    })

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();

    expect(res.data?.mentorLogout).toBeDefined();
    expect(res.data?.mentorLogout).toBeTruthy();
  })
});

afterAll(() => {
  db.destroy();
  pubSub.close();
});
