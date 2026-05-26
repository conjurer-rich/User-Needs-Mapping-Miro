import { describe, it, expect, type Mock } from 'vitest';
import {
  LINKING_HINT_MESSAGE,
  SUPPORT_EMAIL,
  SUPPORT_MAILTO,
  addShapeAtViewportCenter,
  createShapeAndZoom,
  showLinkingShortcutHint,
} from './app';
import { getCreatedShapes } from './test/miro-mock';

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

describe('support contact', () => {
  it('exposes the support email', () => {
    expect(SUPPORT_EMAIL).toBe('rich@userneedsmapping.com');
  });

  it('builds a mailto URL with the support email', () => {
    expect(SUPPORT_MAILTO).toContain(`mailto:${SUPPORT_EMAIL}`);
    expect(SUPPORT_MAILTO).toContain('subject=');
  });
});

describe('createShapeAndZoom', () => {
  it('creates the requested shape at the given coordinates', async () => {
    await createShapeAndZoom('userNeed', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes.length).toBeGreaterThan(0);
    expect(shapes[0].x).toBe(100);
    expect(shapes[0].y).toBe(200);
  });

  it('zooms to the created items so they are visible', async () => {
    await createShapeAndZoom('userNeed', 50, 75);

    expect(miro.board.viewport.zoomTo).toHaveBeenCalledTimes(1);
    const passedItems = (miro.board.viewport.zoomTo as Mock).mock.calls[0][0];
    expect(Array.isArray(passedItems)).toBe(true);
    expect(passedItems.length).toBeGreaterThan(0);
  });

  it('does not throw when zoomTo fails', async () => {
    (miro.board.viewport.zoomTo as Mock).mockRejectedValueOnce(
      new Error('zoom failed')
    );

    await expect(createShapeAndZoom('userNeed', 0, 0)).resolves.toBeDefined();
  });
});

describe('addShapeAtViewportCenter', () => {
  it('creates a shape at the centre of the current viewport', async () => {
    (miro.board.viewport.get as Mock).mockResolvedValueOnce({
      x: 1000,
      y: 2000,
      width: 800,
      height: 600,
    });

    await addShapeAtViewportCenter('userNeed');

    const shapes = getCreatedShapes();
    expect(shapes[0].x).toBe(1400);
    expect(shapes[0].y).toBe(2300);
  });

  it('also zooms to the new shape', async () => {
    await addShapeAtViewportCenter('userNeed');

    expect(miro.board.viewport.zoomTo).toHaveBeenCalled();
  });
});
