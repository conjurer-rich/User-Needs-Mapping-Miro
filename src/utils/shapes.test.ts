import { describe, it, expect } from 'vitest';
import {
  getCreatedShapes,
  getCreatedTexts,
  getCreatedConnectors,
  getGroupedItems,
} from '../test/miro-mock';
import {
  createUser,
  createUserNeed,
  createInternalCapability,
  createExternalCapability,
  createSystem,
  createProcess,
  createConnector,
  createStreamAlignedTeam,
  createPlatformTeam,
  createComplicatedSubsystemTeam,
  createValueStreamGrouping,
  createPlatformGrouping,
  createUndefinedGrouping,
  createUndefinedTeam,
  createShape,
  createLabeledShape,
  COLORS,
} from './shapes';

describe('createUser', () => {
  it('creates head and body circles with label', async () => {
    const result = await createUser(100, 200);

    expect(result).toHaveLength(3);

    const shapes = getCreatedShapes();
    expect(shapes).toHaveLength(3);

    const head = shapes[0];
    expect(head.shape).toBe('circle');
    expect(head.x).toBe(100);
    expect(head.y).toBe(185);
    expect(head.style?.fillColor).toBe('#FFFFFF');
    expect(head.style?.borderColor).toBe('#1A1A1A');

    const body = shapes[1];
    expect(body.shape).toBe('circle');
    expect(body.x).toBe(100);
    expect(body.y).toBe(210);

    const texts = getCreatedTexts();
    expect(texts).toHaveLength(1);
    expect(texts[0].content).toBe('User');
  });

  it('groups all parts together', async () => {
    await createUser(100, 200);

    const groups = getGroupedItems();
    expect(groups).toHaveLength(1);
    expect(groups[0].items).toHaveLength(4);
  });
});

describe('createUserNeed', () => {
  it('creates a blue filled circle with label', async () => {
    const result = await createUserNeed(100, 200);

    expect(result.length).toBeGreaterThan(0);

    const shapes = getCreatedShapes();
    const circle = shapes[0];
    expect(circle.shape).toBe('circle');
    expect(circle.x).toBe(100);
    expect(circle.y).toBe(200);
    expect(circle.style?.fillColor).toBe(COLORS.userNeed);
    expect(circle.style?.borderWidth).toBe(0);

    const texts = getCreatedTexts();
    expect(texts[0].content).toBe('User Need');
  });

  it('groups shape with label', async () => {
    await createUserNeed(100, 200);

    const groups = getGroupedItems();
    expect(groups).toHaveLength(1);
  });
});

describe('createInternalCapability', () => {
  it('creates a white circle with border', async () => {
    await createInternalCapability(100, 200);

    const shapes = getCreatedShapes();
    const circle = shapes[0];
    expect(circle.shape).toBe('circle');
    expect(circle.style?.fillColor).toBe(COLORS.internalCapability);
    expect(circle.style?.borderColor).toBe(COLORS.border);
    expect(circle.style?.borderWidth).toBe(2);

    const texts = getCreatedTexts();
    expect(texts[0].content).toBe('Internal');
  });
});

describe('createExternalCapability', () => {
  it('creates a gray filled circle', async () => {
    await createExternalCapability(100, 200);

    const shapes = getCreatedShapes();
    const circle = shapes[0];
    expect(circle.shape).toBe('circle');
    expect(circle.style?.fillColor).toBe(COLORS.externalCapability);
    expect(circle.style?.borderWidth).toBe(0);

    const texts = getCreatedTexts();
    expect(texts[0].content).toBe('External');
  });
});

describe('createSystem', () => {
  it('creates a rectangle with dotted border', async () => {
    const result = await createSystem(100, 200);

    expect(result).toHaveLength(1);

    const shapes = getCreatedShapes();
    const rect = shapes[0];
    expect(rect.shape).toBe('rectangle');
    expect(rect.content).toBe('System');
    expect(rect.style?.fillColor).toBe('transparent');
    expect(rect.style?.borderStyle).toBe('dotted');
    expect(rect.style?.borderColor).toBe(COLORS.border);
  });

  it('does not create a separate label', async () => {
    await createSystem(100, 200);

    const texts = getCreatedTexts();
    expect(texts).toHaveLength(0);
  });
});

describe('createProcess', () => {
  it('creates a rectangle with dashed border', async () => {
    const result = await createProcess(100, 200);

    expect(result).toHaveLength(1);

    const shapes = getCreatedShapes();
    const rect = shapes[0];
    expect(rect.shape).toBe('rectangle');
    expect(rect.content).toBe('Process');
    expect(rect.style?.fillColor).toBe('transparent');
    expect(rect.style?.borderStyle).toBe('dashed');
  });
});

