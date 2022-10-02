import nodemailer from 'nodemailer';
import { User } from './../entity/User';

export const sendEmail = async (receiverEmail: string, user: User) => {
    if (!receiverEmail) {
        throw new Error("Did not find any receiver");
    }

    let testAccount = await nodemailer.createTestAccount();
    console.log(testAccount)
    // {
    //     user: 'jnihrxph5zd2lr3b@ethereal.email',
    //     pass: 'mUKgcuABq8HCHDFTV2',
    //     smtp: { host: 'smtp.ethereal.email', port: 587, secure: false },
    //     imap: { host: 'imap.ethereal.email', port: 993, secure: true },
    //     pop3: { host: 'pop3.ethereal.email', port: 995, secure: true },
    //     web: 'https://ethereal.email'
    // }

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: testAccount
    });

    let emailResponse = await transporter.sendMail({
        from: "teenageconcerns@gmail.com",
        to: receiverEmail,
        subject: "New User has been assigned to you",
        text: "The following User has been assigned to you" + '\n' + JSON.stringify(user, null, 4)
    })

    console.log("Email Sent: ", emailResponse.messageId);
    console.log("Email Response URL: ", nodemailer.getTestMessageUrl(emailResponse));
}