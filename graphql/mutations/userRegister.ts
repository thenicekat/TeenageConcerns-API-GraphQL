export const UserRegister = `
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
}`;