import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MessageSquare, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import ConversationMessages from '@/components/ConversationMessages';

export default function Conversations() {
  const { id } = useParams();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => { loadConversations(); }, [id]);

  const loadConversations = async () => {
    const data = await base44.entities.Conversation.filter({ chatbot_id: id }, '-created_date');
    setConversations(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <Link to={`/chatbot/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-heading font-bold mb-6">Conversations</h1>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : conversations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageSquare className="w-10 h-10 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No conversations yet</h3>
            <p className="text-sm text-muted-foreground">Conversations will appear here once users start chatting.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            {conversations.map(conv => (
              <Card
                key={conv.id}
                className={`cursor-pointer transition-colors hover:border-primary/40 ${selected?.id === conv.id ? 'border-primary' : ''}`}
                onClick={() => setSelected(conv)}
              >
                <CardContent className="py-3 px-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{format(new Date(conv.created_date), 'MMM d, HH:mm')}</span>
                    <span className="text-xs text-muted-foreground">{conv.message_count || 0} msgs</span>
                  </div>
                  <p className="text-sm truncate">{conv.last_message || 'No messages'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="lg:col-span-2">
            {selected ? (
              <ConversationMessages conversation={selected} />
            ) : (
              <Card className="h-full flex items-center justify-center min-h-48">
                <CardContent className="text-center text-muted-foreground">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Select a conversation to view messages</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
