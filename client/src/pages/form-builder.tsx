import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings2,
  Palette,
  Type,
  Layout,
  Code2,
  Copy,
  Check,
  ChevronRight,
  Eye,
  Link,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Zap,
  CheckCircle2,
  Circle,
  AlertCircle,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import BookingWizard from "@/components/BookingWizard";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  return (
    <nav className="bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="Logo" className="size-8" />
            <span className="text-xl font-bold font-heading text-foreground">OrbitL Dash</span>
          </div>
          <div className="flex items-center gap-8">
            <a href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</a>
            <Button size="sm" onClick={() => window.location.href = 'https://app.orbitl-dash.us'}>Dashboard</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Tooltip component
const Tooltip = ({ children, content }: any) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-50 px-3 py-2 text-xs text-white bg-slate-900 rounded-lg -top-2 left-full ml-2 w-48">
          {content}
          <div className="absolute w-2 h-2 bg-slate-900 transform rotate-45 -left-1 top-3" />
        </div>
      )}
    </div>
  );
};

// Color presets
const colorPresets = [
  { name: "Professional Blue", color: "#0ea5e9", desc: "Trust & reliability" },
  { name: "Modern Purple", color: "#8b5cf6", desc: "Creative & innovative" },
  { name: "Energetic Orange", color: "#f97316", desc: "Bold & exciting" },
  { name: "Growth Green", color: "#10b981", desc: "Natural & fresh" },
  { name: "Premium Dark", color: "#1e293b", desc: "Luxury & elegance" }
];

// Mock data for preview
const mockBookingData = {
  services: [
    { id: "wash", name: "Exterior Wash", duration: 30, price: 25 },
    { id: "detail", name: "Full Detail", duration: 90, price: 120 },
  ],
  availability: {
    today: true,
    slots: ["10:00", "11:30", "14:00", "16:00"],
  },
};

