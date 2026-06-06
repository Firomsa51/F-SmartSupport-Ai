import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Bot, User, Loader2, RefreshCw } from 'lucide-react';

export default function ChatPreview() {
  const { id } = useParams();
  const [chatbot, setChatbot] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [botLoading, setBotLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadChatbot();
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadChatbot = async () => {
    const data = await base44.entities.Chatbot.filter({ id });
    const bot = data[0];
    setChatbot(bot);
    setBotLoading(false);
    if (bot?.welcome_message) {
      setMessages([{ role: 'assistant', content: bot.welcome_message }]);
    }
  };

  const loadDocuments = async () => {
    return await base44.entities.Document.filter({ chatbot_id: id, status: 'indexed' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const docs = await loadDocuments();
    const context = docs.map(d => `--- ${d.title} ---\n${d.content}`).join('\n\n');

    const prompt = `${chatbot?.system_prompt || 'You are a helpful assistant.'}

${context ? `Knowledge Base:\n${context}\n\n` : ''}User question: ${userMessage}`;

    const response = await base44.integrations.Core.InvokeLLM({ prompt });
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  const handleReset = () => {
    setMessages(chatbot?.welcome_message ? [{ role: 'assistant', content: chatbot.welcome_message }] : []);
  };

  if (botLoading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  const primaryColor = chatbot?.primary_color || '#2563eb';

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <Link to={`/chatbot/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RefreshCw className="w-3.5 h-3.5" /> Reset
        </Button>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Chat Widget */}
        <div className="rounded-2xl border border-border shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3" style={{ backgroundColor: primaryColor }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-white">{chatbot?.name || 'Chatbot'}</span>
            <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-3 bg-background">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: primaryColor + '20' }}>
                    <Bot className="w-4 h-4" style={{ color: primaryColor }} />
                  </div>
                )}
                <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`} style={msg.role === 'user' ? { backgroundColor: primaryColor } : {}}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: primaryColor + '20' }}>
                  <Bot className="w-4 h-4" style={{ color: primaryColor }} />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref__={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card flex gap-2">
            <Input
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              disabled={loading}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} disabled={!input.trim() || loading}
              style={{ backgroundColor: primaryColor }} className="text-white hover:opacity-90 flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">
          Live preview — responses use your knowledge base
        </p>
      </div>
    </div>
  );
}
