export const MentorRegisterMutation = `
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
            updatedAt
            createdAt
            noOfUsers
        }
    }
}
`;