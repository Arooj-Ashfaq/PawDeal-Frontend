import React from 'react';
import { PageHeader } from '@/components/common/PageCollection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, ShieldCheck, Truck, CreditCard, MessageCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const FAQ: React.FC = () => {
  const categories = [
    { name: 'Buying', icon: <Heart className="w-5 h-5 text-reef" /> },
    { name: 'Selling', icon: <ShieldCheck className="w-5 h-5 text-tropical" /> },
    { name: 'Shipping', icon: <Truck className="w-5 h-5 text-tropical" /> },
    { name: 'Payment', icon: <CreditCard className="w-5 h-5 text-reef" /> },
  ];

  const faqs = [
    { q: "How do I know if a seller is reputable?", a: "Every seller on PawDeal undergoes a rigorous vetting process. We check their breeding history, facility standards, and health certifications. Look for the 'Verified' badge on their profile." },
    { q: "What is your animal welfare policy?", a: "We prioritize animal health above all else. Sellers must adhere to our strict Welfare Promise, which includes regular vet check-ups, appropriate socialization, and ethical breeding practices." },
    { q: "How does the shipping process work for pets?", a: "We partner with professional pet transport services that specialize in safe and comfortable travel. Your pet's health is monitored throughout the journey, and you'll receive real-time updates." },
    { q: "Can I return a pet if it's not a good fit?", a: "We encourage all potential owners to spend time researching and meeting pets virtually before purchase. While our returns policy is strict due to the well-being of the animal, we work with sellers to ensure re-homing is handled ethically if necessary." },
    { q: "Are payments secure on PawDeal?", a: "Yes, we use industry-standard encryption for all transactions. Your payment is held in escrow until the pet or product is safely delivered, providing protection for both buyers and sellers." },
    { q: "How do I message a seller?", a: "Simply click the 'Message Seller' button on any pet listing. You'll need to be logged in to start a conversation. You can manage all your chats from the Messages dashboard." },
  ];

  return (
    <div className="pb-20">
      <PageHeader 
        title="Frequently Asked Questions" 
        description="Everything you need to know about buying, selling, and caring for your pets on PawDeal."
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'FAQ' }]}
      />
      
      <div className="container px-4">
        <div className="grid lg:grid-cols-4 gap-8 mb-20">
           {categories.map((cat, i) => (
              <Card key={i} className="bg-white border-border shadow-sm rounded-3xl p-6 hover:shadow-xl transition-shadow cursor-pointer group">
                 <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-foam rounded-2xl group-hover:scale-110 transition-transform">{cat.icon}</div>
                    <h3 className="font-extrabold text-ocean uppercase tracking-widest text-xs">{cat.name} Questions</h3>
                 </div>
              </Card>
           ))}
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
             <h2 className="text-4xl font-extrabold text-ocean">Top <span className="text-reef">Questions</span></h2>
             <p className="text-muted-foreground text-lg max-w-md mx-auto">Find quick answers to the most common inquiries from our community.</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className="border-border bg-white rounded-3xl px-8 py-2 shadow-sm">
                <AccordionTrigger className="text-xl font-extrabold text-ocean hover:text-reef hover:no-underline text-left">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-lg leading-relaxed pt-2 pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="bg-foam p-12 rounded-[3rem] text-center space-y-8 border border-white shadow-inner mt-20">
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl border border-border">
               <MessageCircle className="w-10 h-10 text-tropical" />
             </div>
             <h3 className="text-3xl font-extrabold text-ocean">Still have questions?</h3>
             <p className="text-muted-foreground text-lg max-w-sm mx-auto">Our support team is available 24/7 to help you with any concerns or queries.</p>
             <div className="flex flex-wrap justify-center gap-4">
               <Button asChild className="bg-reef hover:bg-reef/90 text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-reef/20">
                 <Link to="/contact">Chat with Support</Link>
               </Button>
               <Button asChild variant="outline" className="border-ocean text-ocean font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-ocean/5">
                 <Link to="/about">Learn More About Us</Link>
               </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
