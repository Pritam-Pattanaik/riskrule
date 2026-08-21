import React, { useState, useRef, useEffect } from 'react';
import {
  Plus, MessageSquare, Pin, Archive, Trash2, Edit2, Search,
  Check, X, Copy, Download, MoreHorizontal, Brain, Eraser, Menu
} from 'lucide-react';
import { useInsightStore } from '../../stores/insightStore';
import { AiConversation } from '../../types';
import { cn } from '../../lib/cn';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

// ─── Confirmation Dialog ──────────────────────────────────────────────────────
function ClearAllDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface-0 border border-border rounded-2xl shadow-2xl p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-loss/10 flex items-center justify-center shrink-0">
            <Eraser className="w-4 h-4 text-loss" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-primary">Clear all conversations?</h3>
            <p className="text-[11px] text-tertiary mt-0.5">This cannot be undone.</p>
          </div>
        </div>
        <p className="text-xs text-secondary mb-5 leading-relaxed">
          All coaching sessions will be permanently deleted. Your trades, journal, and rules are unaffected.
        </p>
        <div className="flex gap-2">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-xl border border-border text-xs font-semibold text-secondary hover:bg-surface-1 transition-colors">
            Keep sessions
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-xl bg-loss text-white text-xs font-bold hover:bg-red-600 transition-colors">
            Clear all
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Conversation Context Menu ────────────────────────────────────────────────
function ConvMenu({ conv, onRename, onPin, onArchive, onDuplicate, onExport, onDelete, onClose }: {
  conv: AiConversation; onRename: () => void; onPin: () => void; onArchive: () => void;
  onDuplicate: () => void; onExport: () => void; onDelete: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    setTimeout(() => document.addEventListener('click', h), 0);
    return () => document.removeEventListener('click', h);
  }, [onClose]);

  const Item = ({ icon, label, onClick, danger = false }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) => (
    <button
      onClick={e => { e.stopPropagation(); onClick(); onClose(); }}
      className={cn("w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-xs rounded-lg transition-colors", danger ? "text-loss hover:bg-loss/10" : "text-secondary hover:text-primary hover:bg-surface-2")}
    >
      <span className="shrink-0 opacity-70">{icon}</span>{label}
    </button>
  );

  return (
    <div ref={ref} className="absolute right-0 top-7 w-44 bg-surface-0 border border-border rounded-xl shadow-2xl z-50 p-1 animate-in fade-in slide-in-from-top-1 duration-100" onClick={e => e.stopPropagation()}>
      <Item icon={<Edit2 className="w-3.5 h-3.5" />} label="Rename" onClick={onRename} />
      <Item icon={<Pin className="w-3.5 h-3.5" />} label={conv.isPinned ? 'Unpin' : 'Pin to top'} onClick={onPin} />
      <Item icon={<Copy className="w-3.5 h-3.5" />} label="Duplicate" onClick={onDuplicate} />
      <Item icon={<Download className="w-3.5 h-3.5" />} label="Export" onClick={onExport} />
      <Item icon={<Archive className="w-3.5 h-3.5" />} label={conv.isArchived ? 'Unarchive' : 'Archive'} onClick={onArchive} />
      <div className="my-1 border-t border-border" />
      <Item icon={<Trash2 className="w-3.5 h-3.5" />} label="Delete" onClick={onDelete} danger />
    </div>
  );
}

