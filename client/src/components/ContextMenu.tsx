import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, ClipboardPaste, MousePointerClick, Check } from 'lucide-react';

interface ContextMenuProps {
  children: React.ReactNode;
  className?: string;
}

interface MenuPosition {
  x: number;
  y: number;
}

type MenuState = 'closed' | 'main' | 'afterSelect';

export function ContextMenu({ children, className = '' }: ContextMenuProps) {
  const [menuState, setMenuState] = useState<MenuState>('closed');
  const [position, setPosition] = useState<MenuPosition>({ x: 0, y: 0 });
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle right-click
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    // Calculate position, ensuring menu stays within viewport
    const x = Math.min(e.clientX, window.innerWidth - 200);
    const y = Math.min(e.clientY, window.innerHeight - 150);
    
    setPosition({ x, y });
    setMenuState('main');
    setCopied(false);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuState('closed');
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuState('closed');
      }
    };

    if (menuState !== 'closed') {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuState]);

  // Select All function - now shows secondary menu
  const handleSelectAll = useCallback(() => {
    if (containerRef.current) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(containerRef.current);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    // Show secondary menu with Copy option
    setMenuState('afterSelect');
  }, []);

  // Copy function
  const handleCopy = useCallback(async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();
    
    if (selectedText) {
      try {
        await navigator.clipboard.writeText(selectedText);
        setCopied(true);
        setTimeout(() => {
          setMenuState('closed');
          setCopied(false);
        }, 500);
      } catch (err) {
        console.error('Failed to copy:', err);
        setMenuState('closed');
      }
    } else {
      // If nothing selected, select all and copy
      if (containerRef.current) {
        const text = containerRef.current.innerText;
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => {
            setMenuState('closed');
            setCopied(false);
          }, 500);
        } catch (err) {
          console.error('Failed to copy:', err);
          setMenuState('closed');
        }
      }
    }
  }, []);

  // Paste function (for input fields)
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Find active input element and paste
      const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        const start = activeElement.selectionStart || 0;
        const end = activeElement.selectionEnd || 0;
        const currentValue = activeElement.value;
        activeElement.value = currentValue.slice(0, start) + text + currentValue.slice(end);
        
        // Trigger input event for React
        const event = new Event('input', { bubbles: true });
        activeElement.dispatchEvent(event);
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
    setMenuState('closed');
  }, []);

  // Go back to main menu
  const handleBack = useCallback(() => {
    setMenuState('main');
  }, []);

  return (
    <div 
      ref={containerRef}
      onContextMenu={handleContextMenu}
      className={`relative ${className}`}
    >
      {children}
      
      {/* Main Context Menu */}
      {menuState === 'main' && (
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[180px] animate-in fade-in-0 zoom-in-95 duration-100"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {/* Select All */}
          <button
            onClick={handleSelectAll}
            className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <MousePointerClick className="w-4 h-4" />
            <span>تحديد الكل</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+A</span>
          </button>
          
          {/* Divider */}
          <div className="h-px bg-border my-1" />
          
          {/* Copy */}
          <button
            onClick={handleCopy}
            className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? 'تم النسخ!' : 'نسخ'}</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
          </button>
          
          {/* Paste */}
          <button
            onClick={handlePaste}
            className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <ClipboardPaste className="w-4 h-4" />
            <span>لصق</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+V</span>
          </button>
        </div>
      )}

      {/* Secondary Menu - After Select All */}
      {menuState === 'afterSelect' && (
        <div
          ref={menuRef}
          className="fixed z-[9999] bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[200px] animate-in fade-in-0 zoom-in-95 duration-100"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          {/* Header */}
          <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border flex items-center gap-2">
            <Check className="w-3 h-3 text-green-500" />
            <span>تم تحديد النص</span>
          </div>
          
          {/* Copy - Main action */}
          <button
            onClick={handleCopy}
            className="w-full px-4 py-3 text-sm text-left flex items-center gap-3 hover:bg-primary/20 hover:text-primary transition-colors bg-primary/10"
          >
            {copied ? (
              <Check className="w-5 h-5 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 text-primary" />
            )}
            <span className="font-medium">{copied ? 'تم النسخ!' : 'نسخ النص المحدد'}</span>
            <span className="ml-auto text-xs text-muted-foreground">Ctrl+C</span>
          </button>
          
          {/* Divider */}
          <div className="h-px bg-border my-1" />
          
          {/* Back to main menu */}
          <button
            onClick={handleBack}
            className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
          >
            <span>← رجوع</span>
          </button>
          
          {/* Cancel */}
          <button
            onClick={() => setMenuState('closed')}
            className="w-full px-4 py-2 text-sm text-left flex items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-colors text-muted-foreground"
          >
            <span>إلغاء</span>
          </button>
        </div>
      )}
    </div>
  );
}
