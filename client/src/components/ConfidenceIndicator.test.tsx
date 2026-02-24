import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfidenceIndicator } from './ConfidenceIndicator';

describe('ConfidenceIndicator', () => {
  it('renders with very high confidence (80+)', () => {
    render(<ConfidenceIndicator confidence={85} />);

    expect(screen.getByText('مستوى الثقة')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText(/عالية جداً/)).toBeInTheDocument();
  });

  it('renders with high confidence (60-79)', () => {
    render(<ConfidenceIndicator confidence={70} />);

    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText(/عالية/)).toBeInTheDocument();
  });

  it('renders with medium confidence (40-59)', () => {
    render(<ConfidenceIndicator confidence={50} />);

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText(/متوسطة/)).toBeInTheDocument();
  });

  it('renders with low confidence (below 40)', () => {
    render(<ConfidenceIndicator confidence={30} />);

    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.getByText(/منخفضة/)).toBeInTheDocument();
  });

  it('renders alternatives when confidence is low', () => {
    const alternatives = ['بديل 1', 'بديل 2'];

    render(
      <ConfidenceIndicator
        confidence={35}
        alternatives={alternatives}
      />
    );

    expect(screen.getByText('بدائل ممكنة')).toBeInTheDocument();
    expect(screen.getByText('بديل 1')).toBeInTheDocument();
    expect(screen.getByText('بديل 2')).toBeInTheDocument();
  });

  it('does not render alternatives when confidence is high', () => {
    const alternatives = ['بديل 1'];

    render(
      <ConfidenceIndicator
        confidence={75}
        alternatives={alternatives}
      />
    );

    expect(screen.queryByText('بدائل ممكنة')).not.toBeInTheDocument();
  });

  it('renders needs more info section', () => {
    const needsMoreInfo = ['معلومة 1', 'معلومة 2'];

    render(
      <ConfidenceIndicator
        confidence={60}
        needsMoreInfo={needsMoreInfo}
      />
    );

    expect(screen.getByText(/لتحسين الإجابة/)).toBeInTheDocument();
    expect(screen.getByText('معلومة 1')).toBeInTheDocument();
    expect(screen.getByText('معلومة 2')).toBeInTheDocument();
  });

  it('renders disclaimers section', () => {
    const disclaimers = ['تنويه 1', 'تنويه 2'];

    render(
      <ConfidenceIndicator
        confidence={60}
        disclaimers={disclaimers}
      />
    );

    expect(screen.getByText('تنويهات مهمة')).toBeInTheDocument();
    expect(screen.getByText('تنويه 1')).toBeInTheDocument();
    expect(screen.getByText('تنويه 2')).toBeInTheDocument();
  });

  it('shows warning message for low confidence', () => {
    render(<ConfidenceIndicator confidence={30} />);

    expect(screen.getByText(/يُنصح بالحذر/)).toBeInTheDocument();
  });

  it('shows positive message for high confidence', () => {
    render(<ConfidenceIndicator confidence={80} />);

    expect(screen.getByText(/موثوقة نسبياً/)).toBeInTheDocument();
  });

  it('renders progress bar with correct width', () => {
    const { container } = render(<ConfidenceIndicator confidence={60} />);

    const progressBar = container.querySelector('div[style*="width"]');
    expect(progressBar).toBeInTheDocument();
  });
});
