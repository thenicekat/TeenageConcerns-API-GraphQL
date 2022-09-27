import { google } from 'googleapis';
import { Context, GauthUserReturn } from '../types';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { GAUTH_CLIENT_ID, GAUTH_CLIENT_SECRET, GAUTH_REDIRECT_URL } from '../constants';
import { Mentor } from '../entity/Mentor';
import argon2 from "argon2";

const oauth2Client = new google.auth.OAuth2(
  GAUTH_CLIENT_ID,
  GAUTH_CLIENT_SECRET,
  GAUTH_REDIRECT_URL
);  

@Resolver()
export class GoogleAuthResolver{
    @Mutation(() => String)
    googleAuthURL(
    ) {         
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
          return decodeURI(authorizationUrl);
    }

    @Mutation(() => GauthUserReturn)
    async googleUserRegister(
      @Ctx() { db }: Context,
      @Arg("code") code: string,
      @Arg("password") password: string
    ): Promise<GauthUserReturn>{
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

        const mentor = await db.manager.findOne(Mentor, {
          where: {
            email: data.email as string
          }
        })

        if(!mentor) {
          //If mentor doesn't exist
          const hash = await argon2.hash(password);
          const mentor = db.manager.create(Mentor, {
            name: data.name as string,
            email: data.email as string,
            password: hash,
            users: []
          })

          try{
            await db.manager.save(mentor);
          }
          catch (e) {
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

          return {
            userInfo: mentor
          };
        }
      }

      return {
        errors: [
          {
            field: "Mentor",
            message: "Some error occured"
          }
        ]
      }
    }    
}

