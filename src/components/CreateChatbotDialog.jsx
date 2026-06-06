import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function CreateChatbotDialog({ open, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    const bot = await base44.entities.Chatbot.create({
      name: name.trim(),
      status: 'inactive',
      welcome_message: 'Hi! How can I help you today?',
      system_prompt: 'You are a helpful customer support assistant. Answer questions based only on the provided context. If you don\'t know the answer, say so politely.',
      primary_color: '#2563eb',
    });
    setLoading(false);
    setName('');
    onCreated(bot);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Chatbot</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-3">
          <div className="space-y-2">
            <Label htmlFor="bot-name">Chatbot Name</Label>
            <Input
              id="bot-name"
              placeholder="e.g. Support Bot, Sales Assistant..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim() || loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