describe('createConnector', () => {
  it('creates a straight line connector', async () => {
    const result = await createConnector(100, 200);

    expect(result).toHaveLength(1);

    const connectors = getCreatedConnectors();
    expect(connectors).toHaveLength(1);

    const connector = connectors[0];
    expect(connector.shape).toBe('straight');
    expect(connector.start.position.x).toBe(50);
    expect(connector.start.position.y).toBe(200);
    expect(connector.end.position.x).toBe(150);
    expect(connector.end.position.y).toBe(200);
    expect(connector.style?.startStrokeCap).toBe('none');
    expect(connector.style?.endStrokeCap).toBe('none');
  });
});

describe('createStreamAlignedTeam', () => {
  it('creates a yellow rounded rectangle', async () => {
    const result = await createStreamAlignedTeam(100, 200);

    expect(result).toHaveLength(1);

    const shapes = getCreatedShapes();
    const rect = shapes[0];
    expect(rect.shape).toBe('round_rectangle');
    expect(rect.content).toBe('Stream-aligned team');
    expect(rect.style?.fillColor).toBe(COLORS.streamAlignedTeam);
    expect(rect.style?.borderColor).toBe(COLORS.streamAlignedBorder);
    expect(rect.style?.fillOpacity).toBe(0.5);
  });
});

describe('createPlatformTeam', () => {
  it('creates a light blue rectangle with dotted border', async () => {
    const result = await createPlatformTeam(100, 200);

    expect(result).toHaveLength(1);

    const shapes = getCreatedShapes();
    const rect = shapes[0];
    expect(rect.shape).toBe('rectangle');
    expect(rect.content).toBe('Platform Team');
    expect(rect.style?.fillColor).toBe(COLORS.platformTeam);
    expect(rect.style?.borderColor).toBe(COLORS.platformBorder);
    expect(rect.style?.borderStyle).toBe('dotted');
  });
});

describe('createComplicatedSubsystemTeam', () => {
  it('creates an orange octagon', async () => {
    const result = await createComplicatedSubsystemTeam(100, 200);

    expect(result).toHaveLength(1);

    const shapes = getCreatedShapes();
    const shape = shapes[0];
    expect(shape.shape).toBe('octagon');
    expect(shape.content).toBe('Complicated Subsystem team');
    expect(shape.style?.fillColor).toBe(COLORS.complicatedSubsystem);
    expect(shape.style?.borderColor).toBe(COLORS.complicatedSubsystemBorder);
  });
});

describe('createValueStreamGrouping', () => {
  it('creates a light yellow rectangle with dotted border', async () => {
    const result = await createValueStreamGrouping(100, 200);

    expect(result).toHaveLength(1);

    const shapes = getCreatedShapes();
    const rect = shapes[0];
    expect(rect.shape).toBe('rectangle');
    expect(rect.content).toBe('Value Stream Grouping');
    expect(rect.style?.fillColor).toBe(COLORS.valueStreamGrouping);
    expect(rect.style?.borderStyle).toBe('dotted');
    expect(rect.width).toBe(400);
    expect(rect.height).toBe(300);
  });
});

describe('createPlatformGrouping', () => {
  it('creates a light blue rectangle with dotted border', async () => {
    const result = await createPlatformGrouping(100, 200);

    expect(result).toHaveLength(1);

    const shapes = getCreatedShapes();
    const rect = shapes[0];
    expect(rect.shape).toBe('rectangle');
    expect(rect.content).toBe('Platform Grouping');
    expect(rect.style?.fillColor).toBe(COLORS.platformGrouping);
    expect(rect.style?.borderStyle).toBe('dotted');
  });
});

describe('createUndefinedGrouping', () => {
  it('creates a grey rectangle with dotted border', async () => {
    const result = await createUndefinedGrouping(100, 200);

    expect(result).toHaveLength(1);

    const shapes = getCreatedShapes();
    const rect = shapes[0];
    expect(rect.shape).toBe('rectangle');
    expect(rect.content).toBe('Undefined Grouping');
    expect(rect.style?.fillColor).toBe(COLORS.undefinedGrouping);
    expect(rect.style?.borderColor).toBe(COLORS.undefinedBorder);
    expect(rect.style?.borderStyle).toBe('dotted');
  });
});

