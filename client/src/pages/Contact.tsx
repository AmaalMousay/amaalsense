import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { 
  Send, 
  Building2, 
  Mail, 
  User,
  Globe,
  MessageSquare,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { LogoIcon } from '@/components/Logo';

const organizationTypes = [
  { value: 'government', label: 'Government Agency', labelAr: 'جهة حكومية' },
  { value: 'ngo', label: 'NGO / Non-Profit', labelAr: 'منظمة غير ربحية' },
  { value: 'media', label: 'Media / News Organization', labelAr: 'مؤسسة إعلامية' },
  { value: 'enterprise', label: 'Enterprise / Corporation', labelAr: 'شركة / مؤسسة' },
  { value: 'academic', label: 'Academic / Research', labelAr: 'أكاديمي / بحثي' },
  { value: 'other', label: 'Other', labelAr: 'أخرى' },
];

const interestedTiers = [
  { value: 'pro', label: 'Professional ($49/month)' },
  { value: 'enterprise', label: 'Enterprise ($299/month)' },
  { value: 'government', label: 'Government & NGO (Custom)' },
];

export default function Contact() {
  const [, navigate] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    organizationName: '',
    organizationType: '',
    country: '',
    interestedTier: '',
    message: '',
  });

  const submitInquiry = trpc.subscription.submitEnterpriseInquiry.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Your inquiry has been submitted successfully!');
    },
    onError: (error) => {
      toast.error('Failed to submit inquiry. Please try again.');
      console.error('Submit error:', error);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.contactName || !formData.contactEmail || !formData.organizationName || 
        !formData.organizationType || !formData.interestedTier) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    submitInquiry.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col relative z-10">
        {/* Navigation */}
        <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <LogoIcon size="md" />
              <h1 className="text-2xl font-bold gradient-text">Amaalsense</h1>
            </div>
          </div>
        </nav>

        {/* Success Message */}
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold cosmic-text mb-4">Thank You!</h2>
            <p className="text-muted-foreground mb-8">
              Your inquiry has been received. Our team will contact you within 24-48 hours
              to discuss your requirements and schedule a demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/')} className="glow-button text-white">
                Return Home
              </Button>
              <Button onClick={() => navigate('/pricing')} variant="outline">
                View Pricing
              </Button>
            </div>
          </div>
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
            <h1 className="text-2xl font-bold gradient-text">Amaalsense</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-sm hover:text-accent transition-colors">
              Home
            </button>
            <button onClick={() => navigate('/pricing')} className="text-sm hover:text-accent transition-colors">
              Pricing
            </button>
            <button onClick={() => navigate('/about')} className="text-sm hover:text-accent transition-colors">
              About
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 text-center">
        <div className="container max-w-3xl">
          <h2 className="text-4xl font-bold cosmic-text mb-4">
            Contact <span className="gradient-text">Sales</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ready to unlock collective emotion intelligence for your organization?
            Fill out the form below and our team will get back to you shortly.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="pb-16">
        <div className="container max-w-2xl">
          <Card className="cosmic-card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold cosmic-text flex items-center gap-2">
                  <User className="w-5 h-5 text-accent" />
                  Contact Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Full Name *</Label>
                    <Input
                      id="contactName"
                      placeholder="John Doe"
                      value={formData.contactName}
                      onChange={(e) => handleChange('contactName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Email Address *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="john@organization.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleChange('contactEmail', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Organization Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold cosmic-text flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-accent" />
                  Organization Details
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name *</Label>
                  <Input
                    id="organizationName"
                    placeholder="Your Organization"
                    value={formData.organizationName}
                    onChange={(e) => handleChange('organizationName', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <select
                      id="organizationType"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                      value={formData.organizationType}
                      onChange={(e) => handleChange('organizationType', e.target.value)}
                      required
                    >
                      <option value="">Select type...</option>
                      {organizationTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      placeholder="United States"
                      value={formData.country}
                      onChange={(e) => handleChange('country', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Interest */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold cosmic-text flex items-center gap-2">
                  <Globe className="w-5 h-5 text-accent" />
                  Your Interest
                </h3>
                
                <div className="space-y-2">
                  <Label htmlFor="interestedTier">Interested Plan *</Label>
                  <select
                    id="interestedTier"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    value={formData.interestedTier}
                    onChange={(e) => handleChange('interestedTier', e.target.value)}
                    required
                  >
                    <option value="">Select plan...</option>
                    {interestedTiers.map((tier) => (
                      <option key={tier.value} value={tier.value}>
                        {tier.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    <MessageSquare className="w-4 h-4 inline mr-2" />
                    Tell us about your needs
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Describe your use case, requirements, or any questions you have..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full glow-button text-white py-6"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Inquiry
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to be contacted by our sales team.
                We respect your privacy and will never share your information.
              </p>
            </form>
          </Card>
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="py-12 border-t border-border/50">
        <div className="container max-w-2xl text-center">
          <h3 className="text-xl font-bold cosmic-text mb-4">Other Ways to Reach Us</h3>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="w-5 h-5 text-accent" />
              <span>contact@amaalsense.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p>Amaalsense Engine © 2025 | Transforming Human Emotion into Data | By Amaal Radwan</p>
        </div>
      </footer>
    </div>
  );
}
