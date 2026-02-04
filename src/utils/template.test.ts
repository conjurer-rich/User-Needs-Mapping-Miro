import { describe, it, expect } from 'vitest';
import {
  getCreatedShapes,
  getCreatedTexts,
  getCreatedConnectors,
  getCreatedFrames,
} from '../test/miro-mock';
import { createStarterTemplate } from './template';

describe('createStarterTemplate', () => {
  it('creates a frame titled "User Needs Map"', async () => {
    await createStarterTemplate();

    const frames = getCreatedFrames();
    expect(frames).toHaveLength(1);
    expect(frames[0].title).toBe('User Needs Map');
    expect(frames[0].width).toBe(1920);
    expect(frames[0].height).toBe(1080);
  });

  it('creates row labels for Users, User needs, and Capabilities', async () => {
    await createStarterTemplate();

    const shapes = getCreatedShapes();
    const rowLabels = shapes.filter(
      (s) =>
        s.content?.includes('Users') ||
        s.content?.includes('User needs') ||
        s.content?.includes('Capabilities')
    );

    expect(rowLabels).toHaveLength(3);
    expect(rowLabels.map((l) => l.content)).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Users'),
        expect.stringContaining('User needs'),
        expect.stringContaining('Capabilities'),
      ])
    );
  });

  it('creates a vertical axis line for value chain visibility', async () => {
    await createStarterTemplate();

    const connectors = getCreatedConnectors();
    const axisLine = connectors.find(
      (c) => c.style?.startStrokeCap === 'arrow' && c.style?.endStrokeCap === 'none'
    );

    expect(axisLine).toBeDefined();
    expect(axisLine?.shape).toBe('straight');
  });

  it('creates value chain labels (Visible, Value Chain, Invisible)', async () => {
    await createStarterTemplate();

    const texts = getCreatedTexts();
    const valueChainLabels = texts.filter(
      (t) =>
        t.content?.includes('Visible') ||
        t.content?.includes('Value Chain') ||
        t.content?.includes('Invisible')
    );

    expect(valueChainLabels).toHaveLength(3);
  });

  it('creates a Key legend with title', async () => {
    await createStarterTemplate();

    const texts = getCreatedTexts();
    const keyTitle = texts.find((t) => t.content === 'Key');

    expect(keyTitle).toBeDefined();
  });

  it('creates key legend shapes (user, user need, internal, external)', async () => {
    await createStarterTemplate();

    const texts = getCreatedTexts();

    const userLabel = texts.find((t) => t.content === 'User');
    const userNeedLabel = texts.find((t) => t.content === 'User Need');
    const internalLabel = texts.find((t) => t.content === 'Internal');
    const externalLabel = texts.find((t) => t.content === 'External');
    const dependsOnLabel = texts.find((t) => t.content === 'Depends on');

    expect(userLabel).toBeDefined();
    expect(userNeedLabel).toBeDefined();
    expect(internalLabel).toBeDefined();
    expect(externalLabel).toBeDefined();
    expect(dependsOnLabel).toBeDefined();
  });

  it('adds all items to the frame', async () => {
    await createStarterTemplate();

    const frames = getCreatedFrames();
    expect(frames[0].add).toHaveBeenCalled();

    const addCallCount = frames[0].add.mock.calls.length;
    expect(addCallCount).toBeGreaterThan(0);
  });

  it('zooms to the created frame', async () => {
    await createStarterTemplate();

    expect(miro.board.viewport.zoomTo).toHaveBeenCalled();
  });

  it('gets the current viewport to position the frame', async () => {
    await createStarterTemplate();

    expect(miro.board.viewport.get).toHaveBeenCalled();
  });
});
