"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (receiverEmail, user) => {
    if (!receiverEmail) {
        throw new Error("Did not find any receiver");
    }
    let transporter = nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: "jnihrxph5zd2lr3b@ethereal.email",
            pass: "mUKgcuABq8HCHDFTV2",
        },
    });
    let emailResponse = await transporter.sendMail({
        from: "teenageconcerns@gmail.com",
        to: receiverEmail,
        subject: "New User has been assigned to you",
        text: "The following User has been assigned to you" + '\n' + JSON.stringify(user, null, 4)
    });
    console.log("Email Sent: ", emailResponse.messageId);
    console.log("Email Response URL: ", nodemailer_1.default.getTestMessageUrl(emailResponse));
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=sendEmail.js.map