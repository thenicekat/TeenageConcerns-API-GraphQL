export const MentorLoginMutation = `
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
`;