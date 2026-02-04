import { describe, it, expect, type Mock } from 'vitest';
import { LINKING_HINT_MESSAGE, showLinkingShortcutHint } from './app';

const MIRO_NOTIFICATION_MAX_LENGTH = 80;

describe('LINKING_HINT_MESSAGE', () => {
  it('does not exceed Miro notification limit of 80 characters', () => {
    expect(LINKING_HINT_MESSAGE.length).toBeLessThanOrEqual(
      MIRO_NOTIFICATION_MAX_LENGTH
    );
  });

  it('contains instructions for linking', () => {
    expect(LINKING_HINT_MESSAGE).toContain('L');
    expect(LINKING_HINT_MESSAGE).toContain('linking');
  });
});

describe('showLinkingShortcutHint', () => {
  it('shows notification with the linking hint message', async () => {
    await showLinkingShortcutHint();

    expect(miro.board.notifications.showInfo).toHaveBeenCalledWith(
      LINKING_HINT_MESSAGE
    );
  });

  it('does not throw when notification fails', async () => {
    const mockShowInfo = miro.board.notifications.showInfo as Mock;
    mockShowInfo.mockRejectedValueOnce(new Error('Notification failed'));

    await expect(showLinkingShortcutHint()).resolves.toBeUndefined();
  });
});
