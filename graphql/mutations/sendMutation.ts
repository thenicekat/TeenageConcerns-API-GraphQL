export const SendMessage = `
mutation SendMessage($message: String!, $channel: String!){
    sendMessage(message: $message, channel: $channel)
}`;