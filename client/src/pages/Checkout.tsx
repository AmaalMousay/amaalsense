import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation, useSearch } from 'wouter';
import { trpc } from '@/lib/trpc';
import { 
  Brain, 
  ArrowLeft,
  Copy,
  CheckCircle,
  Loader2,
  CreditCard
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';
import { toast } from 'sonner';

const planDetails: Record<string, { name: string; price: number; priceAnnual: number }> = {
  pro: { name: 'Professional', price: 49, priceAnnual: 470 },
  enterprise: { name: 'Enterprise', price: 299, priceAnnual: 2870 },
  government: { name: 'Government & NGO', price: 0, priceAnnual: 0 },
};

export default function Checkout() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  
  const plan = params.get('plan') || 'pro';
  const billing = params.get('billing') || 'monthly';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    transactionRef: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submitPayment = trpc.payments.submitPayment.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Payment submitted successfully! We will verify and confirm your payment shortly.');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit payment');
      setIsSubmitting(false);
    },
  });

  const planInfo = planDetails[plan] || planDetails.pro;
  const amount = billing === 'annual' ? planInfo.priceAnnual : planInfo.price;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    submitPayment.mutate({
      email: formData.email,
      name: formData.name,
      plan: plan as 'pro' | 'enterprise' | 'government',
      amount,
      billingPeriod: billing as 'monthly' | 'annual',
      paymentMethod: 'paypal',
      transactionRef: formData.transactionRef || undefined,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col relative z-10">
        <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <LogoIcon size="md" />
              <h1 className="text-2xl font-bold gradient-text">AmalSense</h1>
            </div>
          </div>
        </nav>

        <div className="flex-1 flex items-center justify-center p-8">
          <Card className="cosmic-card p-8 max-w-md text-center">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <h2 className="text-2xl font-bold cosmic-text mb-4">Payment Submitted!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your payment submission. We will verify your payment and activate your 
              <span className="text-accent font-bold"> {planInfo.name}</span> subscription within 24 hours.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              A confirmation email will be sent to <span className="text-accent">{formData.email}</span>
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => navigate('/dashboard')} className="glow-button text-white">
                Go to Dashboard
              </Button>
              <Button onClick={() => navigate('/')} variant="outline">
                Back to Home
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <LogoIcon size="md" />
            <h1 className="text-2xl font-bold gradient-text">AmalSense</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/pricing')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
        </div>
      </nav>

      <div className="flex-1 py-12">
        <div className="container max-w-2xl">
          <h2 className="text-3xl font-bold cosmic-text text-center mb-2">
            Complete Your <span className="gradient-text">Payment</span>
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            {planInfo.name} Plan - ${amount}/{billing === 'annual' ? 'year' : 'month'}
          </p>

          <div className="grid gap-8">
            {/* PayPal Payment Instructions */}
            <Card className="p-6 bg-blue-500/10 border-blue-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-blue-400">PayPal Payment</h3>
                  <p className="text-sm text-muted-foreground">Secure payment via PayPal</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Send payment to our PayPal account:
                </p>
                <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                  <span className="font-mono text-accent flex-1">amaalmousay@gmail.com</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard('amaalmousay@gmail.com')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg">
                  <span className="text-muted-foreground">Amount to pay:</span>
                  <span className="text-2xl font-bold text-accent">${amount}</span>
                </div>
                
                <a 
                  href={`https://paypal.me/amaalmousay/${amount}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.629h6.724c2.332 0 4.076.643 5.186 1.91.516.589.86 1.27 1.022 2.026.17.788.162 1.73-.023 2.796l-.012.063v.556l.433.248a3.56 3.56 0 0 1 .876.717c.446.52.757 1.168.927 1.927.176.787.21 1.72.097 2.77-.13 1.213-.442 2.269-.928 3.14a5.49 5.49 0 0 1-1.608 1.83c-.644.476-1.407.83-2.27 1.05-.837.214-1.77.323-2.77.323H12.06a.95.95 0 0 0-.938.803l-.012.063-.597 3.785-.01.051a.95.95 0 0 1-.937.803H7.076z"/>
                    </svg>
                    Pay ${amount} with PayPal
                  </Button>
                </a>
              </div>
            </Card>

            {/* Confirmation Form */}
            <Card className="p-6">
              <h3 className="font-bold mb-4">Confirm Your Payment</h3>
              <p className="text-sm text-muted-foreground mb-6">
                After completing the PayPal payment, fill in your details below to confirm your subscription.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="transactionRef">PayPal Transaction ID (Optional)</Label>
                  <Input
                    id="transactionRef"
                    value={formData.transactionRef}
                    onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                    placeholder="e.g., 1AB23456CD789012E"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can find this in your PayPal receipt email
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full glow-button text-white py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Confirm Payment
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you confirm that you have completed the PayPal payment.
                  We will verify and activate your subscription within 24 hours.
                </p>
              </form>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>AmalSense Engine © 2025 | Secure Payment Processing</p>
        </div>
      </footer>
    </div>
  );
}
