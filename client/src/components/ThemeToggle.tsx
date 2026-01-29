import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'icon' | 'button';
  className?: string;
}

/**
 * Theme Toggle Component
 * Allows switching between dark and light modes
 */
export function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        className={`gap-2 ${className}`}
      >
        {theme === 'dark' ? (
          <>
            <Sun className="w-4 h-4" />
            <span>Light Mode</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4" />
            <span>Dark Mode</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg hover:bg-accent/10 transition-colors ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600" />
      )}
    </button>
  );
}
