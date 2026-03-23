import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/PageCollection';
import { Search, Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="pb-20 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center text-center px-4 py-32 bg-foam">
      <div className="container max-w-2xl bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-border space-y-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-reef/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-tropical/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>
         
         <div className="relative">
            <h1 className="text-[10rem] md:text-[15rem] font-black text-ocean/5 leading-none tracking-tighter absolute inset-0 flex items-center justify-center select-none pointer-events-none">404</h1>
            <div className="w-48 h-48 bg-foam rounded-full flex items-center justify-center mx-auto mb-12 shadow-inner border border-white">
               <img 
                 src="https://images.unsplash.com/photo-1541364983171-a8ba01d95cfc?auto=format&fit=crop&w=400&q=80" 
                 alt="Confused dog"
                 className="w-full h-full object-cover rounded-full p-2"
               />
            </div>
         </div>

         <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-extrabold text-ocean tracking-tighter">Oops! Lost in the <span className="text-reef">Park?</span></h2>
            <p className="text-muted-foreground text-xl max-w-sm mx-auto leading-relaxed">Even the best-trained pets get lost sometimes. We couldn't find the page you were looking for.</p>
         </div>

         <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button asChild size="lg" className="bg-ocean text-white font-extrabold h-14 px-12 rounded-xl text-lg shadow-xl shadow-ocean/20 group">
               <Link to="/" className="flex items-center gap-2"><Home className="w-5 h-5" /> Go Back Home</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-reef text-reef font-extrabold h-14 px-12 rounded-xl text-lg hover:bg-reef/10 shadow-xl shadow-reef/10">
               <Link to="/pets" className="flex items-center gap-2"><Search className="w-5 h-5" /> Browse Pets</Link>
            </Button>
         </div>

         <div className="pt-8 border-t border-border flex justify-center gap-8 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <Link to="/contact" className="hover:text-reef">Report Issue</Link>
            <Link to="/faq" className="hover:text-reef">Get Help</Link>
         </div>
      </div>
    </div>
  );
};

export default NotFound;
