import { Link } from "wouter";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading mb-4">Refund Policy</h1>
            <p className="text-lg text-muted-foreground">
              Our policy on refunds and cancellations
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: January 5, 2026
            </p>

            <h2>Eligibility for Refunds</h2>
            <p>
              Refunds may be requested within 14 days of purchase for eligible services. We offer refunds for the following reasons:
            </p>
            <ul>
              <li>Service not delivered as described</li>
              <li>Technical issues preventing use of the service</li>
              <li>Duplicate charges</li>
              <li>Cancellation within the trial period</li>
            </ul>

            <h2>Non-Refundable Items</h2>
            <p>
              The following are not eligible for refunds:
            </p>
            <ul>
              <li>Services used beyond the 14-day period</li>
              <li>Custom development or integrations</li>
              <li>Third-party services or add-ons</li>
            </ul>

            <h2>How to Request a Refund</h2>
            <p>
              To request a refund, please contact our support team at{" "}
              <a href="mailto:max@orbitl.cc" className="text-primary hover:underline">
                max@orbitl.cc
              </a>{" "}
              with your account details and reason for the refund request. We will review your request and respond within 5 business days.
            </p>

            <h2>Processing Time</h2>
            <p>
              Approved refunds will be processed within 7-10 business days and will appear on your original payment method.
            </p>

            <h2>Contact Information</h2>
            <p>
              If you have any questions about our refund policy, please contact us at{" "}
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
    </div>
  );
}