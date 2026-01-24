import { Link } from "wouter";
import { CheckCircle, Users, Target, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold font-heading mb-6">About OrbitL Dash</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empowering mobile car wash businesses with cutting-edge technology and intelligent solutions
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              To revolutionize the mobile car wash industry by providing entrepreneurs with the tools they need
              to scale their businesses efficiently, deliver exceptional customer experiences, and achieve sustainable growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-4">What We Do</h3>
              <p className="text-muted-foreground mb-6">
                OrbitL Dash is a comprehensive management platform designed specifically for mobile car wash professionals.
                We understand the unique challenges of running a mobile detailing business and have built a complete
                solution that covers everything from scheduling and customer management to route optimization and analytics.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Smart scheduling and booking management</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Real-time route optimization</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Customer relationship management</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Business analytics and reporting</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Why Choose Us</h3>
              <p className="text-muted-foreground mb-6">
                Founded by industry veterans with decades of combined experience in mobile detailing,
                OrbitL Dash combines deep industry knowledge with modern technology to deliver unparalleled value.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Users className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Industry Expertise</h4>
                    <p className="text-sm text-muted-foreground">Built by professionals who understand your business</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Focused Solutions</h4>
                    <p className="text-sm text-muted-foreground">Tailored specifically for mobile car wash operations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-6 w-6 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold">Proven Results</h4>
                    <p className="text-sm text-muted-foreground">Helping businesses grow and succeed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-lg text-muted-foreground">
              Meet the experts behind OrbitL Dash
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Industry Veterans</h3>
              <p className="text-muted-foreground">
                Our founders bring over 20 years of combined experience in mobile car wash operations
                and business management.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Target className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tech Innovators</h3>
              <p className="text-muted-foreground">
                Our development team combines cutting-edge technology with deep industry insights
                to create powerful solutions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer Focused</h3>
              <p className="text-muted-foreground">
                Every feature we build is designed with our users in mind, ensuring maximum value
                and ease of use.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of mobile car wash professionals who trust OrbitL Dash
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                View Pricing
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/10 transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}