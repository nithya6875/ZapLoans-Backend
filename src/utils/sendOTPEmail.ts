import { OTPEmailTemplate } from "../../emails/components/otp-email";
import { resend } from "../lib/resend";

// Props for the welcome email
interface WelcomeOTPProps {
  email: string;
  username: string;
  otp: string;
}

// Send an welcome email to the user
export const sendOTPEmail = async ({
  email,
  username,
  otp,
}: WelcomeOTPProps) => {
  // Send the email using the Resend client
  const { error, data } = await resend.emails.send({
    from: "ZapLoans <welcome@souravbhowal.site>",
    to: email,
    subject: "Verify your account",
    react: OTPEmailTemplate({ username, otp }),
  });

  // Log the error if any
  if (error) {
    console.error("Error send otp mail: ", error);
  }

  // Return the data
  return data;
};
