import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Success() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your subscription has been activated. Welcome to Page-Spark!
        </p>
        <Link href="/">
          <Button size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}