/* @vitest-environment jsdom */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ComparisonStatsCard from './ComparisonStatsCard';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style, ...props }: any) => {
      delete props.initial;
      delete props.animate;
      delete props.whileInView;
      delete props.viewport;
      delete props.transition;
      delete props.whileHover;

      return (
        <div className={className} style={style} {...props}>
          {children}
        </div>
      );
    },
  },
}));

describe('ComparisonStatsCard responsive breakpoints', () => {
  it('renders the expected card structure and positive growth indicators', () => {
    const { container } = render(
      <ComparisonStatsCard
        title="Developer Score"
        valueA={85}
        valueB={72}
        labelA="User One"
        labelB="User Two"
        icon="Award"
      />
    );

    expect(screen.getByText(/Developer Score/i)).toBeDefined();
    expect(screen.getByText('User One')).toBeDefined();
    expect(screen.getByText('User Two')).toBeDefined();
    expect(screen.getByText('85')).toBeDefined();
    expect(screen.getByText('72')).toBeDefined();
    expect(screen.getByText('Winner')).toBeDefined();

    const card = container.firstElementChild;
    const header = container.querySelector('.flex.justify-between.items-center.mb-6');
    const comparisonGrid = container.querySelector(
      '.grid.grid-cols-2.gap-4.items-center.mb-6.relative'
    );
    const progressBar = container.querySelector('.w-full.h-2.bg-gray-100');
    const divider = container.querySelector('.hidden.md\\:block');

    expect(card?.tagName).toBe('DIV');
    expect(header?.tagName).toBe('DIV');
    expect(comparisonGrid?.tagName).toBe('DIV');
    expect(progressBar?.tagName).toBe('DIV');
    expect(divider?.tagName).toBe('DIV');
  });

  it('keeps the divider responsive and preserves the negative growth state', () => {
    const { container } = render(
      <ComparisonStatsCard
        title="Streak"
        valueA={20}
        valueB={80}
        labelA="Alice"
        labelB="Bob"
        icon="Flame"
      />
    );

    const divider = container.querySelector('.hidden.md\\:block');
    const winnerBadges = screen.getAllByText('Winner');

    expect(divider).toBeDefined();
    expect(winnerBadges.length).toBe(1);
    expect(screen.getByText('Alice')).toBeDefined();
    expect(screen.getByText('Bob')).toBeDefined();
    expect(screen.getByText('20')).toBeDefined();
    expect(screen.getByText('80')).toBeDefined();
    expect(screen.getByTitle('Alice')).toBeDefined();
    expect(screen.getByTitle('Bob')).toBeDefined();

    const winnerText = winnerBadges[0].textContent;
    expect(winnerText).toBe('Winner');
    expect(screen.getByText('20').className).not.toMatch(/emerald/);
  });

  it('renders a neutral fallback progress bar when both values are zero', () => {
    const { container } = render(
      <ComparisonStatsCard
        title="Commits"
        valueA={0}
        valueB={0}
        labelA="Alice"
        labelB="Bob"
        icon="GitCommit"
      />
    );

    const progressBar = container.querySelector('.w-full.h-2.bg-gray-100');
    const fallbackBar = container.querySelector('.w-full.h-full.bg-zinc-300');

    expect(progressBar?.tagName).toBe('DIV');
    expect(fallbackBar?.tagName).toBe('DIV');
    expect(screen.queryByText('Winner')).toBeNull();
  });
});
