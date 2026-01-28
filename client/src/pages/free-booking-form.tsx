import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, X, Clock, MessageSquare } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import BookingWizard from "@/components/BookingWizard";
import { LeadSignupForm } from "@/components/LeadSignupForm";
import { useActivityTracking } from "@/hooks/use-activity-tracking";

export default function FreeBookingForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { trackButtonClick } = useActivityTracking();

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10 relative">
      <Helmet>
        <title>Free Booking Form for Mobile Detailers | OrbitL Dash</title>
        <meta name="description" content="Get a free booking form built specifically for mobile detailers. Reduce no-shows, save time, and professionalize your business in 2 minutes." />
        <link rel="canonical" href="https://www.orbitl-dash.us/free-booking-form" />
      </Helmet>
      {/* Global animated background - spans entire page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 -left-40 w-[350px] h-[350px] bg-primary/50 rounded-full blur-xl animate-blob" />
        <div className="absolute top-0 -right-40 w-[350px] h-[350px] bg-secondary/45 rounded-full blur-xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/4 w-[350px] h-[350px] bg-primary/55 rounded-full blur-xl animate-blob animation-delay-4000" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-secondary/50 rounded-full blur-xl animate-blob animation-delay-3000" />
        <div className="absolute bottom-1/4 left-1/2 w-[320px] h-[320px] bg-primary/40 rounded-full blur-lg animate-blob animation-delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-secondary/45 rounded-full blur-xl animate-blob animation-delay-5000" />
      </div>

      {/* HEADER */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/favicon.png" alt="Logo" className="size-7" />
            <span className="font-heading font-bold text-lg tracking-tight">OrbitL Dash</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/best-free-booking-forms" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Resources
            </Link>
          </div>
          <Button 
            onClick={() => {
              trackButtonClick('header-cta', 'Get the Free Form (Takes 2 Minutes)');
              setIsModalOpen(true);
            }} 
            size="sm" 
            className="hidden sm:flex text-sm h-9"
          >
            Get the Free Form (Takes 2 Minutes)
          </Button>
        </div>
      </header>

      <main>
        {/* HERO SECTION - Optimized to fit viewport */}
{/* HERO SECTION - Optimized for centered content and wide preview */}
<section className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden relative py-4">
  <div className="container mx-auto px-6 md:px-8 relative z-10">
    <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-12 lg:gap-16 items-stretch max-w-7xl mx-auto">
      
      {/* LEFT SIDE: Centered Hero Text & CTA */}
      <div className="flex flex-col justify-center py-8 lg:py-0 text-left">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1] mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          Free Booking Form for Mobile Detailers 
          <span className="text-muted-foreground block text-xl sm:text-2xl md:text-3xl mt-2 font-medium">
            (Built to Reduce No-Shows)
          </span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          I built this after losing jobs to ghosting, bad timing, and endless texts. Use it free. No credit card.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <Button 
            size="lg" 
            className="h-12 md:h-14 px-6 md:px-8 text-base md:text-lg w-full sm:w-auto shadow-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1" 
            onClick={() => {
              trackButtonClick('hero-cta', 'Get the Free Booking Form (2 Mins)');
              setIsModalOpen(true);
            }}
          >
            Get the Free Booking Form (2 Mins)
            <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
          <div className="flex -space-x-2">
            <img src="https://images.pexels.com/photos/6873136/pexels-photo-6873136.jpeg" alt="T1" className="w-8 h-8 rounded-full object-cover border-2 border-background shadow-md" />
            <img src="https://images.pexels.com/photos/30004312/pexels-photo-30004312.jpeg" alt="T2" className="w-8 h-8 rounded-full object-cover border-2 border-background shadow-md" />
            <img src="https://dl4.pushbulletusercontent2.com/Aqp3f5T0LcJmYiFjdXBLpPt2ODZdsmVC/image.png" alt="T3" className="w-8 h-8 rounded-full object-cover border-2 border-background shadow-md" />
          </div>
          Built for real mobile detailers. Most set it up in under 10 minutes.
        </div>
      </div>

      {/* RIGHT SIDE: Wide & Short Form Preview */}
      <div className="relative flex items-center justify-center lg:justify-end animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
        {/* Animated glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-3xl blur-3xl opacity-40 animate-pulse" />
        
        {/* Mock Browser Frame */}
        <div className="relative w-full max-w-lg animate-float">
          <div className="bg-slate-800 border-2 border-slate-600 rounded-2xl shadow-2xl overflow-hidden">
            {/* Browser Header */}
            <div className="bg-slate-700 px-4 py-3 border-b border-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 bg-slate-600 rounded-md px-3 py-1.5 text-xs text-slate-300 font-mono border border-slate-500">
                  https://orbitl-dash.us/free-booking-form
                </div>
              </div>
            </div>
            {/* Browser Content */}
            <div className="bg-card min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar">
              <div className="p-4">
                <BookingWizard />
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</section>
        {/* PROBLEM AGITATION */}
        <section className="py-16 md:py-24 border-y border-border/50 relative">
          <div className="container mx-auto px-6 md:px-8 max-w-5xl text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-8 md:mb-12">Why you're losing money before you even show up</h2>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 text-left">
              <div className="group bg-card p-6 md:p-8 rounded-3xl border border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/50">
                <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <X className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg md:text-xl mb-2 md:mb-3">Ghosting</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  You drive 30 minutes to a job, and they're not there. You just lost time, gas, and money.
                </p>
              </div>

              <div className="group bg-card p-6 md:p-8 rounded-3xl border border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/50">
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg md:text-xl mb-2 md:mb-3">Endless Texts</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  "How much for a sedan?" "Are you free Tuesday?" DMs and texts don't scale.
                </p>
              </div>

              <div className="group bg-card p-6 md:p-8 rounded-3xl border border-border shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/50">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-heading font-semibold text-lg md:text-xl mb-2 md:mb-3">Time Wasted</h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  Google Forms don't protect your calendar. You need a system that qualifies leads upfront.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IT DOES */}
        <section className="py-16 md:py-24 relative">
          <div className="container mx-auto px-6 md:px-8 max-w-4xl relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-8 md:mb-12 text-center">What the Free Booking Form Does</h2>

            <div className="space-y-4 md:space-y-6">
              {[
                "Collects job details upfront (Vehicle type, Service needed, Address)",
                "Sets clear expectations (Water/Power requirements)",
                "Filters tire-kickers who aren't serious",
                "Reduces no-shows by confirming intent",
                "Saves drive time by validating locations"
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="group flex items-start gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-card/50 border border-border/50 hover:bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-500 hover:-translate-x-2"
                  style={{animationDelay: `${i * 100}ms`}}
                >
                  <div className="mt-1 h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-sm group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="text-base md:text-lg lg:text-xl font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT THIS IS / ISN'T */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.1),transparent_70%)]" />
          
          {/* Animated particles */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{animationDuration: '3s'}} />
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}} />
          <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-white/30 rounded-full animate-ping" style={{animationDuration: '5s', animationDelay: '2s'}} />
          
          <div className="container mx-auto px-6 md:px-8 max-w-5xl relative z-10">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16">
              <div className="group bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 hover:scale-105">
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-6 md:mb-8 flex items-center gap-3">
                  <X className="h-5 w-5 md:h-6 md:w-6" />
                  This is NOT:
                </h3>
                <ul className="space-y-4 md:space-y-6">
                  <li className="flex items-start gap-3 text-base md:text-lg opacity-90 hover:opacity-100 transition-opacity">
                    <span className="w-2 h-2 rounded-full bg-current mt-2.5 md:mt-3 flex-shrink-0" /> A marketplace taking a cut
                  </li>
                  <li className="flex items-start gap-3 text-base md:text-lg opacity-90 hover:opacity-100 transition-opacity">
                    <span className="w-2 h-2 rounded-full bg-current mt-2.5 md:mt-3 flex-shrink-0" /> A complicated app you have to learn
                  </li>
                  <li className="flex items-start gap-3 text-base md:text-lg opacity-90 hover:opacity-100 transition-opacity">
                    <span className="w-2 h-2 rounded-full bg-current mt-2.5 md:mt-3 flex-shrink-0" /> A website redesign service
                  </li>
                </ul>
              </div>

              <div className="group bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-500 hover:scale-105">
                <h3 className="text-xl md:text-2xl font-heading font-bold mb-6 md:mb-8 flex items-center gap-3">
                  <Check className="h-5 w-5 md:h-6 md:w-6" />
                  This IS:
                </h3>
                <ul className="space-y-4 md:space-y-6 font-medium">
                  <li className="flex items-start gap-3 text-base md:text-lg opacity-90 hover:opacity-100 transition-opacity">
                    <span className="w-2 h-2 rounded-full bg-current mt-2.5 md:mt-3 flex-shrink-0" /> A booking form built for mobile detailers
                  </li>
                  <li className="flex items-start gap-3 text-base md:text-lg opacity-90 hover:opacity-100 transition-opacity">
                    <span className="w-2 h-2 rounded-full bg-current mt-2.5 md:mt-3 flex-shrink-0" /> Something you can plug into what you already do
                  </li>
                  <li className="flex items-start gap-3 text-base md:text-lg opacity-90 hover:opacity-100 transition-opacity">
                    <span className="w-2 h-2 rounded-full bg-current mt-2.5 md:mt-3 flex-shrink-0" /> A simple tool to professionalize your business
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA REPEAT */}
        <section className="py-20 md:py-32 text-center relative">
          <div className="container mx-auto px-6 md:px-8 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold mb-8 md:mb-10">Start saving jobs today.</h2>
            <Button 
              size="lg" 
              className="h-14 md:h-16 px-8 md:px-12 text-lg md:text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:-translate-y-2" 
              onClick={() => {
                trackButtonClick('bottom-cta', 'Get the Free Booking Form (Takes 2 Minutes)');
                setIsModalOpen(true);
              }}
            >
              Get the Free Booking Form (Takes 2 Minutes)
            </Button>
            <p className="mt-6 md:mt-8 text-sm md:text-base text-muted-foreground">No credit card required. Free forever version.</p>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40 text-center text-sm text-muted-foreground relative z-10">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} OrbitL Dash Inc. All rights reserved.
        </div>
      </footer>

      {/* OPT-IN MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">Get Started with MobileCarwash</DialogTitle>
            <DialogDescription className="text-base mt-2 text-foreground/80">
            </DialogDescription>
          </DialogHeader>
          <LeadSignupForm />
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          25% {
            transform: translate(200px, -150px) scale(1.2);
          }
          50% {
            transform: translate(-120px, 80px) scale(0.9);
          }
          75% {
            transform: translate(150px, 180px) scale(1.1);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 10s ease-in-out infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animation-delay-5000 {
          animation-delay: 5s;
        }
      `}</style>
    </div>
  );
}