import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useActivityTracking } from "@/hooks/use-activity-tracking";
import { Helmet } from "react-helmet-async";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Build Form", href: "/builder" },
    { name: "FAQ", href: "#faq" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      scrolled
        ? "bg-background/80 backdrop-blur-md border-b shadow-sm"
        : "bg-background/80 backdrop-blur-md"
    }`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${scrolled ? "" : ""}`}>
              <img src="/favicon.png" alt="Logo" className="size-8" />
            </div>
            <span className={`text-xl font-bold font-heading ${scrolled ? "text-foreground" : "text-foreground"}`}>OrbitL Dash</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-8 mr-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href.startsWith('#') ? link.href : link.href}
                  className={`text-sm font-medium ${scrolled ? "text-foreground" : "text-foreground"} hover:text-primary transition-colors`}
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3 border-l pl-6">
              <Button variant="ghost" size="sm" className={`font-semibold ${scrolled ? "text-foreground" : "text-foreground"}`} data-testid="button-login" onClick={() => {
                trackButtonClick('login-button', 'Log in');
                window.location.href = 'https://app.orbitl-dash.us/signin';
              }}>
                Log in
              </Button>
              <Link href="/signup">
                <Button size="sm" className={`font-semibold shadow-sm ${scrolled ? "" : ""}`} data-testid="button-signup" onClick={() => {
                  trackButtonClick('signup-button', 'Sign up');
                }}>
                  Sign up
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 rounded-lg transition-colors drop-shadow-md ${
              scrolled
                ? "text-foreground bg-background/60 border-border/50 border hover:bg-background/80"
                : "text-foreground bg-background/60 border-border/50 border hover:bg-background/80"
            }`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-background/95 backdrop-blur-md"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="block text-foreground hover:text-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
                <div className="pt-4 border-t space-y-3">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { window.location.href = 'https://app.orbitl-dash.us/signin'; setIsOpen(false); }}>
                    Log in
                  </Button>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default function BestFreeBookingForms() {
  const { trackButtonClick } = useActivityTracking();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Best Free Booking Forms for Mobile Detailers (2026 Guide) | OrbitL Dash</title>
        <meta name="description" content="Discover the best free booking forms for mobile detailers in 2026. Learn what features matter, how to create a booking form in under 2 minutes, and why niche tools convert better." />
        <meta name="keywords" content="free booking forms, mobile detailing, booking system, mobile detailer software, free scheduling tool" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://orbitl-dash.us/best-free-booking-forms" />
        
        {/* OpenGraph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://orbitl-dash.us/best-free-booking-forms" />
        <meta property="og:title" content="Best Free Booking Forms for Mobile Detailers (2026 Guide)" />
        <meta property="og:description" content="Discover the best free booking forms for mobile detailers in 2026. Learn what features matter and how to create professional booking forms quickly." />
        <meta property="og:image" content="https://orbitl-dash.us/opengraph.jpg" />
        <meta property="og:site_name" content="OrbitL Dash" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://orbitl-dash.us/best-free-booking-forms" />
        <meta name="twitter:title" content="Best Free Booking Forms for Mobile Detailers (2026 Guide)" />
        <meta name="twitter:description" content="Discover the best free booking forms for mobile detailers in 2026. Learn what features matter and how to create professional booking forms quickly." />
        <meta name="twitter:image" content="https://orbitl-dash.us/opengraph.jpg" />
        <meta name="twitter:site" content="@OrbitLDash" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Best Free Booking Forms for Mobile Detailers (2026 Guide)",
            "description": "Discover the best free booking forms for mobile detailers in 2026. Learn what features matter, how to create a booking form in under 2 minutes, and why niche tools convert better.",
            "author": {
              "@type": "Organization",
              "name": "OrbitL Dash"
            },
            "datePublished": "2026-01-27",
            "dateModified": "2026-01-27",
            "image": "https://orbitl-dash.us/opengraph.jpg",
            "publisher": {
              "@type": "Organization",
              "name": "OrbitL Dash",
              "logo": {
                "@type": "ImageObject",
                "url": "https://orbitl-dash.us/favicon.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://orbitl-dash.us/best-free-booking-forms"
            }
          })}
        </script>
        
        {/* Breadcrumb Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [{
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://orbitl-dash.us/"
            }, {
              "@type": "ListItem",
              "position": 2,
              "name": "Resources",
              "item": "https://orbitl-dash.us/resources"
            }, {
              "@type": "ListItem",
              "position": 3,
              "name": "Best Free Booking Forms"
            }]
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen bg-background font-sans text-foreground">
        <Navbar />

        <main className="pt-20 pb-20">
          <article className="container mx-auto px-4 max-w-4xl">
            <header className="mb-12">
              <h1 className="text-4xl font-heading font-bold mb-8">Best Free Booking Forms for Mobile Detailers (2026 Guide)</h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                If you're a mobile detailer looking for a <strong>free booking form</strong>, you're not alone. Customers expect fast, simple online booking—and if you don't have it, they move on.
                The good news: you <strong>don't need expensive software</strong> or a developer to set up a professional mobile detailing booking form.
              </p>
            </header>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            In this guide, we'll break down:
          </p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>The <strong>best free booking forms for mobile detailing</strong></li>
            <li>What features actually matter</li>
            <li>How to create a booking form <strong>in under 2 minutes</strong></li>
            <li>Why some "free" tools cost you leads long-term</li>
          </ul>

          <section className="mb-12">
            <h2 className="text-3xl font-heading font-bold mb-6">What Is a Mobile Detailing Booking Form?</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              A mobile detailing booking form lets customers:
            </p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>Choose a service (interior, exterior, full detail)</li>
            <li>Pick a date and time</li>
            <li>Enter vehicle and location details</li>
            <li>Submit the booking instantly</li>
          </ul>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Instead of endless texts and calls, everything is captured automatically.
          </p>

            </section>
  
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6">What to Look for in a Free Mobile Detailing Form</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Before choosing any tool, make sure it has:
              </p>
          <ul className="list-none text-lg text-muted-foreground mb-8 space-y-2">
            <li>✅ Mobile-friendly design</li>
            <li>✅ Custom service options</li>
            <li>✅ Location/address field</li>
            <li>✅ Automatic confirmations</li>
            <li>✅ No hidden setup fees</li>
            <li>✅ Easy sharing (link, website, social media)</li>
          </ul>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Most "free" tools fail at least one of these.
          </p>

          <h2 className="text-3xl font-heading font-bold mb-6">Best Free Booking Forms for Mobile Detailers</h2>

          <h3 className="text-2xl font-heading font-bold mb-4">1. OrbitL Dash – Free Mobile Detailing Booking Form (Best Overall)</h3>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            <strong>Best for:</strong> Mobile detailers who want something fast, professional, and built specifically for their business.
          </p>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            <strong>Why it stands out:</strong>
          </p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-4 space-y-2">
            <li>Made <strong>specifically for mobile detailers</strong></li>
            <li>Takes <strong>under 2 minutes</strong> to set up</li>
            <li>No coding, no website required</li>
            <li>Works perfectly on phones</li>
            <li>Clean, professional UI</li>
            <li>Shareable link instantly</li>
          </ul>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            You don't need to customize generic templates or fight with settings. This is purpose-built.
          </p>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            👉 <strong>Form Builder:</strong>
            <a href="https://orbitl-dash.us/free-booking-form" className="text-primary underline">https://orbitl-dash.us/free-booking-form</a>
          </p>
          <p className="text-lg font-semibold mb-2">Pros</p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-4 space-y-2">
            <li>Truly free</li>
            <li>Optimized for mobile detailing workflows</li>
            <li>No bloated features</li>
            <li>Higher conversion than generic forms</li>
          </ul>
          <p className="text-lg font-semibold mb-2">Cons</p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>Designed for service businesses (not e-commerce)</li>
          </ul>

          <h3 className="text-2xl font-heading font-bold mb-4">2. Google Forms (Free but Limited)</h3>
          <p className="text-lg font-semibold mb-2">Pros</p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-4 space-y-2">
            <li>100% free</li>
            <li>Easy to set up</li>
          </ul>
          <p className="text-lg font-semibold mb-2">Cons</p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>Looks unprofessional</li>
            <li>No scheduling logic</li>
            <li>No confirmations</li>
            <li>Lower trust and conversion rates</li>
          </ul>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Good for testing. Bad for real customers.
          </p>

          <h3 className="text-2xl font-heading font-bold mb-4">3. Calendly (Free Tier)</h3>
          <p className="text-lg font-semibold mb-2">Pros</p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-4 space-y-2">
            <li>Clean interface</li>
            <li>Time slot selection</li>
          </ul>
          <p className="text-lg font-semibold mb-2">Cons</p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>Not built for mobile detailing</li>
            <li>No vehicle or service logic</li>
            <li>Branding limitations on free plan</li>
          </ul>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Works better for meetings than detailing jobs.
          </p>

          <h3 className="text-2xl font-heading font-bold mb-4">4. Jotform (Free Plan)</h3>
          <p className="text-lg font-semibold mb-2">Pros</p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-4 space-y-2">
            <li>Flexible form builder</li>
            <li>Custom fields</li>
          </ul>
          <p className="text-lg font-semibold mb-2">Cons</p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>Submission limits</li>
            <li>Branding on free tier</li>
            <li>Overkill for most detailers</li>
          </ul>

            </section>
  
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6">Why Most Free Booking Forms Lose You Money</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Here's the real issue:
                Most tools are <strong>generic</strong>.
              </p>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            They're not designed for:
          </p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>Multiple detailing packages</li>
            <li>Travel-based services</li>
            <li>Vehicle-specific details</li>
            <li>On-the-go customers</li>
          </ul>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            A form that's hard to use = fewer bookings.
          </p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            That's why niche tools convert better.
          </p>

            </section>
  
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6">How to Make a Mobile Detailing Booking Form for Free (Fastest Way)</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                If your goal is speed and results:
              </p>
          <ol className="list-decimal list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>Go to <strong>OrbitL Dash Form Builder</strong></li>
            <li>Enter your business name</li>
            <li>Select your detailing services</li>
            <li>Share the link with customers</li>
          </ol>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            That's it.
          </p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            No domain.
            No tech setup.
            No learning curve.
          </p>

            </section>
  
            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6">Where to Use Your Booking Form</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Once live, use it everywhere:
              </p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>Instagram bio</li>
            <li>Facebook page</li>
            <li>Google Business profile</li>
            <li>SMS follow-ups</li>
            <li>Website "Book Now" button</li>
          </ul>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            One link. Everywhere.
          </p>

            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6">Final Verdict: Best Free Booking Form for Mobile Detailing</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                If you want:
              </p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-6 space-y-2">
            <li>Zero cost</li>
            <li>Fast setup</li>
            <li>Higher booking rates</li>
            <li>Something built <strong>for mobile detailers</strong></li>
          </ul>
          <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
            <strong>OrbitL Dash is the clear winner.</strong>
          </p>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Generic tools work.
            Purpose-built tools convert.
          </p>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6">FAQ: Mobile Detailing Booking Forms</h2>
              <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Is OrbitL Dash really free?</h3>
                <p className="text-lg text-muted-foreground">Yes. The free booking form requires no payment.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Do I need a website?</h3>
                <p className="text-lg text-muted-foreground">No. You get a shareable booking link.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Can customers book from their phone?</h3>
                <p className="text-lg text-muted-foreground">Yes. It's mobile-first by design.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Is this better than Google Forms?</h3>
                <p className="text-lg text-muted-foreground">For mobile detailing—yes, by a mile.</p>
              </div>
            </div>
          </section>
        </article>
      </main>

      <footer className="py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} OrbitL Dash Inc. All rights reserved.
        </div>
      </footer>
    </div>
  </>);
}