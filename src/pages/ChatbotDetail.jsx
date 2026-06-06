import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, MessageSquare, Settings, Play, Code2, Bot, Loader2 } from 'lucide-react';
import EmbedCodeDialog from '@/components/EmbedCodeDialog';

export default function ChatbotDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    loadChatbot();
  }, [id]);

  const loadChatbot = async () => {
    const data = await base44.entities.Chatbot.filter({ id });
    setChatbot(data[0] || null);
    setLoading(false);
  };

  const toggleStatus = async () => {
    const newStatus = chatbot.status === 'active' ? 'inactive' : 'active';
    const updated = await base44.entities.Chatbot.update(id, { status: newStatus });
    setChatbot(updated);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!chatbot) return (
    <div className="flex items-center justify-center min-h-screen text-muted-foreground">
      Chatbot not found.
    </div>
  );

  const statusColor = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    inactive: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    training: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };

  const quickLinks = [
    { icon: BookOpen, label: 'Knowledge Base', desc: 'Manage documents & content', href: `/chatbot/${id}/knowledge`, color: 'text-violet-500' },
    { icon: MessageSquare, label: 'Conversations', desc: 'View chat history', href: `/chatbot/${id}/conversations`, color: 'text-blue-500' },
    { icon: Settings, label: 'Settings', desc: 'Configure appearance & behavior', href: `/chatbot/${id}/settings`, color: 'text-slate-500' },
    { icon: Play, label: 'Live Preview', desc: 'Test your chatbot', href: `/chatbot/${id}/preview`, color: 'text-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
            style={{ backgroundColor: chatbot.primary_color || '#2563eb' }}>
            {chatbot.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold">{chatbot.name}</h1>
            <Badge variant="outline" className={`text-xs mt-1 ${statusColor[chatbot.status]}`}>
              {chatbot.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEmbed(true)} className="gap-2">
            <Code2 className="w-4 h-4" /> Embed
          </Button>
          <Button
            variant={chatbot.status === 'active' ? 'destructive' : 'default'}
            onClick={toggleStatus}
            className="gap-2"
          >
            {chatbot.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">Documents</p>
            <p className="text-3xl font-bold mt-1">{chatbot.total_documents || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <p className="text-sm text-muted-foreground">Conversations</p>
            <p className="text-3xl font-bold mt-1">{chatbot.total_conversations || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map(({ icon: Icon, label, desc, href, color }) => (
          <Link key={href} to={href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer hover:border-primary/30">
              <CardContent className="pt-5 pb-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="font-medium">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <EmbedCodeDialog open={showEmbed} onClose={() => setShowEmbed(false)} chatbotId={id} />
    </div>
  );
}
