import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { User } from '@supabase/supabase-js';
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
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function FormBuilder() {
  const { toast } = useToast();
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [borderRadius, setBorderRadius] = useState([8]);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [formName, setFormName] = useState("My Booking Form");
  const [businessName, setBusinessName] = useState("Premium Car Wash");
  const [bookingId, setBookingId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar - Controls */}
          <aside className="w-full md:w-80 space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold font-heading">Form Customizer</h1>
            </div>

            <Card className="p-6 space-y-8 border-slate-200 shadow-sm">
              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-slate-600">
                  <Layout className="w-4 h-4" /> Business Name
                </Label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Premium Car Wash"
                />
                <Label className="flex items-center gap-2 text-slate-600">
                  <Layout className="w-4 h-4" /> Form Name
                </Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Main Website Form"
                />
                <Label className="flex items-center gap-2 text-slate-600">
                  <Layout className="w-4 h-4" /> Booking ID
                </Label>
                <Input
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                  placeholder="Paste your booking ID here"
                  className="font-mono text-sm"
                />
                <div className="text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded border truncate">
                  {user ? 'Booking ID loaded from your account' : 'Enter your booking ID above to generate embed code'}
                </div>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-slate-600">
                  <Palette className="w-4 h-4" /> Brand Color
                </Label>
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

              <div className="space-y-4">
                <Label className="flex items-center gap-2 text-slate-600">
                  <Type className="w-4 h-4" /> Typography
                </Label>
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
                <p className="text-xs text-slate-500">
                  Choose a font style that matches your brand personality
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="flex items-center gap-2 text-slate-600">
                    <Layout className="w-4 h-4" /> Corner Radius
                  </Label>
                  <span className="text-xs font-mono text-slate-400">{borderRadius}px</span>
                </div>
                <Slider 
                  value={borderRadius} 
                  onValueChange={setBorderRadius} 
                  max={24} 
                  step={1} 
                />
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-slate-500 text-center">
                  Styles are applied via URL parameters in the embed code
                </p>
              </div>
            </Card>
          </aside>

          {/* Main Content - Preview & Code */}
          <main className="flex-1 space-y-6">
            <Tabs defaultValue="preview" className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="preview" className="gap-2">
                    <Eye className="w-4 h-4" /> Preview
                  </TabsTrigger>
                  <TabsTrigger value="code" className="gap-2">
                    <Code2 className="w-4 h-4" /> Embed Options
                  </TabsTrigger>
                </TabsList>
                <div className="text-xs text-slate-400 font-mono hidden md:block">
                  Booking ID: {bookingId || 'Not set'}
                </div>
              </div>

              <TabsContent value="preview" className="mt-0">
                <Card className="p-8 md:p-12 min-h-[600px] max-h-[850px] bg-white border-slate-200 shadow-sm overflow-hidden relative flex flex-col">
                  <BookingWizard
                    styles={{
                      primaryColor,
                      borderRadius: borderRadius[0],
                      fontFamily
                    }}
                    businessName={businessName}
                  />
                  
                  {/* Watermark for preview */}
                  <div className="absolute bottom-4 right-4 text-[10px] text-slate-300 font-mono rotate-[-5deg]">
                    PREVIEW MODE
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="mt-0 space-y-6">
                {/* Direct Link */}
                <Card className="p-6 bg-slate-900 text-slate-300 border-none shadow-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-slate-400" />
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
                  <div className="p-4 bg-slate-800/50 rounded-lg overflow-x-auto">
                    <a 
                      href={embedUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm break-all font-mono"
                    >
                      {embedUrl || 'Please enter your booking ID to generate link'}
                    </a>
                  </div>
                  <div className="mt-4 p-4 border border-slate-800 rounded-lg space-y-3">
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
                    <div className="space-y-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      <p className="text-slate-300 font-medium mb-2">Steps:</p>
                      <ol className="list-decimal list-inside space-y-1 ml-2">
                        <li>Copy the link above</li>
                        <li>Add it as a button or text link on your website</li>
                        <li>Or share it directly with customers</li>
                        <li>When clicked, the form opens in a new page</li>
                      </ol>
                    </div>
                    <div className="pt-2 border-t border-slate-800">
                      <p className="text-xs text-slate-500 italic">
                        Example: Add a "Book Now" button that links to this URL
                      </p>
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
                  <pre className="p-4 bg-slate-800/50 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed text-blue-300">
                    {embedCode}
                  </pre>
                  <div className="mt-4 p-4 border border-slate-800 rounded-lg space-y-3">
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
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
