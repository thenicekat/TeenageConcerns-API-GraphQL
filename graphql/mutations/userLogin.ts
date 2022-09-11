export const UserLogin = `
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
                rating
                freeToWork
                noOfUsers
                updatedAt
            }
            mentorId
            uuid
            updatedAt
        }
    }
}`;