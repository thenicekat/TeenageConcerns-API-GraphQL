export const UserDelete = `
mutation UserDelete($uuid: String!) {
    userDelete(
        uuid: $uuid
    )
}`;