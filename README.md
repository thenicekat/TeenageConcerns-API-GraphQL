# Teenage Concerns API - GraphQL Version

This backend web server is made using Graph QL and typescript and has made extensive use of libraries such as:
1. Type ORM - For managing Database connections
2. Type Graph QL - For Decorators etc.
3. Express/Apollo - For creating the server
4. Express-Session - This was used to store the session id on the cookie and link it with the Redis store

The main goal of this project is to connect users, a.k.a. mentees, with mentors. This project lets anonymous users register and get a mentor assigned to them with whom they can talk about anything they want, say life issues, depression, etc. This project was initially made using a react app and a REST API, but I wanted to try it again in Typescript and Graph QL, so I made it from scratch. The frontend, which is supposed to be made in Next JS, is still under development.
The Backend has the following features.

- Anonymous User - Registration using UUIDs
- Anonymous User - Log in using the same UUID
- Anonymous User - Delete Account using the same UUID
- Anonymous User - Rate the mentor he or she was allotted
- Mentor Registration
- Mentor Login
- Mentor Selection based on Rating → Higher Rating ⇒ Higher Chance of getting a user
- Chat between Mentor and a User using Graph QL Subscriptions

## Tests
Tests were also written for most of the mutations and queries. No tests were written for the subscriptions cause I actually didn’t find a way to do that. The API is also dockerized using a multi-stage Docker file (Which was actually one of my tasks). This project was dockerized, mostly because I was too lazy to run Postgres every time;-; it was a good learning experience to work with docker.

My tasks were the following:
- Implement proper user sessions. Generate session id for every login, then store all session information for that user in Redis and not in the cookie. Only the session id should be stored in the cookie. This was already implemented using connect-Redis and express session
- The cookie only stores the key for Redis, and the data is stored on the JSON Object on Redis
- Add input validation. Example - If a field is marked as email, one cannot enter “123@#!@#.com123” Added Input Validation middleware
- Model SQL table level dependency between user and mentor.
- Add Nginx in docker-compose-prod.Added HTTPS/HTTP redirection
- Added load balancing with 2 servers
- In docker-compose-prod, add a multi-stage docker build to cache results between docker-compose regular and production builds. Added multi-stage builds but couldn’t utilize the Docker file to its full extent because this project’s tests are on the docker-compose file, which is also dependent on the database.
- Add google OAuth and add both unit tests and e2e testing for your authentication endpoints - standard and OAuth.Added Google OAuth endpoints, 2 of them, one for getting the URL and one for getting data once the user gives consent
- Add Twitter OAuth - I couldn’t use it because it wasn’t giving emails in the v2 API SDK, so I was asked to use GitHub O Auth, which GitHub O Auth, and this is done.
- End-To-End testing for O Auth is done for Github, but I have no idea how to make it work for google.
- Add email and push notifications when a user signs up to the mentor, saying a new user has been assigned. Added node mailer, so a mail is sent to the respective mentor every time a user signs up.

## If you are using Docker 
### Installation
Run the command ```docker compose up --build```

### Testing
Run the command ```docker compose -f docker-compose.prod.yml run teenage-concerns-graphql-api yarn test```

## If you are running locally 
### Installation
Run `yarn dev` and go to http://localhost:5000/graphql to query the server

### Testing
Run `yarn test` to run the tests
Tests are written in the tests folder

## Queries and Mutation
### User:
1. Creates an user account using uuids
```
mutation CreateUser{
    userCreate{
        errors {
            field
            message
        }
        user {
            id
            uuid
            mentorId
            mentor{
                id
                email
                noOfUsers
                updatedAt
                createdAt
            }
            createdAt
            updatedAt
        }
    }
}
```
2. Logs in an user account
```
mutation UserLogin($uuid: String!) {
    userLogin(
        uuid: $uuid
    ){
        errors{
            field
            message
        }
        user{
            createdAt
            id
            mentor{
                createdAt
                email
                id
                noOfUsers
                updatedAt
            }
            mentorId
            uuid
            updatedAt
        }
    }
}
```
3. Deletes an user
```
mutation UserDelete($uuid: String!) {
    userDelete(
        uuid: $uuid
    )
}
```
4. Logs out a user
```
mutation UserLogout {
    userLogout
}
```
5. Gets a list of all users
```
mutation UserList {
    userList {
      id
      updatedAt
      createdAt
      uuid
      mentor {
        id
        updatedAt
        createdAt
      } 
      rating
      mentorId
    }
  }
```
---
### Mentor
1. Register a mentor
```
mutation MentorRegistration($email: String!, $password: String!, $name: String!) {
    mentorRegister(
        email: $email,
        password: $password,
        name: $name,
    ) {
        errors{
            field
            message
        }
        mentor{
            id
            name
            email
            rating
            freeToWork
            updatedAt
            createdAt
            noOfUsers
        }
    }
}
```
2. Login a mentor
```
mutation MentorLogin($email: String!, $password: String!) {
    mentorLogin(
        email: $email,
        password: $password,
    ) {
        errors{
            field
            message
        }
        mentor{
            id
            name
            email
            rating
            freeToWork
            updatedAt
            createdAt
            noOfUsers
        }
    }
}
```
3. Logout a mentor
```
mutation MentorLogout {
    mentorLogout
}
```
4. Rate a mentor
```
mutation MentorRate($mentorRateId: Float!, $rating: Float!) {
    mentorRate(id: $mentorRateId, rating: $rating)
}
```
5. Change Work State for a mentor
```
mutation MentorChangeWorkState($mentorChangeWorkStateId: Float!) {
    mentorChangeWorkState(id: $mentorChangeWorkStateId)
}
```
6. Get a list of all mentors
```
mutation MentorList {
    mentorList {
      id
      name
      email
      users {
        id
        createdAt
        updatedAt
        uuid
      }
      noOfUsers
      createdAt
      updatedAt
      rating
      freeToWork
    }
  }
```
---
### Messages and Chat
1. Send a message
```
mutation SendMessage($message: String!, $channel: String!){
    sendMessage(message: $message, channel: $channel)
}
```
2. Receive Messages
```
subscription ReceiveMessage($topic: String!) {
  receiveMessage(topic: $topic) {
    message
  }
}
```