// ─── Conversation Row ─────────────────────────────────────────────────────────
function ConvRow({ conv, isActive, onSelect, onPin, onArchive, onDuplicate, onExport, onDelete }: {
  conv: AiConversation; isActive: boolean; onSelect: () => void; onPin: () => void;
  onArchive: () => void; onDuplicate: () => void; onExport: () => void; onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conv.title);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { renameConversation } = useInsightStore();

  const saveEdit = async () => {
    if (editTitle.trim() && editTitle.trim() !== conv.title) await renameConversation(conv.id, editTitle.trim());
    setEditing(false);
  };

  const displayTitle = conv.title
    .replace(/^\[MODE:[\w]+\]\s*/i, '')
    .replace(/^\[[\w]+\]\s*/, '')
    .trim() || 'New Chat';

  return (
    <div
      onClick={() => !editing && onSelect()}
      className={cn(
        "group relative flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all select-none",
        isActive ? "bg-accent/10 border border-accent/20 text-primary" : "border border-transparent text-secondary hover:bg-surface-1 hover:text-primary"
      )}
    >
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-accent rounded-r-full" />}

      <MessageSquare className={cn("w-3.5 h-3.5 shrink-0", isActive ? "text-accent" : "text-tertiary group-hover:text-secondary")} />

      {editing ? (
        <input
          ref={inputRef}
          autoFocus
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditing(false); }}
          onBlur={saveEdit}
          onClick={e => e.stopPropagation()}
          className="flex-1 min-w-0 bg-surface-2 border border-accent/50 rounded px-1.5 py-0.5 text-xs text-primary outline-none"
        />
      ) : (
        <span className="flex-1 min-w-0 truncate text-xs font-medium">{displayTitle}</span>
      )}

      {conv.isPinned && !editing && <Pin className="w-2.5 h-2.5 shrink-0 text-accent/50" />}

      {confirmDel && !editing && (
        <div className="absolute right-1 inset-y-0 flex items-center gap-1 bg-surface-0 pl-2 z-10" onClick={e => e.stopPropagation()}>
          <span className="text-[10px] text-loss font-semibold">Delete?</span>
          <button onClick={() => { onDelete(); setConfirmDel(false); }} className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white bg-loss hover:bg-red-600">Yes</button>
          <button onClick={() => setConfirmDel(false)} className="px-1.5 py-0.5 rounded text-[10px] font-bold text-tertiary hover:text-primary">No</button>
        </div>
      )}

      {!editing && !confirmDel && (
        <div className="relative shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }} className="p-0.5 rounded hover:bg-surface-2 text-tertiary hover:text-primary transition-colors">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          {menuOpen && (
            <ConvMenu
              conv={conv}
              onRename={() => { setEditing(true); setTimeout(() => inputRef.current?.select(), 50); setMenuOpen(false); }}
              onPin={onPin}
              onArchive={onArchive}
              onDuplicate={onDuplicate}
              onExport={onExport}
              onDelete={() => { setConfirmDel(true); setMenuOpen(false); }}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
}

function GroupHeader({ label }: { label: string }) {
  return <p className="px-2 pt-4 pb-1 text-[9px] font-bold text-tertiary uppercase tracking-widest">{label}</p>;
}

// ─── Sidebar Content ──────────────────────────────────────────────────────────
function SidebarContent({ onClose }: { onClose?: () => void }) {
  const conversations = useInsightStore(s => s.conversations);
  const activeConversationId = useInsightStore(s => s.activeConversationId);
  const deleteConversation = useInsightStore(s => s.deleteConversation);
  const pinConversation = useInsightStore(s => s.pinConversation);
  const archiveConversation = useInsightStore(s => s.archiveConversation);
  const duplicateConversation = useInsightStore(s => s.duplicateConversation);
  const exportConversation = useInsightStore(s => s.exportConversation);
  const clearAllConversations = useInsightStore(s => s.clearAllConversations);

  const [search, setSearch] = useState('');
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleNewChat = () => {
    useInsightStore.getState().setActiveConversation(null);
    onClose?.();
  };

  const handleSelect = (id: string) => {
    useInsightStore.getState().setActiveConversation(id);
    onClose?.();
  };

  const filtered = conversations.filter(c =>
    !c.isArchived &&
    (c.title.replace(/^\[MODE:[\w]+\]\s*/i, '').toLowerCase().includes(search.toLowerCase()))
  );
  const archived = conversations.filter(c => c.isArchived);

  const pinned   = filtered.filter(c => c.isPinned);
  const unpinned = filtered.filter(c => !c.isPinned);
  const today     = unpinned.filter(c => isToday(new Date(c.updatedAt!)));
  const yesterday = unpinned.filter(c => isYesterday(new Date(c.updatedAt!)));
  const thisWeek  = unpinned.filter(c => !isToday(new Date(c.updatedAt!)) && !isYesterday(new Date(c.updatedAt!)) && isThisWeek(new Date(c.updatedAt!)));
  const older     = unpinned.filter(c => !isToday(new Date(c.updatedAt!)) && !isYesterday(new Date(c.updatedAt!)) && !isThisWeek(new Date(c.updatedAt!)));

  const renderGroup = (label: string, list: AiConversation[]) => {
    if (!list.length) return null;
    return (
      <div key={label}>
        <GroupHeader label={label} />
        <div className="space-y-0.5">
          {list.map(conv => (
            <ConvRow
              key={conv.id}
              conv={conv}
              isActive={activeConversationId === conv.id}
              onSelect={() => handleSelect(conv.id)}
              onPin={() => pinConversation(conv.id, !conv.isPinned)}
              onArchive={() => archiveConversation(conv.id, !conv.isArchived)}
              onDuplicate={() => duplicateConversation(conv.id)}
              onExport={() => exportConversation(conv.id)}
              onDelete={() => deleteConversation(conv.id)}
            />
          ))}
        </div>
      </div>
    );
  };

  const total = conversations.filter(c => !c.isArchived).length;

  return (
    <>
      {showClearDialog && (
        <ClearAllDialog
          onConfirm={() => { clearAllConversations(); setShowClearDialog(false); }}
          onCancel={() => setShowClearDialog(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-4 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent/10 border border-accent/20 flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-accent" />
          </div>
          <span className="text-xs font-bold text-primary">AI Coach</span>
        </div>
        <button
          onClick={handleNewChat}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-surface-1 text-xs font-semibold text-secondary hover:text-primary hover:border-accent/40 hover:bg-surface-2 transition-all"
          title="New conversation"
        >
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3 shrink-0">
        <div className="relative">
          <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-surface-1 border border-border rounded-lg pl-7 pr-8 py-1.5 text-xs text-primary placeholder:text-tertiary focus:outline-none focus:border-accent/40 transition-all"
            aria-label="Search conversations"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors" aria-label="Clear search">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      <div className="border-t border-border shrink-0" />

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-hide min-h-0">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-10 h-10 rounded-xl bg-surface-1 border border-border flex items-center justify-center mb-3">
              <MessageSquare className="w-5 h-5 text-tertiary opacity-40" />
            </div>
            <p className="text-xs font-semibold text-secondary">No conversations yet</p>
            <p className="text-[10px] text-tertiary mt-1 leading-relaxed">Start by asking the AI Coach anything</p>
          </div>
        ) : filtered.length === 0 && search ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Search className="w-7 h-7 text-tertiary opacity-20 mb-2" />
            <p className="text-xs text-secondary font-medium">No results for "{search}"</p>
          </div>
        ) : (
          <>
            {renderGroup('Pinned', pinned)}
            {renderGroup('Today', today)}
            {renderGroup('Yesterday', yesterday)}
            {renderGroup('This Week', thisWeek)}
            {renderGroup('Older', older)}
            {renderGroup('Archived', archived)}
          </>
        )}
      </div>

      {/* Footer */}
      {total > 0 && (
        <div className="border-t border-border px-3 py-2.5 shrink-0">
          <button
            onClick={() => setShowClearDialog(true)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-tertiary hover:text-loss hover:bg-loss/5 transition-all group"
            aria-label="Clear all conversations"
          >
            <Eraser className="w-3.5 h-3.5 group-hover:text-loss transition-colors" />
            <span>Clear all</span>
            <span className="ml-auto text-[10px] font-mono bg-surface-1 border border-border px-1.5 py-0.5 rounded">{total}</span>
          </button>
        </div>
      )}
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
// Renders as a fixed sidebar on desktop, a slide-in drawer on mobile
export default function AICoachSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-[72px] left-3 z-40 w-8 h-8 rounded-lg bg-surface-0 border border-border flex items-center justify-center shadow-sm hover:bg-surface-1 transition-colors"
        aria-label="Open conversation history"
      >
        <Menu className="w-4 h-4 text-secondary" />
      </button>

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={cn(
        "lg:hidden fixed top-0 left-0 z-50 h-full w-[260px] bg-surface-0 border-r border-border flex flex-col shadow-2xl transition-transform duration-300 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-3 pt-4 pb-2">
          <span className="text-xs font-bold text-primary">History</span>
          <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg hover:bg-surface-1 text-tertiary hover:text-primary transition-colors" aria-label="Close sidebar">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </div>
      </div>

      {/* Desktop sidebar — always visible */}
      <div className="hidden lg:flex flex-col h-full w-[240px] xl:w-[260px] bg-surface-0 border-r border-border shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}