export default function FormBuilder() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [borderRadius, setBorderRadius] = useState([8]);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [formName, setFormName] = useState("My Booking Form");
  const [businessName, setBusinessName] = useState("Premium Car Wash");
  const [bookingId, setBookingId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [previewUpdating, setPreviewUpdating] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  const isMock = !bookingId;

  // Collapsible sections
  const [brandingOpen, setBrandingOpen] = useState(true);
  const [stylingOpen, setStylingOpen] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user);
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('booking_id')
          .eq('id', user.id)
          .single();
        if (profile?.booking_id) {
          setBookingId(profile.booking_id);
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!bookingId) {
      setBookingData(mockBookingData);
      return;
    }

    setLoadingData(true);

    supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single()
      .then(({ data }) => {
        setBookingData(data);
      })
      .finally(() => setLoadingData(false));
  }, [bookingId]);

  // Simulate preview update
  useEffect(() => {
    setPreviewUpdating(true);
    const timer = setTimeout(() => setPreviewUpdating(false), 400);
    return () => clearTimeout(timer);
  }, [primaryColor, borderRadius, fontFamily, businessName]);

  const embedUrl = bookingId ? `${window.location.origin}/embed?bookingId=${bookingId}&color=${encodeURIComponent(primaryColor)}&radius=${borderRadius[0]}&font=${encodeURIComponent(fontFamily)}&businessName=${encodeURIComponent(businessName)}` : '';
  
  const embedCode = bookingId ? `<iframe
  src="${embedUrl}"
  width="100%"
  height="800px"
  frameborder="0"
  style="border: none;"
></iframe>` : 'Please enter your booking ID to generate embed code';

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard.`,
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setPrimaryColor(preset.color);
  };

  const isStep1Complete = bookingId && businessName;
  const canProceedToStep2 = isStep1Complete;

  const steps = [
    { num: 1, title: "Configure", icon: Settings2, complete: isStep1Complete },
    { num: 2, title: "Deploy", icon: Code2, complete: false }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      {/* Progress Stepper */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {steps.map((s, idx) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => {
                      if (s.num === 1) setStep(1);
                      if (s.num === 2 && canProceedToStep2) setStep(2);
                    }}
                    disabled={s.num > 1 && !canProceedToStep2}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      step === s.num
                        ? "bg-primary text-white shadow-lg scale-110"
                        : s.complete
                        ? "bg-green-500 text-white"
                        : "bg-slate-200 text-slate-400"
                    } ${s.num > 1 && !canProceedToStep2 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:scale-105"}`}
                  >
                    {s.complete && step !== s.num ? <CheckCircle2 className="w-6 h-6" /> : <s.icon className="w-5 h-5" />}
                  </button>
                  <span className={`text-xs mt-2 font-medium ${step === s.num ? "text-primary" : "text-slate-500"}`}>
                    {s.title}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-4 transition-colors ${s.complete ? "bg-green-500" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: CONFIGURE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid md:grid-cols-[380px_1fr] gap-8"
            >
              {/* Sidebar - Controls */}
              <aside className="space-y-6">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  <h1 className="text-xl font-bold font-heading">Form Customizer</h1>
                </div>

                <Card className="p-6 space-y-6 border-slate-200 shadow-sm">
                  {/* Essential Info Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2 text-slate-600">
                        <Sparkles className="w-4 h-4 text-primary" /> Essential Information
                      </Label>
                      <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">Required</span>
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 text-slate-600 mb-2">
                        Booking ID
                        <Tooltip content="Your unique booking ID from OrbitL Dash. Find this in your dashboard under Settings → Integration.">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                        </Tooltip>
                      </Label>
                      <Input
                        value={bookingId}
                        onChange={(e) => setBookingId(e.target.value)}
                        placeholder="e.g. book_abc123xyz"
                        className="font-mono text-sm"
                      />
                      {!bookingId && (
                        <div className="flex items-start gap-2 mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-md">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-amber-800">
                            <p className="font-medium">Required to continue</p>
                            <p className="text-amber-700 mt-0.5">
                              Find in <a href="https://app.orbitl-dash.us/settings" className="underline" target="_blank" rel="noopener noreferrer">Dashboard → Settings</a>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 text-slate-600 mb-2">
                        Business Name
                        <Tooltip content="This appears at the top of your booking form and in confirmations">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                        </Tooltip>
                      </Label>
                      <Input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Premium Car Wash"
                      />
                      {businessName && (
                        <p className="text-xs text-slate-500 mt-1">
                          Preview: "Book with {businessName}"
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="flex items-center gap-2 text-slate-600 mb-2">
                        Form Name
                        <span className="text-xs text-slate-400 font-normal">(Optional)</span>
                      </Label>
                      <Input
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Main Website Form"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        For your internal reference
                      </p>
                    </div>
                  </div>

                  {/* Branding Section */}
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => setBrandingOpen(!brandingOpen)}
                      className="w-full flex items-center justify-between mb-3"
                    >
                      <Label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                        <Palette className="w-4 h-4" /> Brand Color
                      </Label>
                      {brandingOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {brandingOpen && (
                      <div className="space-y-4">
                        {/* Quick Presets */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-xs font-medium text-slate-600">Quick Presets</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {colorPresets.map((preset) => (
                              <button
                                key={preset.name}
                                onClick={() => applyPreset(preset)}
                                className="p-2.5 border-2 rounded-md hover:border-primary transition-all text-left"
                                style={{ borderColor: primaryColor === preset.color ? preset.color : '#e2e8f0' }}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.color }} />
                                  <span className="text-xs font-medium">{preset.name.split(' ')[1]}</span>
                                </div>
                                <p className="text-[10px] text-slate-500">{preset.desc}</p>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Color */}
                        <div>
                          <span className="text-xs font-medium text-slate-600 mb-2 block">Custom Color</span>
                          <div className="flex gap-3">
                            <input 
                              type="color" 
                              value={primaryColor} 
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="w-12 h-12 rounded-lg border-0 shadow-sm cursor-pointer bg-transparent"
                            />
                            <Input 
                              type="text" 
                              value={primaryColor} 
                              onChange={(e) => setPrimaryColor(e.target.value)}
                              className="font-mono text-sm uppercase flex-1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Styling Section */}
                  <div className="pt-4 border-t">
                    <button
                      onClick={() => setStylingOpen(!stylingOpen)}
                      className="w-full flex items-center justify-between mb-3"
                    >
                      <Label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                        <Type className="w-4 h-4" /> Typography & Style
                      </Label>
                      {stylingOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </button>

                    {stylingOpen && (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-slate-600 mb-2 block">Font Family</Label>
                          <Select value={fontFamily} onValueChange={setFontFamily}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select font" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Inter" style={{ fontFamily: 'Inter' }}>Inter - Clean Modern Sans</SelectItem>
                              <SelectItem value="Playfair Display" style={{ fontFamily: 'Playfair Display' }}>Playfair Display - Elegant Serif</SelectItem>
                              <SelectItem value="Space Grotesk" style={{ fontFamily: 'Space Grotesk' }}>Space Grotesk - Tech Geometric</SelectItem>
                              <SelectItem value="Bebas Neue" style={{ fontFamily: 'Bebas Neue' }}>Bebas Neue - Bold Display</SelectItem>
                              <SelectItem value="JetBrains Mono" style={{ fontFamily: 'JetBrains Mono' }}>JetBrains Mono - Technical Monospace</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-slate-600">Corner Radius</Label>
                            <span className="text-xs font-mono text-slate-400">{borderRadius}px</span>
                          </div>
                          <Slider 
                            value={borderRadius} 
                            onValueChange={setBorderRadius} 
                            max={24} 
                            step={1} 
                          />
                          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>Sharp</span>
                            <span>Rounded</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedToStep2}
                  className="w-full"
                  size="lg"
                >
                  Continue to Deploy
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </aside>

              {/* Right: Live Preview */}
              <div className="hidden md:block">
                <Card className="p-4 h-full border-slate-200 shadow-sm relative overflow-hidden">
                  {previewUpdating && (
                    <div className="absolute top-3 right-3 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      Updating…
                    </div>
                  )}

                  {!bookingId && (
                    <div className="absolute top-3 left-3 text-xs bg-slate-900 text-white px-2 py-1 rounded-full">
                      Mock preview
                    </div>
                  )}

                  {loadingData ? (
                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                      Loading real data…
                    </div>
                  ) : (
                    <BookingWizard
                      data={bookingData}
                      styles={{
                        primaryColor,
                        borderRadius: borderRadius[0],
                        fontFamily,
                      }}
                      businessName={businessName || "Your Business"}
                    />
                  )}

                  <div className="absolute bottom-2 right-2 text-[10px] text-slate-300 font-mono rotate-[-5deg]">
                    LIVE PREVIEW
                  </div>
                </Card>
              </div>
            </motion.div>
          )}


          {/* STEP 2: DEPLOY */}
          {step === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h2 className="text-2xl font-bold font-heading mb-1">Deploy Your Form</h2>
                  <p className="text-slate-600 text-sm">Choose how you want to integrate the form</p>
                </div>
                <Button onClick={() => setStep(1)} variant="outline">
                  <Settings2 className="w-4 h-4 mr-2" />
                  Back to Configure
                </Button>
              </div>

              {/* Direct Link */}
              <Card className="p-6 bg-slate-900 text-slate-300 border-none shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Link className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Direct Link</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(embedUrl, "Link")}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-lg overflow-x-auto mb-4">
                  <a 
                    href={embedUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm break-all font-mono"
                  >
                    {embedUrl || 'Please enter your booking ID to generate link'}
                  </a>
                </div>
                <Button 
                  onClick={() => window.open(embedUrl, '_blank')}
                  variant="outline"
                  size="sm"
                  className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white mb-4"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Test in New Window
                </Button>
                <div className="p-4 border border-slate-800 rounded-lg space-y-3">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" /> How to Use Direct Link
                  </h4>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p className="text-slate-300 font-medium mb-2">Best for:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Adding as a button or link on your website</li>
                      <li>Sharing via email, SMS, or social media</li>
                      <li>Quick access without embedding code</li>
                      <li>Mobile-friendly standalone pages</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Iframe Code */}
              <Card className="p-6 bg-slate-900 text-slate-300 border-none shadow-xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">HTML Iframe Code</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(embedCode, "Iframe code")}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
                  </Button>
                </div>
                <pre className="p-4 bg-slate-800/50 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed text-blue-300 mb-4">
                  {embedCode}
                </pre>
                <div className="p-4 border border-slate-800 rounded-lg space-y-3">
                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                    <ChevronRight className="w-4 h-4 text-primary" /> How to Use Iframe Code
                  </h4>
                  <div className="space-y-2 text-xs text-slate-400">
                    <p className="text-slate-300 font-medium mb-2">Best for:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Embedding the form directly on your website</li>
                      <li>Keeping customers on your site (no page redirect)</li>
                      <li>Full control over form placement and styling</li>
                      <li>Professional, seamless integration</li>
                    </ul>
                  </div>
                  <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <p className="text-slate-300 font-medium mb-2">Steps:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Copy the HTML code above</li>
                      <li>Open your website's HTML editor or page builder</li>
                      <li>Paste the code where you want the form to appear</li>
                      <li>Save and publish your page</li>
                      <li>The form will display embedded on your site</li>
                    </ol>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <p className="text-xs text-slate-500 italic">
                      Tip: You can adjust the width and height in the iframe code to fit your design
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}