describe('createUndefinedTeam', () => {
  it('creates a grey rounded rectangle with dashed border', async () => {
    const result = await createUndefinedTeam(100, 200);

    expect(result).toHaveLength(1);

    const shapes = getCreatedShapes();
    const rect = shapes[0];
    expect(rect.shape).toBe('round_rectangle');
    expect(rect.content).toBe('Undefined team');
    expect(rect.style?.fillColor).toBe(COLORS.undefinedTeam);
    expect(rect.style?.borderColor).toBe(COLORS.undefinedBorder);
    expect(rect.style?.borderStyle).toBe('dashed');
  });
});

describe('createLabeledShape', () => {
  it('creates text below the shape', async () => {
    const shape = await miro.board.createShape({
      shape: 'circle',
      x: 100,
      y: 200,
      width: 25,
      height: 25,
    });

    await createLabeledShape(shape.id, 100, 200, 'Test Label');

    const texts = getCreatedTexts();
    expect(texts).toHaveLength(1);
    expect(texts[0].content).toBe('Test Label');
    expect(texts[0].y).toBe(225);
  });

  it('groups shape and text together', async () => {
    const shape = await miro.board.createShape({
      shape: 'circle',
      x: 100,
      y: 200,
      width: 25,
      height: 25,
    });

    await createLabeledShape(shape.id, 100, 200, 'Test Label');

    const groups = getGroupedItems();
    expect(groups).toHaveLength(1);
    expect(groups[0].items).toHaveLength(2);
  });

  it('uses custom text offset when provided', async () => {
    const shape = await miro.board.createShape({
      shape: 'circle',
      x: 100,
      y: 200,
      width: 25,
      height: 25,
    });

    await createLabeledShape(shape.id, 100, 200, 'Test Label', 50);

    const texts = getCreatedTexts();
    expect(texts[0].y).toBe(250);
  });
});

describe('createShape router', () => {
  it('routes user type to createUser', async () => {
    const result = await createShape('user', 100, 200);

    expect(result.length).toBeGreaterThan(0);
    const shapes = getCreatedShapes();
    expect(shapes.length).toBeGreaterThan(0);
  });

  it('routes userNeed type to createUserNeed', async () => {
    await createShape('userNeed', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].style?.fillColor).toBe(COLORS.userNeed);
  });

  it('routes internalCapability type to createInternalCapability', async () => {
    await createShape('internalCapability', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].style?.fillColor).toBe(COLORS.internalCapability);
  });

  it('routes externalCapability type to createExternalCapability', async () => {
    await createShape('externalCapability', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].style?.fillColor).toBe(COLORS.externalCapability);
  });

  it('routes system type to createSystem', async () => {
    await createShape('system', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].content).toBe('System');
  });

  it('routes process type to createProcess', async () => {
    await createShape('process', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].content).toBe('Process');
  });

  it('routes connector type to createConnector', async () => {
    await createShape('connector', 100, 200);

    const connectors = getCreatedConnectors();
    expect(connectors).toHaveLength(1);
  });

  it('routes streamAlignedTeam type to createStreamAlignedTeam', async () => {
    await createShape('streamAlignedTeam', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].shape).toBe('round_rectangle');
  });

  it('routes platformTeam type to createPlatformTeam', async () => {
    await createShape('platformTeam', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].content).toBe('Platform Team');
  });

  it('routes complicatedSubsystemTeam type to createComplicatedSubsystemTeam', async () => {
    await createShape('complicatedSubsystemTeam', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].shape).toBe('octagon');
  });

  it('routes valueStreamGrouping type to createValueStreamGrouping', async () => {
    await createShape('valueStreamGrouping', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].content).toBe('Value Stream Grouping');
  });

  it('routes platformGrouping type to createPlatformGrouping', async () => {
    await createShape('platformGrouping', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].content).toBe('Platform Grouping');
  });

  it('routes undefinedGrouping type to createUndefinedGrouping', async () => {
    await createShape('undefinedGrouping', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].content).toBe('Undefined Grouping');
  });

  it('routes undefinedTeam type to createUndefinedTeam', async () => {
    await createShape('undefinedTeam', 100, 200);

    const shapes = getCreatedShapes();
    expect(shapes[0].content).toBe('Undefined team');
  });

  it('returns empty array for unknown shape type', async () => {
    const result = await createShape('unknownType' as any, 100, 200);

    expect(result).toEqual([]);
  });
});

describe('COLORS export', () => {
  it('exports the expected color values', () => {
    expect(COLORS.userNeed).toBe('#414BB2');
    expect(COLORS.internalCapability).toBe('#FFFFFF');
    expect(COLORS.externalCapability).toBe('#808080');
    expect(COLORS.border).toBe('#1A1A1A');
    expect(COLORS.connector).toBe('#000000');
  });
});
