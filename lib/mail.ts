import nodemailer from "nodemailer";
import handlebars from "handlebars";
import toast from "react-hot-toast";
import { ThankYouTemplate } from "./designs/thank-you";
import { SelectedTemplate } from "./designs/selection-mail";
import { RejectedTemplate } from "./designs/rejection-mail";

export const sendMail = async ({
  to,
  name,
  subject,
  body,
}: {
  to: string;
  name: string;
  subject: string;
  body: string;
}) => {
  const { SMTP_PASSWORD, SMTP_EMAIL } = process.env;

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    const textResult = await transport.verify();
    console.log("Transport verified:", textResult);
  } catch (error) {
    console.log("Verification error:", error);
    toast.error((error as Error)?.message);
    return;
  }

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });
    console.log("Email sent:", sendResult);
    return sendResult;
  } catch (error) {
    console.log("Send error:", error);
    toast.error((error as Error)?.message);
  }
};


export const compileThankYouEmailTemplate = (name: string): string => {
    const template = handlebars.compile(ThankYouTemplate);
    const htmlBody = template({name});
    return htmlBody;
  };
export const compileSelectedEmailTemplate = (name: string): string => {
    const template = handlebars.compile(SelectedTemplate);
    const htmlBody = template({name});
    return htmlBody;
  };
export const compileRejectedEmailTemplate = (name: string): string => {
    const template = handlebars.compile(RejectedTemplate);
    const htmlBody = template({name});
    return htmlBody;
  };