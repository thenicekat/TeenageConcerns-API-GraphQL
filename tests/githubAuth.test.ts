import { testMutation } from './testKit';
import { GithubAuthURLMutation } from './../graphql/mutations/githubAuthURLMutation';
import { GITHUB_CLIENT_ID } from '../src/constants';
import { db } from '../src/data-source';

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
})

afterAll(() => {
    db.destroy();
});
