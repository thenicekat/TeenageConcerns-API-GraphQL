import { testMutation } from './testKit';
import { GithubAuthURLMutation } from './../graphql/mutations/githubAuthURLMutation';
import { GITHUB_CLIENT_ID } from '../src/constants';
import puppeteer from 'puppeteer';
import { GithubAuthRegisterMutation } from './../graphql/mutations/githubAuthRegisterMutation';
import { db } from '../src/data-source';
import { pubSub } from '../src/schema';

// jest.setTimeout(100000);

beforeAll(async () => {
    //Clear the database and initialize it
    await db.initialize();
});

describe('tests github auth using pupeteer', () => {
    const URL = "https://github.com/login/oauth/authorize?scope=user:email&client_id=" + GITHUB_CLIENT_ID;
    
    it('checks if the URL is correct or not', async () => {
        const res = await testMutation({
            source: GithubAuthURLMutation
        })

        expect(res).toBeDefined();
        expect(res.errors).toBeUndefined();

        expect(res.data).toBeDefined();
        expect(decodeURI(res.data?.githubAuthURL)).toBe(decodeURI(URL))
    })

    it('uses pupeteer to try to login', async () => {
        const browser = await puppeteer.launch({
            headless: true
        })

        const page = await browser.newPage();
        await page.goto(URL);
        await page.type('#login_field', process.env.GITHUB_TESTING_EMAIL as string);
        await page.type('#password', process.env.GITHUB_TESTING_PASSWORD as string);
        await page.keyboard.press('Enter');

        await page.waitForNavigation({
            waitUntil: 'networkidle0',
        });

        const currUrl = page.url();
        const code = currUrl.split("code=")[1];
        console.log(currUrl)

        const res = await testMutation({
            source: GithubAuthRegisterMutation,
            variables: {
                code: code,
                password: "temporary"
            }
        })

        expect(res).toBeDefined();

        expect(res.errors).toBeUndefined();

        expect(res.data?.mentorRegister).toBeDefined();
        expect(res.data?.mentorRegister.mentor).toBeDefined();

        expect(res.data?.mentorRegister.mentor.email).toBe(process.env.GITHUB_TESTING_EMAIL as string);
        expect(res.data?.mentorRegister.mentor.noOfUsers).toBe(0);
    })
})

afterAll(() => {
    db.destroy();
    pubSub.close();
});
