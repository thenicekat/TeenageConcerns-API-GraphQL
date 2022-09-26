import { testMutation } from './testKit';
import { GoogleAuthURL } from './../graphql/mutations/gauthURLMutation';
import { db } from '../src/data-source';
import { pubSub } from '../src/schema';
import { GAUTH_REDIRECT_URL } from './../src/constants';

beforeAll(async () => {
    await db.initialize();
})

describe('test the google auth resolver', () => {
    it('tests if we are getting the correct URL or not', async () => {
        const URL = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&include_granted_scopes=true&response_type=code&client_id=TESTING_CLIENT_ID&redirect_uri=" + GAUTH_REDIRECT_URL
        const res = await testMutation({
            source: GoogleAuthURL,
        })

        expect(res).toBeDefined();
        expect(res.errors).toBeUndefined();

        expect(res.data).toBeDefined();
        expect(res.data?.googleAuthURL).toBe(URL)
    })
})

afterAll(async () => {
    await db.destroy();
    await pubSub.close();;
})