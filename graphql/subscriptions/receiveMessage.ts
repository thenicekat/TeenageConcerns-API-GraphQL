export const ReceiveMessage = `
subscription ReceiveMessage($topic: String!) {
    receiveMessage(topic: $topic) {
      message
    }
}`;