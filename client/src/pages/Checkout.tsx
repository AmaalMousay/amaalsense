import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation, useSearch } from 'wouter';
import { trpc } from '@/lib/trpc';
import { 
  Sparkles, 
  ArrowLeft,
  CreditCard,
  Building2,
  Globe,
  Wallet,
  Copy,
  CheckCircle,
  Loader2,
  Info
} from 'lucide-react';
import { toast } from 'sonner';

type PaymentMethod = 'paypal' | 'bank_transfer' | 'western_union' | 'moneygram' | 'crypto';

interface PaymentMethodInfo {
  id: PaymentMethod;
  name: string;
  nameAr: string;
  icon: React.ReactNode;
  description: string;
}

const paymentMethods: PaymentMethodInfo[] = [
  {
    id: 'paypal',
    name: 'PayPal',
    nameAr: 'باي بال',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Pay securely via PayPal',
  },
  {
    id: 'bank_transfer',
    name: 'Bank Transfer',
    nameAr: 'تحويل بنكي',
    icon: <Building2 className="w-6 h-6" />,
    description: 'Direct bank transfer',
  },
  {
    id: 'western_union',
    name: 'Western Union',
    nameAr: 'ويسترن يونيون',
    icon: <Globe className="w-6 h-6" />,
    description: 'International money transfer',
  },
  {
    id: 'moneygram',
    name: 'MoneyGram',
    nameAr: 'موني جرام',
    icon: <Globe className="w-6 h-6" />,
    description: 'International money transfer',
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency (USDT)',
    nameAr: 'عملة رقمية',
    icon: <Wallet className="w-6 h-6" />,
    description: 'Pay with USDT (Tether)',
  },
];

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
  
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('paypal');
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
      paymentMethod: selectedMethod,
      transactionRef: formData.transactionRef || undefined,
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getPaymentInstructions = () => {
    switch (selectedMethod) {
      case 'paypal':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="font-bold text-blue-400 mb-2">PayPal Payment</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Send payment to our PayPal account:
              </p>
              <div className="flex items-center gap-2 bg-background/50 p-3 rounded">
                <span className="font-mono text-accent">amaalmousay@gmail.com</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard('amaalmousay@gmail.com')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Amount: <span className="text-accent font-bold">${amount}</span>
              </p>
              <a 
                href={`https://paypal.me/amaalmousay/${amount}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3"
              >
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Pay with PayPal.me
                </Button>
              </a>
            </div>
          </div>
        );
      
      case 'bank_transfer':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <h4 className="font-bold text-green-400 mb-2">Bank Transfer</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Contact us for bank transfer details:
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Email:</span> <span className="text-accent">amaalmousay@gmail.com</span></p>
                <p><span className="text-muted-foreground">Account Name:</span> Amaal Radwan Bashir</p>
                <p><span className="text-muted-foreground">Amount:</span> <span className="text-accent font-bold">${amount}</span></p>
              </div>
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs">
                <Info className="w-4 h-4 inline mr-1 text-yellow-400" />
                Please email us to receive bank account details for your region.
              </div>
            </div>
          </div>
        );
      
      case 'western_union':
      case 'moneygram':
        const serviceName = selectedMethod === 'western_union' ? 'Western Union' : 'MoneyGram';
        return (
          <div className="space-y-4">
            <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <h4 className="font-bold text-orange-400 mb-2">{serviceName} Transfer</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Send money to the following receiver:
              </p>
              <div className="space-y-2 text-sm bg-background/50 p-3 rounded">
                <p><span className="text-muted-foreground">Receiver Name:</span> <span className="font-bold">Amaal Radwan Bashir</span></p>
                <p><span className="text-muted-foreground">Country:</span> Libya</p>
                <p><span className="text-muted-foreground">City:</span> Sabha</p>
                <p><span className="text-muted-foreground">Amount:</span> <span className="text-accent font-bold">${amount} USD</span></p>
              </div>
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs">
                <Info className="w-4 h-4 inline mr-1 text-yellow-400" />
                After sending, enter the {selectedMethod === 'western_union' ? 'MTCN' : 'Reference'} number below.
              </div>
            </div>
          </div>
        );
      
      case 'crypto':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <h4 className="font-bold text-purple-400 mb-2">Cryptocurrency (USDT)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Pay with USDT (Tether) on TRC20 network:
              </p>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Network:</span> <span className="text-accent">TRC20 (Tron)</span></p>
                <p><span className="text-muted-foreground">Amount:</span> <span className="text-accent font-bold">${amount} USDT</span></p>
              </div>
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs">
                <Info className="w-4 h-4 inline mr-1 text-yellow-400" />
                Contact us at amaalmousay@gmail.com to receive the USDT wallet address.
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col relative z-10">
        <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <Sparkles className="w-6 h-6 text-accent" />
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
            <Sparkles className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-bold gradient-text">AmalSense</h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/pricing')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
        </div>
      </nav>

      <div className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold cosmic-text text-center mb-2">
            Complete Your <span className="gradient-text">Payment</span>
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            {planInfo.name} Plan - ${amount}/{billing === 'annual' ? 'year' : 'month'}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Payment Methods */}
            <div>
              <h3 className="text-lg font-bold mb-4">Select Payment Method</h3>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <Card
                    key={method.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedMethod === method.id 
                        ? 'ring-2 ring-accent bg-accent/10' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        selectedMethod === method.id ? 'bg-accent text-white' : 'bg-muted'
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{method.name}</h4>
                        <p className="text-xs text-muted-foreground">{method.nameAr}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h3 className="text-lg font-bold mb-4">Payment Details</h3>
              
              {/* Instructions */}
              <div className="mb-6">
                {getPaymentInstructions()}
              </div>

              {/* Form */}
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
                  <Label htmlFor="transactionRef">
                    {selectedMethod === 'western_union' ? 'MTCN Number' : 
                     selectedMethod === 'moneygram' ? 'Reference Number' :
                     selectedMethod === 'crypto' ? 'Transaction Hash' :
                     'Transaction Reference'} (Optional)
                  </Label>
                  <Input
                    id="transactionRef"
                    value={formData.transactionRef}
                    onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                    placeholder="Enter after completing payment"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter this after you complete the payment
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full glow-button text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Payment Confirmation'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you confirm that you have completed the payment.
                  We will verify and activate your subscription within 24 hours.
                </p>
              </form>
            </div>
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
