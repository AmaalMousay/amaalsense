/**
 * Enhanced Sidebar with smooth animations and better UX
 */

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, MessageSquare, Clock, Zap } from 'lucide-react';
import { useState } from 'react';

interface Conversation {
  id: number;
  title: string;
  topic?: string;
  createdAt: string;
  confidence?: number;
}

interface EnhancedSidebarProps {
  isOpen: boolean;
  conversations: Conversation[];
  selectedId?: number | null;
  onSelect: (id: number) => void;
  onNew: () => void;
  onDelete: (id: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isLoading?: boolean;
}

export function EnhancedSidebar({
  isOpen,
  conversations,
  selectedId,
  onSelect,
  onNew,
  onDelete,
  searchQuery,
  onSearchChange,
  isLoading = false,
}: EnhancedSidebarProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.topic?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800 transition-all duration-300 z-40 ${
        isOpen ? 'w-64' : 'w-0'
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-slate-800">
          <Button
            onClick={onNew}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/50 group"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
            محادثة جديدة
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              type="text"
              placeholder="ابحث عن محادثة..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-slate-500 text-sm">
              جاري التحميل...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-slate-500 text-sm">
              لا توجد محادثات
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedId === conv.id
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white'
                  }`}
                  onClick={() => onSelect(conv.id)}
                >
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{conv.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {conv.topic && (
                          <span className="text-xs opacity-75 truncate">
                            {conv.topic}
                          </span>
                        )}
                        {conv.confidence !== undefined && (
                          <span className="text-xs opacity-75">
                            {Math.round(conv.confidence * 100)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {hoveredId === conv.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(conv.id);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 bg-red-600 hover:bg-red-700 rounded opacity-0 group-hover:opacity-100 transition-all duration-300"
                      title="حذف"
                    >
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                  )}

                  {/* Timestamp */}
                  <div className="text-xs opacity-50 mt-2">
                    {new Date(conv.createdAt).toLocaleDateString('ar-EG')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-gradient-to-t from-slate-950 to-transparent">
          <div className="text-xs text-slate-500 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>{filteredConversations.length} محادثة</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-blue-400" />
              <span>نشط الآن</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
