import { Link } from "wouter";

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-heading mb-4">Careers at OrbitL Dash</h1>
            <p className="text-lg text-muted-foreground">
              Join our team and help revolutionize mobile car wash management
            </p>
          </div>

          <div className="prose prose-lg mx-auto">
            <p>
              At OrbitL Dash, we're building the future of mobile detailing software. We're looking for passionate,
              talented individuals who want to make a real impact in the automotive service industry.
            </p>

            <h2>Why Join OrbitL Dash?</h2>
            <ul>
              <li>Work on cutting-edge technology that serves a growing industry</li>
              <li>Be part of a small, agile team with big ambitions</li>
              <li>Flexible remote work options</li>
              <li>Competitive compensation and benefits</li>
              <li>Opportunity to learn and grow in a fast-paced environment</li>
            </ul>

            <h2>Open Positions</h2>
            <p>
              We don't have any open positions at the moment, but we're always interested in hearing from talented
              developers, designers, and industry experts. Send us your resume and tell us why you'd be a great fit
              for our team.
            </p>

            <div className="bg-secondary/20 p-6 rounded-lg mt-8">
              <h3 className="text-xl font-bold mb-2">Contact Us</h3>
              <p>
                Interested in joining our team? Send your resume and a brief introduction to{" "}
                <a href="mailto:max@orbitl.cc" className="text-primary hover:underline">
                  max@orbitl.cc
                </a>
              </p>
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
    </div>
  );
}