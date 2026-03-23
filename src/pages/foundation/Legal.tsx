import React from 'react';
import { PageHeader } from '@/components/common/PageCollection';
import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Info, HelpCircle, FileText, Lock, RefreshCw, Truck } from 'lucide-react';

const Legal: React.FC<{ type: string }> = ({ type }) => {
  const contentMap: Record<string, { title: string; description: string; icon: React.ReactNode }> = {
    terms: { title: "Terms of Service", description: "Our terms and conditions for using PawDeal.", icon: <FileText className="w-8 h-8 text-tropical" /> },
    privacy: { title: "Privacy Policy", description: "How we protect and use your data.", icon: <Lock className="w-8 h-8 text-tropical" /> },
    shipping: { title: "Shipping Policy", description: "Our rules for pet and product transport.", icon: <Truck className="w-8 h-8 text-tropical" /> },
    returns: { title: "Returns Policy", description: "How we handle returns and refunds.", icon: <RefreshCw className="w-8 h-8 text-tropical" /> },
    'seller-guidelines': { title: "Seller Guidelines", description: "Our standards for ethical breeding and selling.", icon: <ShieldCheck className="w-8 h-8 text-tropical" /> },
    welfare: { title: "Animal Welfare Promise", description: "Our commitment to the health and safety of every animal.", icon: <ShieldCheck className="w-8 h-8 text-reef" /> },
  };

  const { title, description, icon } = contentMap[type] || contentMap.terms;

  return (
    <div className="pb-20">
      <PageHeader 
        title={title} 
        description={description}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: title }]}
      />
      
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-border shadow-2xl rounded-[3rem] overflow-hidden bg-white">
            <CardContent className="p-12 md:p-20 space-y-12 prose prose-lg max-w-none text-muted-foreground">
              <div className="flex items-center gap-6 mb-12 bg-foam p-8 rounded-3xl border border-border">
                {icon}
                <div>
                   <h2 className="text-3xl font-extrabold text-ocean m-0">Official {title}</h2>
                   <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest mt-1">Last Updated: March 17, 2026</p>
                </div>
              </div>

              <section className="space-y-6">
                <h3 className="text-2xl font-extrabold text-ocean">1. Introduction</h3>
                <p>Welcome to PawDeal. This {title} document outlines the rules and standards we uphold to ensure a safe, ethical, and efficient marketplace for all users. By accessing our services, you agree to comply with these guidelines.</p>
              </section>

              <section className="space-y-6">
                <h3 className="text-2xl font-extrabold text-ocean">2. Our Commitment</h3>
                <p>At PawDeal, we prioritize the welfare of animals above all else. Whether it's our Shipping Policy or our Seller Guidelines, every rule is designed to ensure that pets find healthy homes and that our community remains a trusted space for pet lovers.</p>
                <ul className="list-disc pl-6 space-y-3 font-medium">
                   <li>Transparency in all transactions</li>
                   <li>Strict vetting process for all sellers</li>
                   <li>Encrypted and secure payment methods</li>
                   <li>Zero-tolerance for unethical practices</li>
                </ul>
              </section>

              <section className="space-y-6">
                <h3 className="text-2xl font-extrabold text-ocean">3. User Responsibilities</h3>
                <p>All users, whether buying or selling, are expected to act with integrity and respect for the animals involved. This includes providing accurate information, maintaining healthy environments for pets, and fulfilling order obligations promptly.</p>
              </section>

              <div className="bg-ocean text-white p-12 rounded-3xl mt-20 space-y-6 text-center shadow-xl">
                 <HelpCircle className="w-12 h-12 text-reef mx-auto mb-4" />
                 <h2 className="text-3xl font-extrabold tracking-tighter">Have any questions?</h2>
                 <p className="text-white/60 text-lg max-w-md mx-auto">If you need further clarification on any of our policies, please don't hesitate to reach out to our legal team.</p>
                 <button className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-reef/20">Contact Legal Support</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Legal;
