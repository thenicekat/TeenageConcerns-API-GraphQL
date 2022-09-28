export const GithubAuthRegisterMutation = `
mutation githubAuthRegisterMutation($code: String!, $password: String!) {
    githubAuthRegister(
        code: $code,
        password: $password
    ){
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