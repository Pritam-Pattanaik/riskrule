import React, { useEffect, useState } from 'react';
import { useInsightStore, startCoachMemoryPolling, stopCoachMemoryPolling } from '../stores/insightStore';
import AICoachSidebar from '../components/ai/AICoachSidebar';
import EmptyWorkspace from '../components/ai/EmptyWorkspace';
import AIChatWorkspace from '../components/ai/AIChatWorkspace';
import AIInsightsPanel from '../components/ai/AIInsightsPanel';

export default function AICoach() {
  // Use granular selectors — prevents full re-render on unrelated state changes
  const activeConversationId = useInsightStore(s => s.activeConversationId);
  const error = useInsightStore(s => s.error);
  const sendMessage = useInsightStore(s => s.sendMessage);
  const [showInsights, setShowInsights] = useState(false); // Default hidden for more chat space

  // Init once on mount via getState() — avoids effect re-fire from function reference changes
  useEffect(() => {
    const { purgeEmptyConversations, fetchConversations, setActiveConversation } = useInsightStore.getState();

    const init = async () => {
      purgeEmptyConversations(); // Silent cleanup of DB orphans
      await fetchConversations();

      try {
        const lastId = localStorage.getItem('lastActiveConversationId');
        if (lastId) {
          const convs = useInsightStore.getState().conversations;
          if (convs.some(c => c.id === lastId)) {
            setActiveConversation(lastId);
          }
        }
      } catch { /* non-critical */ }
    };

    init();
  }, []); // Stable: only runs once

  useEffect(() => {
    startCoachMemoryPolling();
    return () => stopCoachMemoryPolling();
  }, []);

  const handleQuickAction = (prompt: string, mode?: string) => {
    sendMessage(prompt, mode);
  };

  return (
    // Mobile: pl-0 (hamburger button provides access), Desktop: normal layout
    <div className="flex h-[calc(100dvh-3rem)] min-w-0 flex-col">
      <header className="flex items-center justify-between border-b border-border bg-surface py-3 pl-14 pr-4 lg:px-6"><h1>Lunar AI</h1></header>
      {error && <p role="alert" className="border-b border-border bg-surface px-5 py-2 text-sm text-danger">{error}</p>}
      <div className="flex min-h-0 flex-1">
      {/* Sidebar — responsive (desktop always visible, mobile = drawer in sidebar component) */}
      <AICoachSidebar />

      {/* Main workspace — takes remaining space, mobile needs left padding for hamburger */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-surface relative overflow-hidden">
        {activeConversationId ? (
          <AIChatWorkspace
            conversationId={activeConversationId}
            showInsights={showInsights}
            onToggleInsights={() => setShowInsights(v => !v)}
          />
        ) : (
          <EmptyWorkspace onSelectAction={handleQuickAction} />
        )}
      </div>

      {/* Insights panel — optional, only on large screens */}
      {showInsights && (
        <div className="hidden xl:flex">
          <AIInsightsPanel />
        </div>
      )}
      </div>
    </div>
  );
}
