import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AvatarPicker } from './AvatarPicker';

describe('AvatarPicker', () => {
  it('permite escolher um avatar local por toque', () => {
    const onChange = vi.fn();
    render(<AvatarPicker onChange={onChange} value="avatar.bunny" />);

    fireEvent.click(screen.getByRole('radio', { name: 'Amarelinho' }));

    expect(onChange).toHaveBeenCalledWith('avatar.yellow-friend');
    expect(screen.getByRole('radio', { name: 'Coelhinho' })).toBeChecked();
  });
});
