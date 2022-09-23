# Teenage Concerns API - GraphQL Version

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