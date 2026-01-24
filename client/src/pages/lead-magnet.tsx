import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, X, Clock, MessageSquare } from "lucide-react";
import { BookingFormPreview } from "@/components/BookingFormPreview";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LeadMagnet() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setLocation] = useLocation();

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation("/success");
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/10">

      {/* HEADER */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="Logo" className="size-8" />
            <span className="font-heading font-bold text-xl tracking-tight">OrbitL Dash</span>
          </div>
          <Button onClick={() => setIsModalOpen(true)} size="sm" className="hidden sm:flex">
            Get the Free Form (Takes 2 Minutes)
          </Button>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="py-20 md:py-32 overflow-hidden relative">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold tracking-tight leading-[1.1] mb-6">
                  Free Booking Form for Mobile Detailers <span className="text-muted-foreground block text-2xl md:text-3xl mt-2 font-medium">(Built to Reduce No-Shows)</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg">
                  I built this after losing jobs to ghosting, bad timing, and endless texts. Use it free. No credit card.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto" onClick={() => setIsModalOpen(true)}>
                    Get the Free Booking Form (Takes 2 Minutes)
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                  <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-6 h-6 rounded-full bg-muted border border-background flex items-center justify-center text-[10px] font-bold">
                         {String.fromCharCode(64+i)}
                       </div>
                     ))}
                  </div>
                  Built for real mobile detailers. Most set it up in under 10 minutes.
                </div>
              </div>

              {/* Visual - The "Form" */}
              <div className="relative mx-auto w-full max-w-md lg:max-w-none flex justify-center lg:justify-end">
                <BookingFormPreview />
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM AGITATION */}
        <section className="py-20 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="text-3xl font-heading font-bold mb-12">Why you're losing money before you even show up</h2>

            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive mb-4">
                  <X className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Ghosting</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  You drive 30 minutes to a job, and they're not there. You just lost time, gas, and money.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                 <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600 mb-4">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Endless Texts</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  "How much for a sedan?" "Are you free Tuesday?" DMs and texts don't scale.
                </p>
              </div>

              <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                 <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 mb-4">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">Time Wasted</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Google Forms don't protect your calendar. You need a system that qualifies leads upfront.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT IT DOES */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-heading font-bold mb-10 text-center">What the Free Booking Form Does</h2>

            <div className="space-y-4">
              {[
                "Collects job details upfront (Vehicle type, Service needed, Address)",
                "Sets clear expectations (Water/Power requirements)",
                "Filters tire-kickers who aren't serious",
                "Reduces no-shows by confirming intent",
                "Saves drive time by validating locations"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                  <div className="mt-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span className="text-lg font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHAT THIS IS / ISN'T */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 opacity-90">
                  <X className="h-5 w-5" />
                  This is NOT:
                </h3>
                <ul className="space-y-4 opacity-80">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> A marketplace taking a cut
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> A complicated app you have to learn
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> A website redesign service
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  This IS:
                </h3>
                <ul className="space-y-4 font-medium">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> A booking form built for mobile detailers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> Something you can plug into what you already do
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" /> A simple tool to professionalize your business
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA REPEAT */}
        <section className="py-24 text-center">
          <div className="container mx-auto px-4">
             <h2 className="text-3xl font-heading font-bold mb-8">Start saving jobs today.</h2>
             <Button size="lg" className="h-14 px-10 text-lg shadow-xl hover:shadow-2xl transition-all" onClick={() => setIsModalOpen(true)}>
                Get the Free Booking Form (Takes 2 Minutes)
             </Button>
             <p className="mt-6 text-sm text-muted-foreground">No credit card required. Free forever version.</p>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-border/40 text-center text-sm text-muted-foreground">
        <div className="container mx-auto px-4">
          &copy; {new Date().getFullYear()} OrbitL Dash Inc. All rights reserved.
        </div>
      </footer>

      {/* OPT-IN MODAL - 2 STEP FLOW */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-heading">Set up your free booking form</DialogTitle>
            <DialogDescription className="text-base mt-2 text-foreground/80">
              This lets me customize the form for your detailing business and send setup tips. No spam.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleGetStarted} className="space-y-5 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input id="businessName" placeholder="Elite Details" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Where should booking alerts go? (Phone)</Label>
              <Input id="phone" type="tel" placeholder="(555) 000-0000" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Setup + updates (Email)</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City / Service Area (Optional)</Label>
              <Input id="city" placeholder="Los Angeles, CA" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issue">What's your biggest issue right now?</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-shows">No-shows / ghosting</SelectItem>
                  <SelectItem value="texting">Too much back-and-forth texting</SelectItem>
                  <SelectItem value="drive-time">Scheduling around drive time</SelectItem>
                  <SelectItem value="professional">Just want to look more professional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full h-12 text-lg font-bold">
                Create My Booking Form →
              </Button>
              <p className="mt-4 text-center text-xs text-muted-foreground italic">
                I only contact detailers who actually use the form.
              </p>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}