import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

export default function EmbedCodeDialog({ open, onClose, chatbotId }) {
  const [copied, setCopied] = useState(false);

  const embedCode = `<script>
  window.SmartSupportConfig = { chatbotId: "${chatbotId}" };
</script>
<script src="https://cdn.smartsupport.ai/widget.js" async></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Embed Chatbot</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Add this snippet to your website's <code className="bg-muted px-1 rounded">&lt;body&gt;</code> tag:
        </p>
        <div className="relative">
          <pre className="bg-muted rounded-lg p-4 text-xs overflow-x-auto text-foreground">
            {embedCode}
          </pre>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 h-7 w-7"
            onClick={handleCopy}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
