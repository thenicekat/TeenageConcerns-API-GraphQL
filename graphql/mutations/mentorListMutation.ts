export const MentorListMutation = `
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
  }`;