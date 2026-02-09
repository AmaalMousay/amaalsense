/**
 * useStreamingAnalysis Hook
 * Phase 67: Handle streaming responses from the API
 * 
 * Manages the display of data as it arrives from the server
 */

import { useState, useCallback } from 'react';

export interface StreamChunk {
  type: 'thinking' | 'analysis' | 'emotion' | 'metadata' | 'complete' | 'error';
  content?: string;
  data?: any;
  message?: string;
}

export interface StreamingState {
  isLoading: boolean;
  thinking: string;
  analysis: string;
  emotion: any;
  metadata: any;
  complete: any;
  error: string | null;
  progress: number; // 0-100
}

/**
 * Hook to handle streaming analysis responses
 */
export function useStreamingAnalysis() {
  const [state, setState] = useState<StreamingState>({
    isLoading: true,
    thinking: '',
    analysis: '',
    emotion: null,
    metadata: null,
    complete: null,
    error: null,
    progress: 0,
  });

  /**
   * Process incoming chunks
   */
  const processChunks = useCallback((chunks: StreamChunk[]) => {
    let thinking = '';
    let analysis = '';
    let emotion = null;
    let metadata = null;
    let complete = null;
    let error = null;
    let progress = 0;

    for (const chunk of chunks) {
      switch (chunk.type) {
        case 'thinking':
          thinking = chunk.content || '';
          progress = 20;
          break;
        case 'analysis':
          analysis = chunk.content || '';
          progress = 50;
          break;
        case 'emotion':
          emotion = chunk.data;
          progress = 70;
          break;
        case 'metadata':
          metadata = chunk.data;
          progress = 85;
          break;
        case 'complete':
          complete = chunk.data;
          progress = 100;
          break;
        case 'error':
          error = chunk.message || 'Unknown error';
          break;
      }
    }

    setState({
      isLoading: progress < 100,
      thinking,
      analysis,
      emotion,
      metadata,
      complete,
      error,
      progress,
    });
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState({
      isLoading: true,
      thinking: '',
      analysis: '',
      emotion: null,
      metadata: null,
      complete: null,
      error: null,
      progress: 0,
    });
  }, []);

  return {
    state,
    processChunks,
    reset,
  };
}

/**
 * Hook to display streaming response with animation
 */
export function useStreamingDisplay(content: string) {
  const [displayedContent, setDisplayedContent] = useState('');

  // Stream content character by character for visual effect
  const streamContent = useCallback((text: string) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedContent(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 10); // 10ms per character

    return () => clearInterval(interval);
  }, []);

  return {
    displayedContent,
    streamContent,
  };
}
