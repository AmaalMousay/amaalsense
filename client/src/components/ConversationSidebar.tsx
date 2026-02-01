import { useState } from 'react';
import { Menu, X, Plus, MessageSquare, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

interface ConversationSidebarProps {
  currentConversationId?: number;
  onSelectConversation: (id: number) => void;
  onNewConversation: () => void;
}

export function ConversationSidebar({
  currentConversationId,
  onSelectConversation,
  onNewConversation,
}: ConversationSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { data: conversations, refetch } = trpc.conversations.list.useQuery();
  const deleteConversation = trpc.conversations.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getEmotionColor = (emotion?: string | null) => {
    const colors: Record<string, string> = {
      joy: 'text-green-400',
      hope: 'text-emerald-400',
      curiosity: 'text-yellow-400',
      fear: 'text-orange-400',
      anger: 'text-red-400',
      sadness: 'text-purple-400',
    };
    return emotion ? colors[emotion] || 'text-gray-400' : 'text-gray-400';
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (confirm('Delete this conversation?')) {
      deleteConversation.mutate({ id });
    }
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 bg-slate-800/80 hover:bg-slate-700 backdrop-blur-sm"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 h-full w-80 bg-slate-900 border-r border-slate-700 z-50 transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">Conversations</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="hover:bg-slate-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* New Conversation Button */}
        <div className="p-4">
          <Button
            onClick={() => {
              onNewConversation();
              setIsOpen(false);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Conversations List */}
        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="px-2 pb-4">
            {conversations?.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No conversations yet</p>
                <p className="text-sm mt-1">Start a new analysis to begin</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations?.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      onSelectConversation(conv.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "group relative p-3 rounded-lg cursor-pointer transition-all",
                      currentConversationId === conv.id
                        ? "bg-slate-700 border border-purple-500/50"
                        : "hover:bg-slate-800 border border-transparent"
                    )}
                  >
                    {/* Title */}
                    <div className="flex items-start gap-2">
                      <MessageSquare className={cn("h-4 w-4 mt-0.5 flex-shrink-0", getEmotionColor(conv.dominantEmotion))} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {conv.title}
                        </p>
                        
                        {/* Meta info */}
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          <span>{formatDate(conv.lastActivityAt)}</span>
                          {conv.countryCode && (
                            <>
                              <span>•</span>
                              <span>{conv.countryCode}</span>
                            </>
                          )}
                        </div>

                        {/* Indicators */}
                        {conv.lastGmi !== null && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              conv.lastGmi >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            )}>
                              GMI: {conv.lastGmi > 0 ? '+' : ''}{conv.lastGmi}
                            </span>
                            <span className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              conv.lastCfi && conv.lastCfi < 50 ? "bg-blue-500/20 text-blue-400" : "bg-orange-500/20 text-orange-400"
                            )}>
                              CFI: {conv.lastCfi}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Delete button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleDelete(e, conv.id)}
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 hover:bg-red-500/20 hover:text-red-400"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}
