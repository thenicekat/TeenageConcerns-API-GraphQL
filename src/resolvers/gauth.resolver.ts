import { google, oauth2_v2 } from 'googleapis';
import { GauthUserinfo } from '../types';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { GAUTH_CLIENT_ID, GAUTH_CLIENT_SECRET, GAUTH_REDIRECT_URL } from './../constants';

const oauth2Client = new google.auth.OAuth2(
  GAUTH_CLIENT_ID,
  GAUTH_CLIENT_SECRET,
  GAUTH_REDIRECT_URL
);  

@Resolver()
export class GoogleAuthResolver{
    @Mutation(() => String)
    getGoogleAuthURL(
    ) {         
          // Access scopes for read-only Drive activity.
          const scopes = [
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile'
          ];
          
          // Generate a url that asks permissions for the Drive activity scope
          const authorizationUrl = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',
            /** Pass in the scopes array defined above.
              * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
            scope: scopes,
            // Enable incremental authorization. Recommended as a best practice.
            include_granted_scopes: true
          });
          return authorizationUrl;
    }

    @Mutation(() => GauthUserinfo)
    async getGoogleUserInfo(
      @Arg("code") code: string
    ): Promise<oauth2_v2.Schema$Userinfo>{
      if(!code){
        throw Error("Invalid Credentials")
      }else{
        let { tokens } = await oauth2Client.getToken(decodeURIComponent(code));
        oauth2Client.setCredentials(tokens);

        const oauth = google.oauth2({
          auth: oauth2Client,
          version: 'v2'
        });

        const user = await oauth.userinfo.get();
        const { data } = user;
        return data;
      }
    }

    
}

