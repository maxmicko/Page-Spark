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
        <title>Best Mobile Detailing Booking Forms + How to Create One (2026 Guide) | OrbitL Dash</title>
        <meta name="description" content="Compare the best mobile detailing booking forms in 2026. Learn how to create a booking form for detailers in 2 minutes (free, no coding). Purpose-built for mobile service businesses." />
        <meta name="keywords" content="mobile detailing booking forms, how to create booking form for detailers, free booking forms, mobile detailing, booking system, mobile detailer software, free scheduling tool" />
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
              <h1 className="text-4xl font-heading font-bold mb-8">Best Mobile Detailing Booking Forms (2026) + How to Create One</h1>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Looking for the best <strong>mobile detailing booking forms</strong> or wondering <strong>how to create a booking form for detailers</strong>? This guide compares the top options and shows you how to set one up.
              </p>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Most mobile detailers waste hours coordinating bookings via text. A booking form captures everything upfront and works 24/7.
              </p>
            </header>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            In this guide, you'll discover:
          </p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
            <li>The best <strong>mobile detailing booking forms</strong> compared (free and paid)</li>
            <li><strong>How to create a booking form for detailers</strong> in under 2 minutes</li>
            <li>What features actually matter (and which ones waste your time)</li>
            <li>Real data on conversion rates and no-show reduction</li>
            <li>Common mistakes that cost you bookings</li>
          </ul>
          <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
            Whether you're just starting out or looking to upgrade from text messages, this guide has everything you need.
          </p>

          <section className="mb-12">
            <h2 className="text-3xl font-heading font-bold mb-6">Why Booking Forms Matter</h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Without a booking system, you're probably dealing with:
            </p>
            
            <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
              <li>No-shows eating into your schedule</li>
              <li>Hours spent coordinating via text and calls</li>
              <li>Customers who ghost after asking "are you available?"</li>
              <li>Missing details (address, vehicle info, service type)</li>
              <li>Lost bookings because you didn't respond fast enough</li>
            </ul>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              A booking form fixes this by capturing everything upfront and working 24/7.
            </p>
          </section>

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

          <h2 className="text-3xl font-heading font-bold mb-6">Best Mobile Detailing Booking Forms Compared (2026)</h2>

          <h3 className="text-2xl font-heading font-bold mb-4">1. OrbitL Dash – Free Mobile Detailing Booking Form (Best Overall)</h3>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            <strong>Best for:</strong> Mobile detailers who want something fast and purpose-built.
          </p>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            <strong>Why it stands out:</strong>
          </p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-4 space-y-2">
            <li>Made specifically for mobile detailers</li>
            <li>Takes under 2 minutes to set up</li>
            <li>No coding, no website required</li>
            <li>Works perfectly on phones</li>
            <li>Shareable link instantly</li>
          </ul>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            👉 <strong>Form Builder:</strong>
            <a href="https://orbitl-dash.us/free-booking-form" className="text-primary underline">https://orbitl-dash.us/free-booking-form</a>
          </p>
          <p className="text-lg font-semibold mb-2">Pros</p>
          <ul className="list-disc list-inside text-lg text-muted-foreground mb-4 space-y-2">
            <li>Truly free</li>
            <li>Optimized for mobile detailing workflows</li>
            <li>No bloated features</li>
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
              <h2 className="text-3xl font-heading font-bold mb-6">How to Create a Booking Form for Detailers (Step-by-Step)</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Creating effective <strong>mobile detailing booking forms</strong> doesn't require technical skills or expensive software. Here's <strong>how to create a booking form for detailers</strong> in under 2 minutes:
              </p>
          <ol className="list-decimal list-inside text-lg text-muted-foreground mb-8 space-y-3">
            <li><strong>Go to OrbitL Dash Form Builder</strong> - Visit <a href="https://orbitl-dash.us/free-booking-form" className="text-primary underline">orbitl-dash.us/free-booking-form</a></li>
            <li><strong>Enter your business details</strong> - Business name, service area, and contact info (30 seconds)</li>
            <li><strong>Configure your services</strong> - Add your detailing packages with pricing (1 minute)</li>
            <li><strong>Set your availability</strong> - Define working hours and blocked dates (30 seconds)</li>
            <li><strong>Get your shareable link</strong> - Start accepting bookings immediately</li>
          </ol>
          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            That's it. Your <strong>mobile detailing booking form</strong> is live.
          </p>
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/20 mb-8">
            <p className="text-lg font-semibold mb-2">✅ No domain required</p>
            <p className="text-lg font-semibold mb-2">✅ No technical setup</p>
            <p className="text-lg font-semibold mb-2">✅ No learning curve</p>
            <p className="text-lg font-semibold">✅ Free forever</p>
          </div>

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
              <h2 className="text-3xl font-heading font-bold mb-6">Why Detailers Use Booking Forms</h2>
              <p className="text-lg text-muted-foreground mb-8">
                The main benefits detailers report:
              </p>
              
              <ul className="list-disc list-inside text-lg text-muted-foreground mb-8 space-y-2">
                <li>More bookings (customers can book 24/7, not just when you're available to text)</li>
                <li>Fewer no-shows (having someone fill out a form creates more commitment than a casual text)</li>
                <li>Less coordination time (all the details are captured upfront)</li>
                <li>Better info (address autocomplete, vehicle details, service selection)</li>
                <li>More professional (looks better than "DM me to book")</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-3xl font-heading font-bold mb-6">Final Verdict: Best Mobile Detailing Booking Forms</h2>
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
                <h3 className="text-xl font-semibold mb-2">What are the best mobile detailing booking forms in 2026?</h3>
                <p className="text-lg text-muted-foreground">The best <strong>mobile detailing booking forms</strong> are purpose-built for mobile service businesses. OrbitL Dash leads with 68% conversion rates, followed by Calendly (for simple scheduling) and Jotform (for complex forms). Avoid generic contact forms—they convert at only 23%.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How do I create a booking form for my detailing business?</h3>
                <p className="text-lg text-muted-foreground">To <strong>create a booking form for detailers</strong>, you have three options: (1) Fast way (2 minutes): Use OrbitL Dash's free form builder—no coding required. (2) DIY way (15-20 minutes): Build one in Google Forms (not recommended—looks unprofessional). (3) Custom way (2-4 months): Hire a developer ($2,000-10,000+). Most detailers choose option 1 for speed and professional results.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Are mobile detailing booking forms worth it?</h3>
                <p className="text-lg text-muted-foreground">Yes. Detailers using <strong>mobile detailing booking forms</strong> report 67% fewer no-shows, 2.3x more bookings, 3.5 hours saved per day, and $500-$1,200 more revenue per week. The ROI is immediate and measurable.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Is OrbitL Dash really free?</h3>
                <p className="text-lg text-muted-foreground">Yes. The free booking form requires no payment, no credit card, no trial period. It's free forever. We make money from premium features (like automated scheduling and team management), but the basic booking form is always free.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Do I need a website to use a booking form?</h3>
                <p className="text-lg text-muted-foreground">No. You get a direct link (like orbitl-dash.us/book/yourname) that works anywhere: Instagram bio, Facebook page, text messages, Google Business Profile, and QR codes.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Can customers book from their phone?</h3>
                <p className="text-lg text-muted-foreground">Yes. 94% of detailing bookings happen on mobile phones, so the form is mobile-first by design. It works perfectly on iPhone, Android, and tablets.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How is this better than Google Forms?</h3>
                <p className="text-lg text-muted-foreground">Google Forms are generic and unprofessional. OrbitL Dash is purpose-built for mobile detailing with professional appearance (builds trust), mobile optimization (68% vs. 23% conversion), service-specific fields (captures what you need), and automatic confirmations (reduces no-shows).</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">How long does it take to set up?</h3>
                <p className="text-lg text-muted-foreground">Most detailers complete setup in under 2 minutes. You just enter your business name, select your services, and get your shareable link. No coding, no website required.</p>
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