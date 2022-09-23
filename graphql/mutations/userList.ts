export const UserList = `
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
  }`;