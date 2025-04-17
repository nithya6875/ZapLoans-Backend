import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Link,
  Section,
  Hr,
} from "@react-email/components";
import { welcomeEmailStyles } from "../styles/welcome-email-styles";

// Define the props type
interface WelcomeEmailTemplateProps {
  username: string;
}

// Define the component
export const WelcomeEmailTemplate = ({
  username,
}: WelcomeEmailTemplateProps) => (
  <Html>
    <Head />
    <Body style={welcomeEmailStyles.body}>
      <Container style={welcomeEmailStyles.container}>
        <Section style={welcomeEmailStyles.content}>
          <Heading style={welcomeEmailStyles.heading}>
            Welcome to ZapLoans, {username}!
          </Heading>

          <Text style={welcomeEmailStyles.text}>
            Thank you for joining ZapLoans! We're thrilled to have you as part
            of our community. Our platform is designed to help you discover
            exciting career opportunities and connect with top employers in your
            field.
          </Text>

          <Text style={{ ...welcomeEmailStyles.text, textAlign: "center" }}>
            <Button
              href="https://zaploans.com"
              style={welcomeEmailStyles.button}
            >
              Explore Opportunities
            </Button>
          </Text>

          <Heading as="h2" style={welcomeEmailStyles.subheading}>
            What you can do now:
          </Heading>

          <ul style={welcomeEmailStyles.benefits}>
            <li style={welcomeEmailStyles.benefitItem}>
              Complete your profile to stand out to employers
            </li>
            <li style={welcomeEmailStyles.benefitItem}>
              Browse job listings tailored to your skills and preferences
            </li>
            <li style={welcomeEmailStyles.benefitItem}>
              Set up job alerts to never miss relevant opportunities
            </li>
            <li style={welcomeEmailStyles.benefitItem}>
              Access career resources and tips to help with your job search
            </li>
          </ul>

          <Hr style={welcomeEmailStyles.hr} />

          <Text style={welcomeEmailStyles.text}>
            If you have any questions or need assistance, our support team is
            always here to help. Simply reply to this email or contact us
            through our support portal.
          </Text>

          <Text style={welcomeEmailStyles.text}>
            We're excited to be part of your career journey!
          </Text>

          <Text style={welcomeEmailStyles.text}>
            Best regards,
            <br />
            The ZapLoans Team
          </Text>

          <div style={welcomeEmailStyles.socialLinks}>
            <Link href="#" style={welcomeEmailStyles.socialLink}>
              LinkedIn
            </Link>{" "}
            •
            <Link href="#" style={welcomeEmailStyles.socialLink}>
              Twitter
            </Link>{" "}
            •
            <Link href="#" style={welcomeEmailStyles.socialLink}>
              Instagram
            </Link>
          </div>

          <Text style={welcomeEmailStyles.footer}>
            © 2025 ZapLoans. All rights reserved.
            <br />
            This is an automated message. Please do not reply to this email.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
