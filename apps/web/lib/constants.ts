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

export const BASE_TAILWIND_CONFIG = {
  content: [],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        black: '#000000',
        white: '#ffffff',
        grey: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        mono: ['Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['16px', { lineHeight: '24px' }],
        lg: ['18px', { lineHeight: '28px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '1' }],
        '6xl': ['60px', { lineHeight: '1' }],
      },
      spacing: {
        px: '1px',
        0: '0',
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        14: '56px',
        16: '64px',
        20: '80px',
        24: '96px',
        28: '112px',
        32: '128px',
        36: '144px',
        40: '160px',
        44: '176px',
        48: '192px',
        52: '208px',
        56: '224px',
        60: '240px',
        64: '256px',
        72: '288px',
        80: '320px',
        96: '384px',
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
