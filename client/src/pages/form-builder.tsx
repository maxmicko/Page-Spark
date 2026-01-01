import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings2, 
  Palette, 
  Type, 
  Layout, 
  Code2, 
  Copy, 
  Check, 
  ChevronRight,
  Eye
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

export default function FormBuilder() {
  const { toast } = useToast();
  const [primaryColor, setPrimaryColor] = useState("#0ea5e9");
  const [borderRadius, setBorderRadius] = useState([8]);
  const [fontFamily, setFontFamily] = useState("Inter");
  const [formId, setFormId] = useState("form_" + Math.random().toString(36).substr(2, 9));
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe 
  src="https://orbitl.dash/embed/${formId}?color=${encodeURIComponent(primaryColor)}&radius=${borderRadius[0]}&font=${fontFamily}" 
  width="100%" 
  height="600px" 
  frameborder="0"
></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
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
                  <Palette className="w-4 h-4" /> Brand Color
                </Label>
                <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 rounded-lg border shadow-sm shrink-0" 
                    style={{ backgroundColor: primaryColor }}
                  />
                  <Input 
                    type="text" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="font-mono text-sm"
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
                    <SelectItem value="Inter">Inter (Sans)</SelectItem>
                    <SelectItem value="Outfit">Outfit (Display)</SelectItem>
                    <SelectItem value="Playfair Display">Playfair (Serif)</SelectItem>
                    <SelectItem value="JetBrains Mono">JetBrains (Mono)</SelectItem>
                  </SelectContent>
                </Select>
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
                <Button 
                  className="w-full gap-2" 
                  onClick={() => {
                    toast({
                      title: "Form Saved",
                      description: "Your customizations have been saved to " + formId,
                    });
                  }}
                >
                  Save Configuration
                </Button>
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
                    <Code2 className="w-4 h-4" /> Embed Code
                  </TabsTrigger>
                </TabsList>
                <div className="text-xs text-slate-400 font-mono hidden md:block">
                  ID: {formId}
                </div>
              </div>

              <TabsContent value="preview" className="mt-0">
                <Card className="p-8 md:p-12 min-h-[600px] bg-white border-slate-200 shadow-sm overflow-hidden relative">
                  <div className="max-w-md mx-auto space-y-8" style={{ fontFamily }}>
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold">Book Your Wash</h2>
                      <p className="text-slate-500 text-sm">Select a time and service below</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input placeholder="John Doe" style={{ borderRadius: `${borderRadius}px` }} />
                      </div>
                      <div className="space-y-2">
                        <Label>Service Type</Label>
                        <Select>
                          <SelectTrigger style={{ borderRadius: `${borderRadius}px` }}>
                            <SelectValue placeholder="Choose service" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic Wash</SelectItem>
                            <SelectItem value="pro">Full Detail</SelectItem>
                            <SelectItem value="interior">Interior Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Input type="date" style={{ borderRadius: `${borderRadius}px` }} />
                        </div>
                        <div className="space-y-2">
                          <Label>Time</Label>
                          <Input type="time" style={{ borderRadius: `${borderRadius}px` }} />
                        </div>
                      </div>
                      <Button 
                        className="w-full h-12 text-white" 
                        style={{ 
                          backgroundColor: primaryColor,
                          borderRadius: `${borderRadius}px`
                        }}
                      >
                        Confirm Booking
                      </Button>
                    </div>
                  </div>
                  
                  {/* Watermark for preview */}
                  <div className="absolute bottom-4 right-4 text-[10px] text-slate-300 font-mono rotate-[-5deg]">
                    PREVIEW MODE
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="code" className="mt-0">
                <Card className="p-6 bg-slate-900 text-slate-300 border-none shadow-xl min-h-[400px]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">HTML Embed Code</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyToClipboard}
                      className="text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      <span className="ml-2">{copied ? "Copied" : "Copy"}</span>
                    </Button>
                  </div>
                  <pre className="p-4 bg-slate-800/50 rounded-lg overflow-x-auto font-mono text-sm leading-relaxed text-blue-300">
                    {embedCode}
                  </pre>
                  <div className="mt-8 p-4 border border-slate-800 rounded-lg">
                    <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 text-primary" /> How to use
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Copy the code above and paste it into the HTML of your website. The form will automatically adapt to your chosen styles and will send booking requests directly to your OrbitL Dash.
                    </p>
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
