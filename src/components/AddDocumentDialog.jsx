import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Globe, Type } from 'lucide-react';

export default function AddDocumentDialog({ open, onClose, chatbotId, onAdded }) {
  const [tab, setTab] = useState('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const doc = await base44.entities.Document.create({
      chatbot_id: chatbotId,
      title: title.trim() || (tab === 'url' ? url : 'Untitled'),
      content: tab === 'text' ? content : '',
      source_type: tab,
      source_url: tab === 'url' ? url : undefined,
      status: 'indexed',
    });
    setLoading(false);
    setTitle(''); setContent(''); setUrl('');
    onAdded(doc);
  };

  const isValid = tab === 'text' ? (title.trim() && content.trim()) : url.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Add Document</DialogTitle></DialogHeader>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="text" className="flex-1 gap-2"><Type className="w-3.5 h-3.5" /> Text</TabsTrigger>
            <TabsTrigger value="url" className="flex-1 gap-2"><Globe className="w-3.5 h-3.5" /> URL</TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Document title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea placeholder="Paste your content here..." value={content} onChange={e => setContent(e.target.value)} className="min-h-32" />
            </div>
          </TabsContent>
          <TabsContent value="url" className="space-y-3 mt-4">
            <div className="space-y-2">
              <Label>Title (optional)</Label>
              <Input placeholder="Page title" value={title} onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input placeholder="https://..." value={url} onChange={e => setUrl(e.target.value)} />
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd} disabled={!isValid || loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
