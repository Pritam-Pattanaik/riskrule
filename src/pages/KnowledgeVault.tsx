import React, { useEffect, useState } from 'react';
import { useNoteStore } from '../stores/noteStore';
import { Plus, Search, Tag, Loader2, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function KnowledgeVault({ embedded = false }: { embedded?: boolean }) {
  const { notes, loading, loadError, fetchNotes, addNote, deleteNote } = useNoteStore();
  const Title = embedded ? "h2" : "h1";
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Personal Notes');
  const [newTags, setNewTags] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveError(false);
    try { await addNote({
      title: newTitle,
      content: newContent,
      category: newCategory,
      tags: newTags.split(',').map(t => t.trim()).filter(Boolean)
    });
    } catch { setSaveError(true); return; } finally { setSaving(false); }
    setShowForm(false);
    setNewTitle('');
    setNewContent('');
    setNewTags('');
  };

  const filteredNotes = notes.filter(n => 
    [n.title, n.content, n.category, ...(n.tags ?? [])].some(value => value?.toLowerCase().includes(search.trim().toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 w-full pb-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title className="text-2xl font-semibold">Knowledge vault</Title>
          <p className="text-secondary mt-1">Keep the rules, setups and research you want to revisit before a trade.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      <div className="desk-panel flex items-center gap-3">
        <Search className="shrink-0 w-5 h-5 text-tertiary" />
        <input 
          type="text" 
          placeholder="Search your knowledge vault..." 
          aria-label="Search notes by title, text, category or tag" className="min-w-0 flex-1 bg-transparent text-sm"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="bg-surface border border-border p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSave} className="space-y-4">
            <input required type="text" aria-label="Note title" placeholder="Title" className="input-base" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <select aria-label="Note category" className="input-base" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
              <option>Personal Notes</option>
              <option>Strategy Playbook</option>
              <option>Market Research</option>
              <option>Trading Rules</option>
            </select>
            <textarea required rows={5} aria-label="Note content" placeholder="Content" className="input-base resize-none" value={newContent} onChange={e => setNewContent(e.target.value)}></textarea>
            <input type="text" aria-label="Note tags" placeholder="Tags (comma separated)" className="input-base" value={newTags} onChange={e => setNewTags(e.target.value)} />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              {saveError && <p role="alert">Could not save the note. Try again.</p>}
              <Button type="submit" disabled={saving}>Save Note</Button>
            </div>
          </form>
        </div>
      )}

      {loadError ? <button className="desk-button" onClick={fetchNotes}>Could not load notes. Retry</button> : loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-tertiary" /></div>
      ) : (
        <div className="grid gap-3">
          {filteredNotes.map(note => (
            <div key={note.id} className="desk-panel min-w-0 break-words">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-primary text-lg">{note.title}</h3>
                <button aria-label={`Delete ${note.title}`} onClick={() => deleteNote(note.id)} className="text-tertiary hover:text-danger opacity-80 hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs font-medium text-accent bg-accent/5 px-2 py-1 rounded inline-block w-fit mb-3">
                {note.category}
              </span>
              <p className="max-w-prose text-sm leading-relaxed text-secondary whitespace-pre-wrap">{note.content}</p>
              {note.tags && note.tags.length > 0 && (
                <div className="flex gap-2 mt-4 flex-wrap">
                  {note.tags.map((t: string) => (
                    <span key={t} className="flex items-center gap-1 text-[10px] uppercase font-bold text-tertiary">
                      <Tag className="w-3 h-3" /> {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {!loading && filteredNotes.length === 0 && (
            <div className="desk-panel col-span-full text-sm text-secondary">{search ? 'No notes match your search.' : 'Save your first setup, trading rule or session takeaway.'}</div>
          )}
        </div>
      )}
    </div>
  );
}
