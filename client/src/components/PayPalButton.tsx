/**
 * PayPal Payment Button Component
 * Integrates PayPal payments for subscription tiers
 */

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// PayPal Business Email
const PAYPAL_EMAIL = "amaalmousay@gmail.com";

// Subscription prices
const PRICES = {
  pro: {
    monthly: 29,
    yearly: 290,
  },
  enterprise: {
    monthly: 99,
    yearly: 990,
  },
};

interface PayPalButtonProps {
  tier: "pro" | "enterprise";
  billingCycle?: "monthly" | "yearly";
  className?: string;
}

export function PayPalButton({ tier, billingCycle = "monthly", className }: PayPalButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  
  const price = PRICES[tier][billingCycle];
  const tierName = tier === "pro" ? "Pro" : "Enterprise";
  const cycleLabel = billingCycle === "monthly" ? "Monthly" : "Yearly";
  
  // PayPal payment link
  const paypalLink = `https://www.paypal.com/paypalme/${PAYPAL_EMAIL.split("@")[0]}/${price}`;
  
  // PayPal hosted button (subscription)
  const getPayPalFormUrl = () => {
    const baseUrl = "https://www.paypal.com/cgi-bin/webscr";
    const params = new URLSearchParams({
      cmd: "_xclick",
      business: PAYPAL_EMAIL,
      item_name: `Amaalsense ${tierName} - ${cycleLabel} Subscription`,
      amount: price.toString(),
      currency_code: "USD",
      return: window.location.origin + "/pricing?success=true",
      cancel_return: window.location.origin + "/pricing?cancelled=true",
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const handlePayment = () => {
    setShowDialog(true);
  };

  const proceedToPayPal = () => {
    window.open(getPayPalFormUrl(), "_blank");
    setShowDialog(false);
  };

  return (
    <>
      <Button 
        onClick={handlePayment}
        className={className}
        variant="default"
      >
        <svg 
          className="w-5 h-5 mr-2" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
        </svg>
        Pay with PayPal
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              Subscribe to Amaalsense {tierName}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              You're about to subscribe to the {tierName} plan ({cycleLabel})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Plan</span>
                <span className="text-white font-semibold">{tierName}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-slate-300">Billing</span>
                <span className="text-white">{cycleLabel}</span>
              </div>
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700">
                <span className="text-slate-300">Total</span>
                <span className="text-2xl font-bold text-purple-400">${price}</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400">
              You will be redirected to PayPal to complete your payment securely.
              After payment, please email your receipt to <strong>amaalmousay@gmail.com</strong> to activate your subscription.
            </p>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowDialog(false)}
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={proceedToPayPal}
                className="flex-1 bg-[#0070ba] hover:bg-[#003087] text-white"
              >
                <svg 
                  className="w-5 h-5 mr-2" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
                </svg>
                Continue to PayPal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Simple PayPal.me link button for donations/tips
export function PayPalDonateButton({ amount = 5, className }: { amount?: number; className?: string }) {
  const handleDonate = () => {
    window.open(`https://www.paypal.me/amaalmousay/${amount}`, "_blank");
  };

  return (
    <Button 
      onClick={handleDonate}
      variant="outline"
      className={className}
    >
      <svg 
        className="w-4 h-4 mr-2" 
        viewBox="0 0 24 24" 
        fill="currentColor"
      >
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
      </svg>
      Support with ${amount}
    </Button>
  );
}
