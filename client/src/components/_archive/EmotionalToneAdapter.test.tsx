import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmotionalToneAdapter } from './EmotionalToneAdapter';

describe('EmotionalToneAdapter', () => {
  it('renders with sadness emotion and empathetic tone', () => {
    const mockOnToneChange = vi.fn();
    render(
      <EmotionalToneAdapter
        emotion={{ primary: 'sadness', intensity: 0.8 }}
        responseText="هذا نص الإجابة"
        onToneChange={mockOnToneChange}
      />
    );

    expect(screen.getByText('نبرة الإجابة المقترحة')).toBeInTheDocument();
    expect(screen.getByText('تعاطفي')).toBeInTheDocument();
    expect(mockOnToneChange).toHaveBeenCalledWith('empathetic');
  });

  it('renders with joy emotion and encouraging tone', () => {
    const mockOnToneChange = vi.fn();
    render(
      <EmotionalToneAdapter
        emotion={{ primary: 'joy', intensity: 0.7 }}
        responseText="هذا نص الإجابة"
        onToneChange={mockOnToneChange}
      />
    );

    expect(screen.getByText('محفز')).toBeInTheDocument();
    expect(mockOnToneChange).toHaveBeenCalledWith('encouraging');
  });

  it('renders with anger emotion and empathetic tone', () => {
    const mockOnToneChange = vi.fn();
    render(
      <EmotionalToneAdapter
        emotion={{ primary: 'anger', intensity: 0.9 }}
        responseText="هذا نص الإجابة"
        onToneChange={mockOnToneChange}
      />
    );

    expect(screen.getByText('تعاطفي')).toBeInTheDocument();
  });

  it('shows verbosity warning for high intensity emotions', () => {
    render(
      <EmotionalToneAdapter
        emotion={{ primary: 'fear', intensity: 0.85 }}
        responseText="هذا نص الإجابة"
      />
    );

    expect(screen.getByText(/نظراً لكثافة العاطفة/)).toBeInTheDocument();
  });

  it('renders adapted response text', () => {
    render(
      <EmotionalToneAdapter
        emotion={{ primary: 'sadness', intensity: 0.8 }}
        responseText="هذا نص الإجابة"
      />
    );

    expect(screen.getByText('الإجابة المكيفة')).toBeInTheDocument();
  });

  it('displays support message for sad emotion', () => {
    render(
      <EmotionalToneAdapter
        emotion={{ primary: 'sadness', intensity: 0.7 }}
        responseText="هذا نص الإجابة"
      />
    );

    expect(screen.getByText(/نحن هنا لدعمك/)).toBeInTheDocument();
  });
});
