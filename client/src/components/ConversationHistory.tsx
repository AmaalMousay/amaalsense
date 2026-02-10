import React, { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Trash2, Pin, Archive, Search, MessageSquare, Calendar,
  Globe, TrendingUp, ChevronRight, Plus
} from 'lucide-react';

interface ConversationItem {
  id: number;
  title: string;
  countryName?: string;
  turnCount: number;
  lastMessageAt: Date;
  isPinned: boolean;
  isArchived: boolean;
}

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation?: (conversationId: number) => void;
}

export const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  isOpen,
  onClose,
  onSelectConversation,
}) => {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterArchived, setFilterArchived] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  // Mock conversations data
  useEffect(() => {
    setConversations([
      {
        id: 1,
        title: 'تحليل الأوضاع السياسية في ليبيا',
        countryName: 'ليبيا',
        turnCount: 5,
        lastMessageAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isPinned: true,
        isArchived: false,
      },
      {
        id: 2,
        title: 'مشاعر السوق حول الأزمة الاقتصادية',
        countryName: 'مصر',
        turnCount: 3,
        lastMessageAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        isPinned: false,
        isArchived: false,
      },
      {
        id: 3,
        title: 'تحليل ردود الفعل على الأحداث الرياضية',
        countryName: 'السعودية',
        turnCount: 7,
        lastMessageAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        isPinned: false,
        isArchived: false,
      },
      {
        id: 4,
        title: 'دراسة المشاعر حول التغيير المناخي',
        countryName: 'الإمارات',
        turnCount: 2,
        lastMessageAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isPinned: false,
        isArchived: true,
      },
    ]);
  }, []);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.title.includes(searchQuery) || 
                         (conv.countryName?.includes(searchQuery) ?? false);
    const matchesArchive = filterArchived ? conv.isArchived : !conv.isArchived;
    return matchesSearch && matchesArchive;
  });

  const pinnedConversations = filteredConversations.filter((c) => c.isPinned);
  const regularConversations = filteredConversations.filter((c) => !c.isPinned);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString('ar-SA');
  };

  const ConversationCard: React.FC<{ conv: ConversationItem }> = ({ conv }) => (
    <Card
      className="cursor-pointer hover:bg-accent transition-colors"
      onClick={() => {
        setSelectedConversation(conv.id);
        onSelectConversation?.(conv.id);
      }}
    >
      <CardContent className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {conv.isPinned && (
                <Pin className="h-3 w-3 text-yellow-500 flex-shrink-0" />
              )}
              <h3 className="font-medium truncate text-sm">{conv.title}</h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {conv.countryName && (
                <Badge variant="secondary" className="text-xs">
                  <Globe className="h-3 w-3 ml-1" />
                  {conv.countryName}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                <MessageSquare className="h-3 w-3 ml-1" />
                {conv.turnCount} أسئلة
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto">
                <Calendar className="h-3 w-3 inline mr-1" />
                {formatDate(conv.lastMessageAt)}
              </span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            سجل المحادثات
          </DialogTitle>
          <DialogDescription>
            استعرض وأعد فتح تحليلاتك السابقة
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Search and Filter */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث عن محادثة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant={filterArchived ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterArchived(!filterArchived)}
            >
              <Archive className="h-4 w-4 ml-2" />
              {filterArchived ? 'مؤرشفة' : 'نشطة'}
            </Button>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-3">
              {/* Pinned Conversations */}
              {pinnedConversations.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                    <Pin className="h-3 w-3 inline mr-1" />
                    مثبتة
                  </h3>
                  <div className="space-y-2">
                    {pinnedConversations.map((conv) => (
                      <ConversationCard key={conv.id} conv={conv} />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Conversations */}
              {regularConversations.length > 0 && (
                <div>
                  {pinnedConversations.length > 0 && (
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2 mt-4">
                      <TrendingUp className="h-3 w-3 inline mr-1" />
                      الأخيرة
                    </h3>
                  )}
                  <div className="space-y-2">
                    {regularConversations.map((conv) => (
                      <ConversationCard key={conv.id} conv={conv} />
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {filteredConversations.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? 'لم يتم العثور على محادثات'
                      : filterArchived
                      ? 'لا توجد محادثات مؤرشفة'
                      : 'ابدأ محادثة جديدة'}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button variant="outline" size="sm" onClick={onClose}>
            إغلاق
          </Button>
          <Button size="sm" className="ml-auto">
            <Plus className="h-4 w-4 ml-2" />
            محادثة جديدة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
