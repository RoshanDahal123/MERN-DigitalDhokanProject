import nodemailer from "nodemailer";
import { envConfig } from "../config/config";

interface IData {
  to: string;
  subject: string;
  text: string;
}

const sendMail = async (data: IData) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: envConfig.email,
      pass: envConfig.emailPassword,
    },
  });
  const mailOptions = {
    from: "Digital Dokan<dahalroshan765@gmail.com>",
    to: data.to,
    subject: data.subject,
    text: data.text,
    //html:"<b> hello world</b>" we can send html too in this way
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};
export default sendMail;
