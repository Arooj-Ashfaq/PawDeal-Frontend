import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { 
  Search, Send, Phone, Video, Info, 
  ChevronLeft, MoreVertical, Trash2, 
  Flag, Ban, Smile, Paperclip, CheckCheck,
  Loader2, AlertTriangle, X
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
  message_content: string;
  created_at: string;
  is_read: boolean;
}

interface Conversation {
  id: string;
  other_participant_id: string;
  other_participant_name: string;
  other_participant_image: string | null;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  related_pet_id?: string;
  related_product_id?: string;
}

const Messages: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { id: conversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { socket, isConnected, onNewMessage } = useSocket();
  
  const [messageText, setMessageText] = useState('');
  const [messagesList, setMessagesList] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem('pawdeal_token');

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/messages/conversations', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const conversationsList = data.data || data.conversations || [];
      setConversations(conversationsList);
    } catch (error: any) {
      console.error('Failed to fetch conversations:', error);
    }
  }, [token]);

  // Fetch messages for current conversation
  const fetchMessages = useCallback(async () => {
    if (!token || !conversationId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/messages/conversations/${conversationId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const messagesData = data.messages || [];
      setMessagesList(Array.isArray(messagesData) ? messagesData : []);
    } catch (error: any) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  }, [token, conversationId]);

  // Delete conversation
  const deleteConversation = async () => {
    if (!conversationId || !token) return;
    
    setDeleting(true);
    setShowDeleteModal(false);
    
    try {
      const response = await fetch(`http://localhost:5000/api/messages/conversations/${conversationId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success('Conversation deleted successfully');
        navigate('/messages');
        fetchConversations();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Failed to delete conversation');
    } finally {
      setDeleting(false);
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
  }, [user, authLoading, conversationId, token, fetchConversations, fetchMessages]);

  // Listen for new messages via socket
  useEffect(() => {
    if (socket && isConnected) {
      const handleNewMessage = (newMessage: any) => {
        if (newMessage.conversationId === conversationId) {
          const messageData = newMessage.message || newMessage;
          setMessagesList(prev => [...prev, messageData]);
        }
        fetchConversations();
        toast.info('New message received');
      };
      
      onNewMessage(handleNewMessage);
    }
  }, [socket, isConnected, onNewMessage, conversationId, fetchConversations]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesList]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const currentMessage = messageText.trim();
    if (!currentMessage) {
      toast.error('Please enter a message');
      return;
    }
    if (!conversationId || !token) return;

    const currentConv = conversations.find(c => c.id === conversationId);
    const receiverId = currentConv?.other_participant_id;
    
    if (!receiverId) {
      toast.error('Could not identify receiver');
      return;
    }

    setSending(true);
    
    try {
      const response = await fetch(`http://localhost:5000/api/messages/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          message_content: currentMessage
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      setMessageText('');
      await fetchMessages();
      
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
      
    } catch (error: any) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Authenticate socket when connected
  useEffect(() => {
    if (socket && isConnected && user) {
      socket.emit('authenticate', user.id);
    }
  }, [socket, isConnected, user]);

  // Join conversation room
  useEffect(() => {
    if (socket && isConnected && conversationId) {
      socket.emit('join_conversation', conversationId);
      return () => {
        socket.emit('leave_conversation', conversationId);
      };
    }
  }, [socket, isConnected, conversationId]);

  const currentConversation = conversations.find(c => c.id === conversationId);
  
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
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-ocean">Delete Conversation</h3>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-muted-foreground hover:text-ocean transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently removed.
            </p>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 h-11 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={deleteConversation}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white h-11 rounded-xl"
              >
                {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete Conversation'}
              </Button>
            </div>
          </div>
        </div>
      )}

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
                    <div className="relative shrink-0 w-14 h-14 rounded-2xl bg-ocean flex items-center justify-center">
                      <span className="text-white text-xl font-bold">
                        {conv.other_participant_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-extrabold truncate">{conv.other_participant_name || 'User'}</h4>
                        <span className={`text-[10px] font-bold ${conversationId === conv.id ? "text-white/60" : "text-muted-foreground"}`}>
                          {conv.last_message_time ? formatTime(conv.last_message_time) : ''}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-sm truncate ${conversationId === conv.id ? "text-white/60" : "text-muted-foreground"} ${conv.unread_count > 0 ? "font-bold text-ocean" : ""}`}>
                          {conv.last_message || 'No messages yet'}
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
                    <div className="relative w-12 h-12 rounded-xl bg-ocean flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {currentConversation.other_participant_name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-ocean leading-tight">{currentConversation.other_participant_name || 'User'}</h3>
                      <p className="text-[10px] uppercase font-bold text-success tracking-widest">
                        {isConnected ? 'Connected' : 'Offline'}
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
                        <DropdownMenuItem 
                          className="gap-2 text-destructive" 
                          onClick={() => setShowDeleteModal(true)}
                        >
                          <Trash2 className="w-4 h-4" /> Delete Chat
                        </DropdownMenuItem>
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
                    messagesList.map((msg) => {
                      const messageContent = msg.message_content || '';
                      const isOwnMessage = msg.sender_id === user.id;
                      return (
                        <div key={msg.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] space-y-1 ${isOwnMessage ? "items-end" : "items-start"}`}>
                            <div className={`p-4 rounded-[1.5rem] shadow-sm text-sm font-medium ${isOwnMessage ? "bg-ocean text-white rounded-tr-none" : "bg-white text-ocean rounded-tl-none border border-border"}`}>
                              {messageContent}
                            </div>
                            <div className="flex items-center gap-2 px-1">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                {formatTime(msg.created_at)}
                              </span>
                              {isOwnMessage && (
                                <CheckCheck className={`w-3 h-3 ${msg.is_read ? "text-tropical" : "text-muted-foreground"}`} />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
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
                        id="message-input"
                        name="message"
                        placeholder={isConnected ? "Type a message..." : "Connecting..."}
                        className="h-14 bg-foam border-none rounded-2xl pl-6 pr-12 text-lg focus-visible:ring-reef"        
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        disabled={!isConnected}
                        autoComplete="off"
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