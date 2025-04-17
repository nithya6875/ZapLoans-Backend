// Colors and styles for the welcome email template
const welcomeEmailColors = {
  primary: "#EA580C",
  secondary: "#1e40af",
  background: "#f9fafb",
  text: "#374151",
  lightText: "#6b7280",
  border: "#e5e7eb",
};

export const welcomeEmailStyles = {
  body: {
    backgroundColor: welcomeEmailColors.background,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    margin: 0,
  },
  container: {
    margin: "0 auto",
    padding: "10px 5px",
    maxWidth: "600px",
  },
  header: {
    backgroundColor: "white",
    borderRadius: "8px 8px 0 0",
    padding: "30px",
    textAlign: "center" as const,
    borderBottom: `1px solid ${welcomeEmailColors.border}`,
  },
  logo: {
    width: "150px",
    height: "auto",
    margin: "0 auto",
  },
  content: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "0 0 8px 8px",
  },
  heading: {
    fontSize: "20px",
    fontWeight: "bold",
    color: welcomeEmailColors.text,
    marginBottom: "20px",
    textAlign: "center" as const,
  },
  subheading: {
    fontSize: "16px",
    fontWeight: "bold",
    color: welcomeEmailColors.text,
    marginTop: "30px",
    marginBottom: "15px",
  },
  text: {
    fontSize: "12px",
    lineHeight: "24px",
    color: welcomeEmailColors.text,
    marginBottom: "20px",
  },
  button: {
    backgroundColor: welcomeEmailColors.primary,
    borderRadius: "4px",
    color: "white",
    fontWeight: "bold",
    padding: "12px 24px",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    marginTop: "10px",
    marginBottom: "10px",
  },
  benefits: {
    padding: "0",
    margin: "20px 0",
  },
  benefitItem: {
    display: "flex",
    marginBottom: "15px",
    fontSize: "12px",
    lineHeight: "24px",
    color: welcomeEmailColors.text,
  },
  hr: {
    borderColor: welcomeEmailColors.border,
    margin: "30px 0",
  },
  footer: {
    fontSize: "12px",
    color: welcomeEmailColors.lightText,
    textAlign: "center" as const,
    marginTop: "30px",
  },
  socialLinks: {
    textAlign: "center" as const,
    margin: "20px 0",
  },
  socialLink: {
    display: "inline-block",
    margin: "0 10px",
  },
};