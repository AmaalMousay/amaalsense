import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Calendar, Tag } from 'lucide-react';

interface Conversation {
  id: number;
  topic: string;
  createdAt: Date;
  sentiment?: number;
}

interface SearchConversationsProps {
  conversations: Conversation[];
  onSelect: (conversation: Conversation) => void;
}

export function SearchConversations({ conversations, onSelect }: SearchConversationsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'week' | 'month'>('all');

  const filteredConversations = useMemo(() => {
    let filtered = conversations;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv =>
        conv.topic.toLowerCase().includes(query)
      );
    }

    // Filter by date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    if (filterDate === 'today') {
      filtered = filtered.filter(conv => new Date(conv.createdAt) >= today);
    } else if (filterDate === 'week') {
      filtered = filtered.filter(conv => new Date(conv.createdAt) >= weekAgo);
    } else if (filterDate === 'month') {
      filtered = filtered.filter(conv => new Date(conv.createdAt) >= monthAgo);
    }

    return filtered;
  }, [conversations, searchQuery, filterDate]);

  return (
    <div className="w-full">
      <div className="relative">
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              className="pl-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(['all', 'today', 'week', 'month'] as const).map((date) => (
            <Button
              key={date}
              variant={filterDate === date ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterDate(date)}
              className="capitalize"
            >
              <Calendar className="w-3 h-3 mr-1" />
              {date}
            </Button>
          ))}
        </div>

        {/* Search results */}
        {isOpen && (
          <Card className="absolute top-full left-0 right-0 mt-2 max-h-96 overflow-y-auto z-50 bg-background border border-border animate-card-slide-in">
            {filteredConversations.length > 0 ? (
              <div className="divide-y divide-border">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => {
                      onSelect(conv);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-3 hover:bg-muted/50 transition-colors animate-fade-in"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate text-foreground">
                          {conv.topic}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(conv.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {conv.sentiment !== undefined && (
                        <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                {conversations.length === 0
                  ? 'No conversations yet'
                  : 'No conversations match your search'}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
