import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading mb-4">About OrbitL Dash</h1>
            <p className="text-lg text-muted-foreground">
              Empowering mobile car wash businesses with smart technology
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <p>
              OrbitL Dash is the ultimate management platform designed specifically for mobile car wash professionals.
              We understand the unique challenges of running a mobile detailing business and have built a comprehensive
              solution to streamline operations, optimize routes, and grow your business.
            </p>

            <p>
              Our platform combines powerful scheduling tools, customer management, route optimization, and real-time
              analytics to help you focus on what matters most - providing exceptional service to your clients.
            </p>

            <p>
              Founded by industry veterans with years of experience in mobile detailing, OrbitL Dash is committed to
              supporting the growth and success of mobile car wash entrepreneurs everywhere.
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