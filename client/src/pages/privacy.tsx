import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-heading mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            How we protect and handle your data
          </p>
        </div>

        <div className="prose prose-lg mx-auto">
          <p className="text-sm text-muted-foreground mb-8">
            Last updated: January 2, 2026
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, use our services,
            or contact us for support. This may include your name, email address, phone number, and business information.
          </p>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Understand how you use our services</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell, trade, or otherwise transfer your personal information to third parties without your consent,
            except as described in this policy. We may share your information in the following circumstances:
          </p>
          <ul>
            <li>With service providers who help us operate our business</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information against unauthorized access,
            alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:max@orbitl.cc" className="text-primary hover:underline">
              max@orbitl.cc
            </a>
          </p>
        </div>

        <div className="text-center mt-12">
          <Link href="/">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}