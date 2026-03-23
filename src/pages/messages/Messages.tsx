import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { 
  Search, Send, Phone, Video, Info, 
  ChevronLeft, MoreVertical, Trash2, 
  Flag, Ban, Smile, Paperclip, CheckCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const Messages: React.FC = () => {
  const { user, loading } = useAuth();
  const { id: threadId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [messageText, setMessageText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      toast.error('Please login to access messages');
      navigate('/login?redirect=/messages');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [threadId]);

  if (loading || !user) return <div className="container py-20 text-center">Loading...</div>;

  const mockThreads = [
    { id: 't1', name: 'Golden Paws Kennel', avatar: 'sel-1.jpg', lastMsg: 'Is the puppy still available?', time: '10:30 AM', unread: 2, online: true },
    { id: 't2', name: 'The Cat Emporium', avatar: 'sel-2.jpg', lastMsg: 'The shipping will be arranged by Friday.', time: 'Yesterday', unread: 0, online: false },
    { id: 't3', name: 'Fish & Fins', avatar: 'sel-3.jpg', lastMsg: 'We have the blue tang in stock.', time: 'Monday', unread: 0, online: true },
  ];

  const mockMessages = [
    { id: 1, sender: 'other', text: 'Hi! Are you interested in the Golden Retriever puppy?', time: '10:25 AM' },
    { id: 2, sender: 'me', text: 'Yes! Is he still available?', time: '10:28 AM' },
    { id: 3, sender: 'other', text: 'Yes, he is! He just turned 8 weeks and is ready for his new home.', time: '10:30 AM' },
    { id: 4, sender: 'other', text: 'Would you like to schedule a video call to see him?', time: '10:30 AM' },
  ];

  const currentThread = mockThreads.find(t => t.id === threadId) || mockThreads[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    toast.success('Message sent!');
    setMessageText('');
  };

  return (
    <div className="bg-foam h-[calc(100vh-64px)] overflow-hidden">
      <div className="container h-full p-4 lg:p-8">
        <div className="bg-white rounded-[2rem] shadow-2xl h-full flex overflow-hidden border border-border">
          
          {/* Thread List - Sidebar */}
          <aside className={`w-full lg:w-[400px] flex flex-col border-r border-border ${threadId ? "hidden lg:flex" : "flex"}`}>
            <div className="p-8 border-b border-border space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-ocean">Messages</h2>
                <Badge className="bg-reef text-white px-2 py-0.5 font-extrabold h-5 min-w-5 flex items-center justify-center rounded-full">3</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10 h-12 bg-foam border-none rounded-xl" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {mockThreads.map((thread) => (
                <Link 
                  key={thread.id} 
                  to={`/messages/${thread.id}`}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${threadId === thread.id ? "bg-ocean text-white shadow-lg" : "hover:bg-foam"}`}
                >
                  <div className="relative shrink-0">
                    <img src={`https://i.pravatar.cc/100?u=${thread.id}`} className="w-14 h-14 rounded-2xl object-cover" alt={thread.name} />
                    {thread.online && <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-4 border-white rounded-full"></span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-extrabold truncate">{thread.name}</h4>
                      <span className={`text-[10px] font-bold ${threadId === thread.id ? "text-white/60" : "text-muted-foreground"}`}>{thread.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-sm truncate ${threadId === thread.id ? "text-white/60" : "text-muted-foreground"} ${thread.unread > 0 ? "font-bold text-ocean" : ""}`}>
                        {thread.lastMsg}
                      </p>
                      {thread.unread > 0 && <Badge className="bg-reef text-white h-5 min-w-5 p-0 flex items-center justify-center rounded-full">{thread.unread}</Badge>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

          {/* Chat Window */}
          <main className={`flex-1 flex flex-col bg-white ${!threadId ? "hidden lg:flex" : "flex"}`}>
            {/* Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/messages')} className="lg:hidden">
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <div className="relative">
                    <img src={`https://i.pravatar.cc/100?u=${currentThread.id}`} className="w-12 h-12 rounded-xl object-cover" alt={currentThread.name} />
                    {currentThread.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-white rounded-full"></span>}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-ocean leading-tight">{currentThread.name}</h3>
                    <p className="text-[10px] uppercase font-bold text-success tracking-widest">{currentThread.online ? 'Online' : 'Away'}</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <Button type="button" onClick={() => {}} variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-tropical"><Phone className="w-5 h-5" /></Button>
                  <Button type="button" onClick={() => {}} variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-tropical"><Video className="w-5 h-5" /></Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" onClick={() => {}} variant="ghost" size="icon" className="rounded-full text-muted-foreground"><MoreVertical className="w-5 h-5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-border w-48">
                      <DropdownMenuItem className="gap-2"><Info className="w-4 h-4" /> View Profile</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-reef"><Ban className="w-4 h-4" /> Block User</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-reef"><Flag className="w-4 h-4" /> Report User</DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive"><Trash2 className="w-4 h-4" /> Delete Chat</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-foam/30">
               {mockMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] space-y-1 ${msg.sender === 'me' ? "items-end" : "items-start"}`}>
                       <div className={`p-4 rounded-[1.5rem] shadow-sm text-sm font-medium ${msg.sender === 'me' ? "bg-ocean text-white rounded-tr-none" : "bg-white text-ocean rounded-tl-none border border-border"}`}>
                          {msg.text}
                       </div>
                       <div className="flex items-center gap-2 px-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{msg.time}</span>
                          {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-tropical" />}
                       </div>
                    </div>
                  </div>
               ))}
               <div className="text-center py-4">
                  <Badge variant="outline" className="bg-white border-border text-[10px] uppercase tracking-widest font-bold text-muted-foreground py-1 px-4">Today, Mar 17</Badge>
               </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-border">
               <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                  <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground" onClick={() => {}}><Paperclip className="w-5 h-5" /></Button>
                  <div className="flex-1 relative">
                     <Input 
                        placeholder="Type a message..." 
                        className="h-14 bg-foam border-none rounded-2xl pl-6 pr-12 text-lg focus-visible:ring-reef"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                     />
                     <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 rounded-full text-muted-foreground" onClick={() => {}}><Smile className="w-6 h-6" /></Button>
                  </div>
                  <Button type="submit" className="bg-reef hover:bg-reef/90 text-white w-14 h-14 rounded-2xl shadow-lg shadow-reef/20">
                    <Send className="w-6 h-6" />
                  </Button>
               </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Messages;
