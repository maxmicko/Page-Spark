import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function Cancel() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md mx-auto text-center p-8">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4">Checkout Cancelled</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your checkout was cancelled. No charges were made.
        </p>
        <Link href="/pricing">
          <Button size="lg">
            Back to Pricing
          </Button>
        </Link>
      </div>
    </div>
  );
}