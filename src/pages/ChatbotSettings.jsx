import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DeleteChatbotDialog from '@/components/DeleteChatbotDialog';

export default function ChatbotSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chatbot, setChatbot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    loadChatbot();
  }, [id]);

  const loadChatbot = async () => {
    const data = await base44.entities.Chatbot.filter({ id });
    const bot = data[0];
    setChatbot(bot);
    setForm({
      name: bot?.name || '',
      welcome_message: bot?.welcome_message || '',
      system_prompt: bot?.system_prompt || '',
      primary_color: bot?.primary_color || '#2563eb',
    });
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.entities.Chatbot.update(id, form);
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 max-w-2xl">
      <Link to={`/chatbot/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>
      <h1 className="text-2xl font-heading font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">General</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Chatbot Name</Label>
              <Input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <Input value={form.welcome_message} onChange={e => setForm({...form, welcome_message: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Brand Color</Label>
              <div className="flex items-center gap-3">
                <input type="color" value={form.primary_color} onChange={e => setForm({...form, primary_color: e.target.value})}
                  className="w-10 h-10 rounded cursor-pointer border border-border" />
                <Input value={form.primary_color} onChange={e => setForm({...form, primary_color: e.target.value})} className="font-mono" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">AI Behavior</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>System Prompt</Label>
              <Textarea
                value={form.system_prompt}
                onChange={e => setForm({...form, system_prompt: e.target.value})}
                className="min-h-32 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Instructions for how the AI should behave and respond.</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)} className="gap-2">
            <Trash2 className="w-4 h-4" /> Delete Chatbot
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </Button>
        </div>
      </div>

      <DeleteChatbotDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        chatbotId={id}
        chatbotName={chatbot?.name}
        onDeleted={() => navigate('/')}
      />
    </div>
  );
}
