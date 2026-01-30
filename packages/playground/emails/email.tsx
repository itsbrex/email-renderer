import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Hr,
  Row,
  Column,
  Link,
  Img,
} from '@react-email/components';

const baseUrl = 'https://emailrenderer.dev';

export default function Email() {
  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Body
        style={{
          backgroundColor: '#09090b',
          margin: 0,
          padding: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: 'none',
            fontSize: '1px',
            color: '#09090b',
            lineHeight: '1px',
            maxHeight: '0px',
            maxWidth: '0px',
            opacity: 0,
            overflow: 'hidden',
          }}
        >
          Stop guessing how your emails look. See exactly what your users see across Gmail, Outlook
          & Apple Mail.
        </div>

        <Container
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            backgroundColor: '#09090b',
          }}
        >
          <Section style={{ padding: '32px 24px 16px 24px', textAlign: 'center' }}>
            <Text
              style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: 700,
                color: '#fafafa',
                letterSpacing: '-0.5px',
              }}
            >
              ✉️ Email Renderer
            </Text>
          </Section>

          <Section
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
              margin: '0 24px',
              borderRadius: '16px',
              padding: '48px 32px',
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                margin: '0 0 8px 0',
                fontSize: '12px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.9)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
              }}
            >
              Now Available
            </Text>
            <Heading
              style={{
                margin: '0 0 16px 0',
                color: '#ffffff',
                fontSize: '36px',
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-1px',
              }}
            >
              Ship emails with
              <br />
              confidence
            </Heading>
            <Text
              style={{
                margin: '0 0 28px 0',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '16px',
                lineHeight: 1.6,
              }}
            >
              Preview exactly how your emails render across
              <br />
              Gmail, Apple Mail, and Outlook — in real time.
            </Text>
            <Button
              href={baseUrl}
              style={{
                backgroundColor: '#ffffff',
                color: '#18181b',
                padding: '14px 28px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Start Rendering →
            </Button>
          </Section>

          <Section style={{ margin: '0 24px', padding: '48px 32px', textAlign: 'center' }}>
            <Heading
              style={{
                margin: '0 0 16px 0',
                color: '#fafafa',
                fontSize: '24px',
                fontWeight: 700,
              }}
            >
              Ready to level up your emails?
            </Heading>
            <Text style={{ margin: '0 0 24px 0', color: '#a1a1aa', fontSize: '15px' }}>
              Join thousands of developers shipping better emails.
            </Text>
            <Button
              href={baseUrl}
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                color: '#ffffff',
                padding: '16px 32px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Get Started Free
            </Button>
          </Section>

          <Hr style={{ borderColor: '#27272a', margin: '0 24px' }} />

          <Section style={{ margin: '0 24px', padding: '32px 24px', textAlign: 'center' }}>
            <Text style={{ margin: '0 0 16px 0', fontSize: '20px' }}>✉️</Text>
            <Text
              style={{
                margin: '0 0 16px 0',
                color: '#71717a',
                fontSize: '13px',
                lineHeight: 1.6,
              }}
            >
              Email Renderer
              <br />
              Making email development less painful, one render at a time.
            </Text>
            <Text style={{ margin: 0, color: '#52525b', fontSize: '12px' }}>
              <Link href={baseUrl} style={{ color: '#71717a', textDecoration: 'underline' }}>
                Website
              </Link>
              {' · '}
              <Link
                href={`${baseUrl}/docs`}
                style={{ color: '#71717a', textDecoration: 'underline' }}
              >
                Docs
              </Link>
              {' · '}
              <Link
                href="https://github.com/emailrenderer"
                style={{ color: '#71717a', textDecoration: 'underline' }}
              >
                GitHub
              </Link>
              {' · '}
              <Link
                href="https://twitter.com/emailrenderer"
                style={{ color: '#71717a', textDecoration: 'underline' }}
              >
                Twitter
              </Link>
            </Text>
          </Section>

          <Section style={{ margin: '0 24px', padding: '0 24px 32px 24px', textAlign: 'center' }}>
            <Text style={{ margin: 0, color: '#3f3f46', fontSize: '11px' }}>
              You're receiving this because you signed up for Email Renderer.
              <br />
              <Link href="#" style={{ color: '#52525b', textDecoration: 'underline' }}>
                Unsubscribe
              </Link>
              {' · '}
              <Link href="#" style={{ color: '#52525b', textDecoration: 'underline' }}>
                Manage preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
