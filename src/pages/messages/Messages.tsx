import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { messages } from '@/services/api';
import { 
  Search, Send, Phone, Video, Info, 
  ChevronLeft, MoreVertical, Trash2, 
  Flag, Ban, Smile, Paperclip, CheckCheck,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
  };
}

interface Conversation {
  id: string;
  other_user: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image_url: string;
    online?: boolean;
  };
  last_message: {
    content: string;
    created_at: string;
    is_read: boolean;
  };
  unread_count: number;
}

const Messages: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { id: conversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { socket, isConnected, sendMessage: sendSocketMessage, onNewMessage } = useSocket();
  
  const [messageText, setMessageText] = useState('');
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('pawdeal_token');

  // Fetch conversations
  const fetchConversations = async () => {
  if (!token) return;
  try {
    const data: any = await messages.getConversations(token);
    const conversationsList = data.conversations || data.data || [];
    setConversations(conversationsList);
  } catch (error: any) {
    console.error('Failed to fetch conversations:', error);
    toast.error(error.message || 'Failed to load conversations');
  }
};

  // Fetch messages for current conversation
  const fetchMessages = async () => {
  if (!token || !conversationId) return;
  try {
    const data: any = await messages.getConversation(token, conversationId);
    const messagesData = data.messages?.data || data.data || data.messages || [];
    setMessagesList(Array.isArray(messagesData) ? messagesData : []);
  } catch (error: any) {
    console.error('Failed to fetch messages:', error);
    toast.error(error.message || 'Failed to load messages');
  } finally {
    setLoading(false);
  }
};

  // Load initial data
  useEffect(() => {
    if (!authLoading && user && token) {
      fetchConversations();
      if (conversationId) {
        fetchMessages();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading, conversationId, token]);

  // Listen for new messages via socket
  useEffect(() => {
    if (socket && isConnected) {
      onNewMessage((newMessage: any) => {
        console.log('New message received:', newMessage);
        
        // Add to messages list if it's for current conversation
        if (newMessage.conversationId === conversationId) {
          const messageData = newMessage.message || newMessage;
          setMessagesList(prev => [...prev, messageData]);
          
          // Mark as read
          if (token && conversationId) {
            messages.markAsRead(token, conversationId);
          }
        }
        
        // Update conversation list
        fetchConversations();
        
        toast.info('New message received');
      });
    }
  }, [socket, isConnected, onNewMessage, conversationId, token]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesList]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    if (!conversationId) {
      toast.error('Please select a conversation');
      return;
    }
    if (!isConnected) {
      toast.error('Not connected to chat server');
      return;
    }
    if (!token) return;

    setSending(true);
    
    try {
      // Send via API
      await messages.sendMessage(token, conversationId, messageText);
      
      // Send via socket for real-time
      sendSocketMessage(conversationId, messageText);
      
      setMessageText('');
      
      // Refresh messages
      await fetchMessages();
      
    } catch (error: any) {
      console.error('Failed to send message:', error);
      toast.error(error.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const currentConversation = conversations.find(c => c.id === conversationId);
  
  // Format time
  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-foam h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-reef" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-foam h-[calc(100vh-64px)] overflow-hidden">
      <div className="container h-full p-4 lg:p-8">
        <div className="bg-white rounded-[2rem] shadow-2xl h-full flex overflow-hidden border border-border">

          {/* Thread List - Sidebar */}
          <aside className={`w-full lg:w-[400px] flex flex-col border-r border-border ${conversationId ? "hidden lg:flex" : "flex"}`}>
            <div className="p-8 border-b border-border space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-ocean">Messages</h2>
                <Badge className="bg-reef text-white px-2 py-0.5 font-extrabold h-5 min-w-5 flex items-center justify-center rounded-full">
                  {conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0)}
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-10 h-12 bg-foam border-none rounded-xl" />      
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {conversations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No conversations yet</p>
                  <p className="text-xs text-muted-foreground mt-2">Start by messaging a seller or buyer</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    to={`/messages/${conv.id}`}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${conversationId === conv.id ? "bg-ocean text-white shadow-lg" : "hover:bg-foam"}`}
                  >
                    <div className="relative shrink-0">
                      <img 
                        src={conv.other_user?.profile_image_url || `https://i.pravatar.cc/100?u=${conv.other_user?.id}`} 
                        className="w-14 h-14 rounded-2xl object-cover" 
                        alt={`${conv.other_user?.first_name || ''} ${conv.other_user?.last_name || ''}`} 
                      />
                      {conv.other_user?.online && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-success border-4 border-white rounded-full"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-extrabold truncate">
                          {conv.other_user?.first_name || 'User'} {conv.other_user?.last_name || ''}
                        </h4>
                        <span className={`text-[10px] font-bold ${conversationId === conv.id ? "text-white/60" : "text-muted-foreground"}`}>
                          {conv.last_message?.created_at ? formatTime(conv.last_message.created_at) : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${conversationId === conv.id ? "text-white/60" : "text-muted-foreground"} ${conv.unread_count > 0 ? "font-bold text-ocean" : ""}`}>
                          {conv.last_message?.content || 'No messages yet'}
                        </p>
                        {conv.unread_count > 0 && (
                          <Badge className="bg-reef text-white h-5 min-w-5 p-0 flex items-center justify-center rounded-full">
                            {conv.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </aside>

          {/* Chat Window */}
          <main className={`flex-1 flex flex-col bg-white ${!conversationId ? "hidden lg:flex" : "flex"}`}>
            {!currentConversation ? (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <h3 className="text-xl font-bold text-ocean mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">Choose a conversation from the list to start chatting</p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/messages')} className="lg:hidden">
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <div className="relative">
                      <img 
                        src={currentConversation.other_user?.profile_image_url || `https://i.pravatar.cc/100?u=${currentConversation.other_user?.id}`} 
                        className="w-12 h-12 rounded-xl object-cover" 
                        alt={`${currentConversation.other_user?.first_name || ''} ${currentConversation.other_user?.last_name || ''}`} 
                      />
                      {currentConversation.other_user?.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-ocean leading-tight">
                        {currentConversation.other_user?.first_name || 'User'} {currentConversation.other_user?.last_name || ''}
                      </h3>
                      <p className="text-[10px] uppercase font-bold text-success tracking-widest">
                        {currentConversation.other_user?.online ? 'Online' : 'Offline'}
                        {isConnected && ' • Connected'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-tropical">
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-tropical">
                      <Video className="w-5 h-5" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                          <MoreVertical className="w-5 h-5" />
                        </Button>
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
                  {messagesList.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No messages yet. Say hello!</p>
                    </div>
                  ) : (
                    messagesList.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] space-y-1 ${msg.sender_id === user.id ? "items-end" : "items-start"}`}>
                          <div className={`p-4 rounded-[1.5rem] shadow-sm text-sm font-medium ${msg.sender_id === user.id ? "bg-ocean text-white rounded-tr-none" : "bg-white text-ocean rounded-tl-none border border-border"}`}>
                            {msg.content}
                          </div>
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                              {formatTime(msg.created_at)}
                            </span>
                            {msg.sender_id === user.id && (
                              <CheckCheck className={`w-3 h-3 ${msg.is_read ? "text-tropical" : "text-muted-foreground"}`} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input Area */}
                <div className="p-6 bg-white border-t border-border">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                    <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        placeholder={isConnected ? "Type a message..." : "Connecting..."}
                        className="h-14 bg-foam border-none rounded-2xl pl-6 pr-12 text-lg focus-visible:ring-reef"        
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        disabled={!isConnected}
                      />
                      <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 rounded-full text-muted-foreground">
                        <Smile className="w-6 h-6" />
                      </Button>
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-reef hover:bg-reef/90 text-white w-14 h-14 rounded-2xl shadow-lg shadow-reef/20"
                      disabled={!isConnected || sending || !messageText.trim()}
                    >
                      {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                    </Button>
                  </form>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Messages;