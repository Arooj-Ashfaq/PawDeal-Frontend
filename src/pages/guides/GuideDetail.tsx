import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/common/PageCollection';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, Clock, User, MessageCircle, 
  Share2, Heart, Search, CheckCircle, 
  ChevronRight, Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const GuideDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getArticle, addComment, articles } = useMarketplace();
  const { user } = useAuth();
  const navigate = useNavigate();
  const article = getArticle(slug || '');
  const [commentText, setCommentText] = useState('');

  if (!article) {
    return <div className="container py-20 text-center">Guide not found</div>;
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to join the discussion');
      navigate('/login?redirect=' + window.location.pathname);
      return;
    }
    if (!commentText.trim()) return;

    const newComment = {
      user: user.name,
      avatar: `https://i.pravatar.cc/100?u=${user.id}`,
      date: new Date().toISOString().split('T')[0],
      content: commentText,
      likes: 0
    };

    addComment(article.slug, newComment);
    setCommentText('');
    toast.success('Comment posted successfully');
  };

  return (
    <div className="pb-20">
      <PageHeader 
        title={article.title} 
        description={`Expert insights on pet care. Category: ${article.category}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
          { name: article.title }
        ]}
      />
      
      <div className="container px-4">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Article Content */}
          <article className="lg:col-span-2 space-y-12">
            <div className="aspect-video rounded-3xl overflow-hidden bg-muted relative shadow-2xl">
              <img 
                src={`https://images.unsplash.com/photo-${article.slug}?auto=format&fit=crop&w=1600&q=80`} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-6 border-y border-border py-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=author`} alt={article.author} />
                </div>
                <div>
                  <p className="font-extrabold text-ocean">{article.author}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{article.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 font-bold"><Clock className="w-4 h-4" /> 10 MIN READ</div>
                <div className="flex items-center gap-2 font-bold"><MessageCircle className="w-4 h-4" /> {article.comments.length} COMMENTS</div>
                <Button type="button" onClick={() => {}} variant="ghost" size="icon" className="rounded-full hover:bg-foam hover:text-reef transition-colors">
                   <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-6">
              <p className="text-xl font-medium text-ocean">{article.content}</p>
              <p>
                Whether you're a first-time owner or an experienced enthusiast, providing the best care for your pet requires dedication, knowledge, and love. This guide breaks down the essential steps to ensure your pet stays happy and healthy throughout their life.
              </p>
              <h2 className="text-3xl font-extrabold text-ocean pt-8 border-t border-border mt-12">Key Considerations</h2>
              <div className="grid md:grid-cols-2 gap-8 my-12">
                {[
                  "Regular health check-ups at least once a year",
                  "Appropriate exercise routine for your breed",
                  "Grooming needs vary widely",
                  "Nutrition is the foundation of health",
                  "Mental stimulation is as important as physical",
                  "Environment must be safe and engaging"
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-6 bg-foam rounded-2xl border border-border">
                    <CheckCircle className="w-6 h-6 text-success shrink-0 mt-1" />
                    <span className="font-bold text-ocean leading-tight">{item}</span>
                  </div>
                ))}
              </div>
              <p>
                Always remember that every pet is an individual. What works for one may not work for another. Pay attention to your pet's body language and behavior, and don't hesitate to consult with experts when needed.
              </p>
            </div>

            {/* Comments Section */}
            <section className="pt-20 space-y-12">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-extrabold text-ocean">Discussion <span className="text-reef">({article.comments.length})</span></h2>
              </div>

              {user ? (
                <div className="bg-foam p-8 rounded-3xl border border-border space-y-6">
                   <div className="flex items-center gap-4 mb-4">
                     <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                       <img src={user.avatar || `https://i.pravatar.cc/100?u=${user.id}`} alt={user.name} />
                     </div>
                     <p className="font-extrabold text-ocean">Posting as {user.name}</p>
                   </div>
                   <form onSubmit={handlePostComment} className="space-y-4">
                     <Textarea 
                       placeholder="Join the discussion... what's on your mind?" 
                       className="min-h-[120px] bg-white border-border text-lg p-6 rounded-2xl focus-visible:ring-reef"
                       value={commentText}
                       onChange={(e) => setCommentText(e.target.value)}
                     />
                     <Button type="submit" className="bg-reef hover:bg-reef/90 text-white px-8 h-12 font-extrabold rounded-xl shadow-lg">Post Comment</Button>
                   </form>
                </div>
              ) : (
                <div className="bg-foam p-12 rounded-3xl text-center space-y-6 border border-border border-dashed">
                   <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto opacity-30" />
                   <h3 className="text-2xl font-bold text-ocean">Join the conversation</h3>
                   <p className="text-muted-foreground max-w-sm mx-auto">Login to share your thoughts, ask questions, and connect with other pet owners.</p>
                   <Button asChild className="bg-reef hover:bg-reef/90 text-white font-extrabold h-12 px-8 rounded-xl shadow-lg">
                      <Link to="/login">Login to Comment</Link>
                   </Button>
                </div>
              )}

              <div className="space-y-8 mt-12">
                {article.comments.map((comment, i) => (
                  <Card key={i} className="border-border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                            <img src={comment.avatar} alt={comment.user} />
                          </div>
                          <div>
                            <p className="font-extrabold text-ocean">{comment.user}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {comment.date}
                            </p>
                          </div>
                        </div>
                        <Button type="button" onClick={() => {}} variant="ghost" className="text-muted-foreground hover:text-reef flex gap-2 font-bold uppercase tracking-widest text-[10px]">
                          <Heart className="w-4 h-4" /> {comment.likes} LIKES
                        </Button>
                      </div>
                      <p className="text-muted-foreground text-lg leading-relaxed">{comment.content}</p>
                      <div className="pt-6 border-t border-border flex gap-4">
                        <Button type="button" onClick={() => {}} variant="ghost" className="text-tropical font-extrabold uppercase tracking-widest text-xs h-8 px-0 hover:bg-transparent hover:text-ocean transition-colors">Reply</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </article>

          {/* Sidebar */}
          <aside className="space-y-12">
             <Card className="border-border shadow-xl rounded-3xl overflow-hidden sticky top-24">
                <CardHeader className="bg-ocean text-white p-8">
                  <CardTitle className="text-xl font-extrabold">Related Articles</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                   {articles.filter(a => a.slug !== article.slug).slice(0, 5).map((a, i) => (
                      <Link key={i} to={`/guides/${a.slug}`} className="flex gap-4 group">
                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                          <img 
                            src={`https://images.unsplash.com/photo-${a.slug}?auto=format&fit=crop&w=200&q=80`} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                            alt={a.title}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-ocean group-hover:text-reef transition-colors line-clamp-2 text-sm leading-tight">{a.title}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 8 MIN READ
                          </p>
                        </div>
                      </Link>
                   ))}
                   <Button asChild variant="outline" className="w-full border-tropical text-tropical font-extrabold h-12 rounded-xl mt-4">
                     <Link to="/guides">Browse All Guides</Link>
                   </Button>
                </CardContent>
             </Card>

             <Card className="bg-reef text-white p-8 rounded-3xl border-none space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <h3 className="text-2xl font-extrabold leading-tight">Expert Care at Your Fingertips</h3>
                <p className="text-white/80 text-sm">Download our free pet care checklist for your new companion.</p>
                <Button className="w-full bg-white text-reef hover:bg-white/90 font-extrabold h-12 rounded-xl" type="button" onClick={() => {}}>Download PDF</Button>
             </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
