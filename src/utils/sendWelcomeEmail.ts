import { WelcomeEmailTemplate } from "../../emails/components/welcome-email";
import { resend } from "../lib/resend";

// Props for the welcome email
interface WelcomeEmailProps {
  email: string;
  username: string;
}

// Send an welcome email to the user
export const sendWelcomeEmail = async ({
  email,
  username,
}: WelcomeEmailProps) => {
  // Send the email using the Resend client
  const { error, data } = await resend.emails.send({
    from: "ZapLoans <welcome@souravbhowal.site>",
    to: email,
    subject: "Welcome to ZapLoans",
    react: WelcomeEmailTemplate({ username }),
  });

  // Log the error if any
  if (error) {
    console.error("Error send welcome mail: ", error);
  }

  // Return the data
  return data;
};
