import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, FileText, Globe, Type, Trash2, Loader2 } from 'lucide-react';
import AddDocumentDialog from '@/components/AddDocumentDialog';

export default function KnowledgeBase() {
  const { id } = useParams();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => { loadDocs(); }, [id]);

  const loadDocs = async () => {
    const data = await base44.entities.Document.filter({ chatbot_id: id }, '-created_date');
    setDocs(data);
    setLoading(false);
  };

  const handleDelete = async (docId) => {
    await base44.entities.Document.delete(docId);
    setDocs(docs.filter(d => d.id !== docId));
  };

  const sourceIcon = { text: Type, url: Globe, file: FileText };
  const statusColor = {
    indexed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    processing: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    failed: 'bg-red-500/10 text-red-600 border-red-500/20',
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <Link to={`/chatbot/${id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">{docs.length} document{docs.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Document
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : docs.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No documents yet</h3>
            <p className="text-sm text-muted-foreground mb-4">Add documents to train your chatbot.</p>
            <Button onClick={() => setShowAdd(true)} className="gap-2"><Plus className="w-4 h-4" /> Add Document</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {docs.map(doc => {
            const Icon = sourceIcon[doc.source_type] || FileText;
            return (
              <Card key={doc.id}>
                <CardContent className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className={`text-xs ${statusColor[doc.status]}`}>{doc.status}</Badge>
                        {doc.source_url && <span className="text-xs text-muted-foreground truncate">{doc.source_url}</span>}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="flex-shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddDocumentDialog
        open={showAdd}
        onClose={() => setShowAdd(false)}
        chatbotId={id}
        onAdded={(doc) => { setDocs([doc, ...docs]); setShowAdd(false); }}
      />
    </div>
  );
}
