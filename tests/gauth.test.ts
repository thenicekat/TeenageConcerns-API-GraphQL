import { testMutation } from './testKit';
import { GoogleAuthURL } from './../graphql/mutations/gauthURLMutation';
import { db } from '../src/data-source';
import { pubSub } from '../src/schema';
import { GAUTH_CLIENT_ID, GAUTH_REDIRECT_URL, GAUTH_TESTING_EMAIL } from './../src/constants';
import puppeteer from 'puppeteer';

beforeAll(async () => {
    await db.initialize();
})

describe('test the google auth URL resolver', () => {
    it('tests if we are getting the correct URL or not', async () => {
        const URL = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&include_granted_scopes=true&response_type=code&client_id=" + GAUTH_CLIENT_ID + "&redirect_uri=" + encodeURIComponent(GAUTH_REDIRECT_URL)
        const res = await testMutation({
            source: GoogleAuthURL,
        })

        expect(res).toBeDefined();
        expect(res.errors).toBeUndefined();

        expect(res.data).toBeDefined();
        expect(decodeURI(res.data?.googleAuthURL)).toBe(decodeURI(URL))
    })
})

describe('tests if auth is going through using e2e testing', () => { 
    const URL = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&include_granted_scopes=true&response_type=code&client_id=" + GAUTH_CLIENT_ID + "&redirect_uri=" + encodeURIComponent(GAUTH_REDIRECT_URL)

    it('tests if we are getting the correct URL or not', async () => {
        const res = await testMutation({
            source: GoogleAuthURL,
        })

        expect(res).toBeDefined();
        expect(res.errors).toBeUndefined();

        expect(res.data).toBeDefined();
        expect(decodeURI(res.data?.googleAuthURL)).toBe(decodeURI(URL))
    })

    it('tests the auth flow using puppeteer', async () => {
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        await page.goto(URL);
        await page.type('input#identifierId', GAUTH_TESTING_EMAIL as string);
        await page.keyboard.press('Enter');
    })
})

afterAll(async () => {
    await db.destroy();
    await pubSub.close();;
})