import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading mb-4">Terms of Service</h1>
            <p className="text-lg text-muted-foreground">
              Please read these terms carefully before using our service
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: January 2, 2026
            </p>

            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using OrbitL Dash, you accept and agree to be bound by the terms and provision of this agreement.
              If you do not agree to abide by the above, please do not use this service.
            </p>

            <h2>Use License</h2>
            <p>
              Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable license to access and use OrbitL Dash for your business purposes. This license does not include:
            </p>
            <ul>
              <li>The right to sublicense or resell the service</li>
              <li>The right to modify, adapt, or create derivative works of the service</li>
              <li>The right to reverse engineer, decompile, or disassemble the service</li>
              <li>The right to remove or alter any proprietary notices</li>
            </ul>

            <h2>User Accounts</h2>
            <p>
              When you create an account with us, you must provide information that is accurate, complete, and current at all times.
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>

            <h2>Prohibited Uses</h2>
            <p>
              You may not use our service:
            </p>
            <ul>
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            </ul>

            <h2>Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at{" "}
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