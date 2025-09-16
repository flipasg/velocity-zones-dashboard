import { describe, expect, it } from 'vitest';
import { render, screen } from '../../test-utils';
import Dashboard from '../Dashboard';

describe('Dashboard Component', () => {
  it('renders dashboard heading', () => {
    render(<Dashboard />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Velocity Zones Dashboard'
    );
  });

  it('renders all dashboard sections', () => {
    render(<Dashboard />);

    expect(screen.getByText('Recent Reps')).toBeInTheDocument();
    expect(screen.getByText('Zone Distribution')).toBeInTheDocument();
    expect(screen.getByText('Performance Overview')).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Dashboard />);

    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();

    // Check for proper heading hierarchy
    const headings = screen.getAllByRole('heading');
    expect(headings).toHaveLength(4); // h1 + 3 h2s
  });
});
