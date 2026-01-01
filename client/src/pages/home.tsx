import { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  Check, 
  Menu, 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  BarChart3, 
  Settings, 
  Clock,
  ChevronDown,
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

// Import asset
import heroImage from "@assets/generated_images/mobile_app_mockup_for_car_wash_management.png";

// --- Components ---

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md border-b shadow-sm" : "bg-transparent"}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
              O
            </div>
            <span className="text-xl font-bold font-heading text-foreground">OrbitL Dash</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-8 mr-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="flex items-center gap-3 border-l pl-6">
              <Button variant="ghost" size="sm" className="font-semibold" data-testid="button-login">
                Log in
              </Button>
              <Button size="sm" className="font-semibold shadow-sm" data-testid="button-signup">
                Sign up
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-lg font-medium text-foreground py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t mt-2">
                <Button variant="outline" className="w-full" data-testid="mobile-button-login">
                  Log in
                </Button>
                <Button className="w-full" data-testid="mobile-button-signup">
                  Sign up
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-48 md:pb-24 px-4 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start gap-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Now available for iOS and Android
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading leading-tight text-foreground">
              Mobile detailing, <span className="text-primary">simplified.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
              OrbitL Dash is the ultimate management platform for mobile car wash professionals. Schedule, route, and grow with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-2">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:scale-105 transition-transform" data-testid="button-try-free">
                Start 3-Day Free Trial
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                See How It Works
              </Button>
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" /> No credit card required
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-secondary/50 rounded-[40px] blur-3xl -z-10" />
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white bg-white">
             <img 
               src={heroImage} 
               alt="WashMaster App Interface" 
               className="w-full h-auto object-cover"
             />
            </div>
            
            {/* Floating elements for depth */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-6 top-20 bg-white p-4 rounded-xl shadow-lg border border-border hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                  <Check className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Route Optimized</p>
                  <p className="text-xs text-muted-foreground">Saved 15 mins</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Customer & Vehicle Management",
      description: "Keep detailed records of client preferences, vehicle history, and service notes."
    },
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: "Smart Appointment Scheduling",
      description: "Drag-and-drop calendar that prevents double bookings and manages recurring jobs."
    },
    {
      icon: <MapPin className="w-6 h-6 text-primary" />,
      title: "Route Optimization",
      description: "Automatically calculate the most efficient route between jobs to save gas and time."
    },
    {
      icon: <Settings className="w-6 h-6 text-primary" />,
      title: "Service Configuration",
      description: "Customize your service menu, add-ons, pricing, and duration for accurate booking."
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Business Hours",
      description: "Set your availability and let the system handle booking blocks automatically."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-primary" />,
      title: "Job Tracking & Analytics",
      description: "See your daily revenue, job completion rates, and business growth at a glance."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
            Everything you need to run your mobile business
          </h2>
          <p className="text-lg text-muted-foreground">
            Stop juggling spreadsheets and text messages. OrbitL Dash gives you a professional command center.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-background border border-border hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 font-heading">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      number: "01",
      title: "Setup your business",
      description: "Add your services, pricing, and import existing customers in minutes."
    },
    {
      number: "02",
      title: "Schedule & Route",
      description: "Book appointments and let our AI optimize your daily driving route."
    },
    {
      number: "03",
      title: "Track & Grow",
      description: "Complete jobs, collect payments, and watch your business stats improve."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">How it works</h2>
          <p className="text-lg text-muted-foreground">Get started in three simple steps</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-white border-4 border-primary/20 flex items-center justify-center text-3xl font-bold font-heading text-primary shadow-sm mb-6 z-10">
                {step.number}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground max-w-xs">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Choose the plan that fits your business stage.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-8 border border-border flex flex-col shadow-sm relative overflow-hidden">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-muted-foreground text-sm">Perfect for solo operators just getting started.</p>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-foreground">$49.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Simple booking flow",
                "Customer requests",
                "Basic scheduling",
                "Website booking form",
                "Email support"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full h-12">Get Started</Button>
          </div>

          {/* Professional Plan */}
          <div className="bg-primary/5 rounded-3xl p-8 border-2 border-primary flex flex-col shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
              Most Popular
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <p className="text-muted-foreground text-sm">Everything you need to grow your business.</p>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="text-4xl font-bold text-foreground">$89.99</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Route optimization (Smart Routes)",
                "Full dashboard analytics",
                "Advanced customer profiles",
                "Previous job & vehicle data",
                "Smart time-saving schedule",
                "Priority 24/7 support"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Button className="w-full h-12 shadow-lg shadow-primary/20">Get Started</Button>
          </div>
        </div>

        {/* Add-on Services */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="p-8 rounded-3xl bg-secondary/20 border border-secondary flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold font-heading mb-2 text-secondary-foreground">Need a Web Presence?</h3>
              <p className="text-muted-foreground">We offer professional web design and setup services for your business.</p>
            </div>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="bg-white p-4 rounded-xl border border-border flex items-center justify-between gap-6">
                <div>
                  <p className="font-bold text-sm">Custom Website</p>
                  <p className="text-xs text-muted-foreground">Add to any plan</p>
                </div>
                <p className="font-bold text-primary">+$34.99/mo</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-border flex items-center justify-between gap-6">
                <div>
                  <p className="font-bold text-sm">Existing Setup Fee</p>
                  <p className="text-xs text-muted-foreground">One-time fee</p>
                </div>
                <p className="font-bold text-primary">$19.99</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "How does route optimization work?",
      answer: "Our system analyzes all your scheduled jobs for the day and automatically calculates the most efficient driving order to minimize travel time and fuel costs. You can reorder manually if needed."
    },
    {
      question: "What happens to my data?",
      answer: "Your data is securely stored in the cloud. We use industry-standard encryption to keep your customer lists and business details safe. You own your data completely."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, absolutely. There are no long-term contracts. You can cancel your subscription at any time with one click from your account settings."
    },
    {
      question: "Is there a setup fee?",
      answer: "No setup fees. You get full access to all features during your 3-day free trial, and setup takes just a few minutes."
    },
    {
      question: "What devices does it work on?",
      answer: "OrbitL Dash works on any device with a web browser. It's optimized for mobile use on smartphones (iOS and Android) and tablets, as well as desktop computers."
    },
    {
      question: "Do you offer support?",
      answer: "Yes, all plans include email and chat support. We're here to help you get the most out of the platform."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Frequently Asked Questions</h2>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl px-6 bg-white data-[state=open]:border-primary/50">
              <AccordionTrigger className="text-left font-semibold text-lg py-4 hover:no-underline hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-4 text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-24 bg-foreground text-background relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold font-heading mb-6 text-white">
          Ready to get organized?
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
          Join hundreds of mobile car wash businesses saving time and growing faster with OrbitL Dash.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white border-0">
            Get Started for Free
          </Button>
          <Button variant="outline" size="lg" className="h-14 px-8 text-lg bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white">
            Have Questions? Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="size-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                O
              </div>
              <span className="font-bold font-heading text-lg">OrbitL Dash</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The professional dashboard for mobile car wash businesses.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="hover:text-primary">Features</a></li>
              <li><a href="#pricing" className="hover:text-primary">Pricing</a></li>
              <li><a href="#" className="hover:text-primary">Download App</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">About Us</a></li>
              <li><a href="#" className="hover:text-primary">Contact</a></li>
              <li><a href="#" className="hover:text-primary">Careers</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>© 2024 OrbitL Dash Inc. All rights reserved.</p>
          <div className="flex gap-4">
            {/* Social icons would go here */}
            <a href="#" className="hover:text-primary">Twitter</a>
            <a href="#" className="hover:text-primary">Instagram</a>
            <a href="#" className="hover:text-primary">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen font-sans bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
