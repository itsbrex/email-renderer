export const ALL_CLIENTS = ['gmail-web', 'apple-mail', 'outlook-win', 'yahoo-mail'] as const;

export const DEFAULT_EMAIL = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Welcome to Email Renderer</title>
  <style>
    @media only screen and (max-width: 600px) {
      .container { width: 100% !important; }
      .content { padding: 20px !important; }
      .header { padding: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div style="display: none; font-size: 1px; color: #f3f4f6; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Test your email rendering across Gmail, Apple Mail, and Outlook
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f3f4f6;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="container" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td class="header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700; line-height: 1.2; letter-spacing: -0.5px;">
                Welcome to Email Renderer
              </h1>
              <p style="margin: 12px 0 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px; font-weight: 400;">
                Test your emails across all major clients
              </p>
            </td>
          </tr>
          <tr>
            <td class="content" style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 24px; font-weight: 600; line-height: 1.3;">
                Hello there! 👋
              </h2>
              <p style="margin: 0 0 16px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                This is a comprehensive email template designed to test rendering across different email clients including Gmail, Apple Mail, and Outlook.
              </p>
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                The template includes modern design elements, responsive layouts, and best practices for email compatibility.
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="center" style="padding: 24px 0;">
                    <a href="#" style="display: inline-block; background-color: #667eea; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600; line-height: 1.5;">
                      Get Started
                    </a>
                  </td>
                </tr>
              </table>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 32px; border-top: 1px solid #e5e7eb;">
                <tr>
                  <td style="padding-top: 24px;">
                    <p style="margin: 0 0 12px 0; color: #111827; font-size: 16px; font-weight: 600;">
                      Key Features:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 15px; line-height: 1.8;">
                      <li style="margin-bottom: 8px;">Cross-client compatibility testing</li>
                      <li style="margin-bottom: 8px;">Real-time rendering preview</li>
                      <li style="margin-bottom: 8px;">Comprehensive analysis and warnings</li>
                      <li style="margin-bottom: 0;">React Email component support</li>
                    </ul>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export const DEFAULT_REACT_EMAIL = `import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
} from '@react-email/components';

export default function Email() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      <Body style={{ backgroundColor: '#f3f4f6', margin: 0, padding: 0, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}>
        <div style={{ display: 'none', fontSize: '1px', color: '#f3f4f6', lineHeight: '1px', maxHeight: '0px', maxWidth: '0px', opacity: 0, overflow: 'hidden' }}>
          Test your email rendering across Gmail, Apple Mail, and Outlook
        </div>
        <Container style={{ maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <Section style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px 30px', textAlign: 'center' }}>
            <Heading style={{ margin: 0, color: '#ffffff', fontSize: '32px', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px' }}>
              Welcome to Email Renderer
            </Heading>
            <Text style={{ margin: '12px 0 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px', fontWeight: 400 }}>
              Test your emails across all major clients
            </Text>
          </Section>
          <Section style={{ padding: '40px 30px', backgroundColor: '#ffffff' }}>
            <Heading style={{ margin: '0 0 16px 0', color: '#111827', fontSize: '24px', fontWeight: 600, lineHeight: 1.3 }}>
              Hello there! 👋
            </Heading>
            <Text style={{ margin: '0 0 16px 0', color: '#4b5563', fontSize: '16px', lineHeight: 1.6 }}>
              This is a comprehensive email template designed to test rendering across different email clients including Gmail, Apple Mail, and Outlook.
            </Text>
            <Text style={{ margin: '0 0 24px 0', color: '#4b5563', fontSize: '16px', lineHeight: 1.6 }}>
              The template includes modern design elements, responsive layouts, and best practices for email compatibility.
            </Text>
            <Section style={{ textAlign: 'center', margin: '24px 0' }}>
              <Button
                href="#"
                style={{
                  backgroundColor: '#667eea',
                  color: '#ffffff',
                  padding: '14px 32px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                  lineHeight: 1.5,
                }}
              >
                Get Started
              </Button>
            </Section>
            <Hr style={{ borderColor: '#e5e7eb', margin: '32px 0 24px 0' }} />
            <Text style={{ margin: '0 0 12px 0', color: '#111827', fontSize: '16px', fontWeight: 600 }}>
              Key Features:
            </Text>
            <Text style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: '15px', lineHeight: 1.8, paddingLeft: '20px' }}>
              • Cross-client compatibility testing
            </Text>
            <Text style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: '15px', lineHeight: 1.8, paddingLeft: '20px' }}>
              • Real-time rendering preview
            </Text>
            <Text style={{ margin: '0 0 8px 0', color: '#4b5563', fontSize: '15px', lineHeight: 1.8, paddingLeft: '20px' }}>
              • Comprehensive analysis and warnings
            </Text>
            <Text style={{ margin: 0, color: '#4b5563', fontSize: '15px', lineHeight: 1.8, paddingLeft: '20px' }}>
              • React Email component support
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}`;
