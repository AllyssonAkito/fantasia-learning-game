import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CourseSelection } from './CourseSelection';

describe('CourseSelection', () => {
  it('oferece Lógica e Atenção como áreas visuais do Nível 1', () => {
    const onSelect = vi.fn();
    const { container } = render(<CourseSelection onSelect={onSelect} />);

    expect(screen.getByRole('heading', { name: 'Nível 1' })).toBeVisible();
    expect(container.querySelectorAll('.course-selection__asset')).toHaveLength(
      6,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Abrir Atenção' }));
    expect(onSelect).toHaveBeenCalledWith('course.attention');
  });
});
