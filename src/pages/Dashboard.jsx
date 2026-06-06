import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Plus, Bot, MessageSquare, BookOpen, Settings,
  Zap, TrendingUp, Activity, ChevronRight
} from 'lucide-react';
import CreateChatbotDialog from '@/components/CreateChatbotDialog';

export default function Dashboard() {
  const [chatbots, setChatbots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadChatbots();
  }, []);

  const loadChatbots = async () => {
    setLoading(true);
    const data = await base44.entities.Chatbot.list('-created_date');
    setChatbots(data);
    setLoading(false);
  };

  const handleCreated = (chatbot) => {
    setShowCreate(false);
    navigate(`/chatbot/${chatbot.id}`);
  };

  const statusColor = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    inactive: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    training: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };

  const totalConversations = chatbots.reduce((s, c) => s + (c.total_conversations || 0), 0);
  const totalDocs = chatbots.reduce((s, c) => s + (c.total_documents || 0), 0);
  const activeBots = chatbots.filter(c => c.status === 'active').length;

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your AI-powered support chatbots</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Chatbot
        </Button>
      </div>

            {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Chatbots', value: chatbots.length, icon: Bot, color: 'text-primary' },
          { label: 'Active Bots', value: activeBots, icon: Activity, color: 'text-emerald-500' },
          { label: 'Conversations', value: totalConversations, icon: MessageSquare, color: 'text-violet-500' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="pt-6 pb-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold mt-1">{loading ? '—' : value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chatbots Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6 pb-5 h-40" />
            </Card>
          ))}
        </div>
      ) : chatbots.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No chatbots yet</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Create your first AI chatbot and connect it to your knowledge base.
            </p>
            <Button onClick={() => setShowCreate(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Create Chatbot
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {chatbots.map(bot => (
            <Card key={bot.id} className="hover:shadow-md transition-shadow group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg font-bold"
                      style={{ backgroundColor: bot.primary_color || '#2563eb' }}>
                      {bot.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-base">{bot.name}</CardTitle>
                      <Badge variant="outline" className={`text-xs mt-0.5 ${statusColor[bot.status]}`}>
                        {bot.status}
                      </Badge>
                    </div>
                  </div>
                  <Link to={`/chatbot/${bot.id}/settings`}>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    {bot.total_documents || 0} docs
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {bot.total_conversations || 0} chats
                  </span>
                </div>
                <Link to={`/chatbot/${bot.id}`}>
                  <Button variant="outline" size="sm" className="w-full gap-2 group-hover:border-primary group-hover:text-primary transition-colors">
                    Manage <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateChatbotDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
