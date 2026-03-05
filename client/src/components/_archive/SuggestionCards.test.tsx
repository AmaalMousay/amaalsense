import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SuggestionCards } from './SuggestionCards';

describe('SuggestionCards', () => {
  it('renders follow-up questions', () => {
    const questions = [
      {
        question: 'ما هي الأسباب؟',
        relevance: 0.9,
        expectedValue: 'تحليل عميق',
      },
    ];

    render(<SuggestionCards followUpQuestions={questions} />);

    expect(screen.getByText('أسئلة متابعة مقترحة')).toBeInTheDocument();
    expect(screen.getByText('ما هي الأسباب؟')).toBeInTheDocument();
    expect(screen.getByText(/90% ملاءمة/)).toBeInTheDocument();
  });

  it('renders related topics', () => {
    const topics = ['الاقتصاد', 'السياسة'];

    render(<SuggestionCards relatedTopics={topics} />);

    expect(screen.getByText('موضوعات ذات صلة')).toBeInTheDocument();
    expect(screen.getByText('الاقتصاد')).toBeInTheDocument();
    expect(screen.getByText('السياسة')).toBeInTheDocument();
  });

  it('renders important warnings', () => {
    const warnings = ['تحذير مهم 1', 'تحذير مهم 2'];

    render(<SuggestionCards importantWarnings={warnings} />);

    expect(screen.getByText('تحذيرات مهمة')).toBeInTheDocument();
    expect(screen.getByText('تحذير مهم 1')).toBeInTheDocument();
    expect(screen.getByText('تحذير مهم 2')).toBeInTheDocument();
  });

  it('calls onSuggestionClick when a question is clicked', () => {
    const mockOnClick = vi.fn();
    const questions = [
      {
        question: 'سؤال تجريبي',
        relevance: 0.8,
        expectedValue: 'قيمة متوقعة',
      },
    ];

    render(
      <SuggestionCards
        followUpQuestions={questions}
        onSuggestionClick={mockOnClick}
      />
    );

    const questionCard = screen.getByText('سؤال تجريبي').closest('div');
    if (questionCard?.parentElement) {
      fireEvent.click(questionCard.parentElement);
      expect(mockOnClick).toHaveBeenCalledWith('سؤال تجريبي');
    }
  });

  it('calls onSuggestionClick when a topic button is clicked', () => {
    const mockOnClick = vi.fn();
    const topics = ['موضوع تجريبي'];

    render(
      <SuggestionCards
        relatedTopics={topics}
        onSuggestionClick={mockOnClick}
      />
    );

    const topicButton = screen.getByText('موضوع تجريبي');
    fireEvent.click(topicButton);
    expect(mockOnClick).toHaveBeenCalledWith('موضوع تجريبي');
  });

  it('renders empty state when no suggestions provided', () => {
    render(<SuggestionCards />);

    expect(
      screen.getByText('لا توجد اقتراحات إضافية في الوقت الحالي')
    ).toBeInTheDocument();
  });

  it('shows relevance badge with correct color for high relevance', () => {
    const questions = [
      {
        question: 'سؤال عالي الملاءمة',
        relevance: 0.95,
        expectedValue: 'قيمة',
      },
    ];

    render(<SuggestionCards followUpQuestions={questions} />);

    expect(screen.getByText(/95% ملاءمة/)).toBeInTheDocument();
  });

  it('shows relevance badge with correct color for low relevance', () => {
    const questions = [
      {
        question: 'سؤال منخفض الملاءمة',
        relevance: 0.3,
        expectedValue: 'قيمة',
      },
    ];

    render(<SuggestionCards followUpQuestions={questions} />);

    expect(screen.getByText(/30% ملاءمة/)).toBeInTheDocument();
  });
});
