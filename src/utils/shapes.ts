// Shape factory functions for User Needs Mapping elements

export type ShapeType =
  | 'user'
  | 'userNeed'
  | 'internalCapability'
  | 'externalCapability'
  | 'system'
  | 'process'
  | 'connector'
  | 'streamAlignedTeam'
  | 'platformTeam'
  | 'complicatedSubsystemTeam'
  | 'valueStreamGrouping'
  | 'platformGrouping'
  | 'undefinedTeam'
  | 'undefinedGrouping';

// Shape dimensions
const CIRCLE_SIZE = 25;
const RECTANGLE_WIDTH = 120;
const RECTANGLE_HEIGHT = 60;
const GROUPING_WIDTH = 400;
const GROUPING_HEIGHT = 300;
const TEAM_WIDTH = 180;
const TEAM_HEIGHT = 80;
const TEXT_OFFSET = 25; // Distance from shape center to text center
const TEXT_WIDTH = 80;
const USER_TEXT_WIDTH = 45;
const DEFAULT_FONT_SIZE = 14;

// Colors matching the User Needs Mapping visual style
const COLORS = {
  userNeed: '#414BB2',           // Blue filled
  internalCapability: '#FFFFFF', // White fill
  externalCapability: '#808080', // Dark gray/black
  system: 'transparent',         // Transparent
  process: 'transparent',        // Transparent
  border: '#1A1A1A',             // Dark border
  connector: '#000000',          // Black line
  // Team topology overlays
  streamAlignedTeam: '#FFF3CD',        // Light yellow
  streamAlignedBorder: '#E6C200',      // Yellow border
  complicatedSubsystem: '#FFCCAA',     // Light orange/peach
  complicatedSubsystemBorder: '#FF9955', // Orange border
  valueStreamGrouping: '#FFF3CD',      // Light yellow
  valueStreamBorder: '#E6C200',        // Yellow dashed border
  platformGrouping: '#E6F3FF',         // Light blue
  platformTeam: '#E6F3FF',             // Light blue
  platformBorder: '#6699CC',           // Blue solid border
  undefinedGrouping: '#EBEBEF',         // Light grey
  undefinedTeam: '#EBEBEF',             // Light grey
  undefinedBorder: '#9B99AF',           // Grey solid border
};

// Export colors so template can access them
export { COLORS };

export type CreatedItem = Awaited<ReturnType<typeof miro.board.createShape | typeof miro.board.createText | typeof miro.board.createConnector>>;

// Helper to create a text label and group it with a shape
export async function createLabeledShape(
  shapeId: string,
  x: number,
  y: number,
  defaultLabel: string,
  textOffsetY: number = TEXT_OFFSET
): Promise<CreatedItem[]> {
  const text = await miro.board.createText({
    x,
    y: y + textOffsetY,
    width: TEXT_WIDTH,
    content: `${defaultLabel}`,
    style: {
      textAlign: 'center',
      fontSize: DEFAULT_FONT_SIZE
    },
  });

  // Group the shape and text together
  const shape = await miro.board.getById(shapeId) as Awaited<ReturnType<typeof miro.board.createShape>>;
  if (shape && text) {
    await miro.board.group({ items: [shape, text] });
    return [shape, text];
  }
  return [];
}

export async function createUser(x: number, y: number): Promise<CreatedItem[]> {
  // Create head (small circle)
  const head = await miro.board.createShape({
    shape: 'circle',
    x,
    y: y - 15,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    style: {
      fillColor: '#FFFFFF',
      borderColor: COLORS.border,
      borderWidth: 2,
    },
  });

  // Create body (larger circle/arc shape)
  const body = await miro.board.createShape({
    shape: 'circle',
    x,
    y: y + 10,
    width: CIRCLE_SIZE + 10,
    height: CIRCLE_SIZE + 10,
    style: {
      fillColor: '#FFFFFF',
      borderColor: COLORS.border,
      borderWidth: 2,
    },
  });

  const overlay = await miro.board.createShape({
    shape: 'rectangle',
    x,
    y: y + TEXT_OFFSET - 4,
    width: USER_TEXT_WIDTH,
    height: 25,
    style: {
      fillColor: '#FFFFFF',
      borderColor: COLORS.border,
      borderWidth: 0,
    },
  });

  // Create label
  const text = await miro.board.createText({
    x,
    y: y + TEXT_OFFSET,
    width: USER_TEXT_WIDTH,
    height: 40,
    content: `User`,
    style: {
      textAlign: 'center',
      fillColor: '#FFFFFF',
      fontSize: DEFAULT_FONT_SIZE
    },
  });

  // Group all parts together
  if (head && body && overlay && text) {
    await miro.board.group({ items: [head, body, overlay, text] });
    return [head, body, text];
  }
  return [];
}

export async function createUserNeed(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'circle',
    x,
    y,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    style: {
      fillColor: COLORS.userNeed,
      borderColor: COLORS.userNeed,
      borderWidth: 0,
    },
  });

  const items = await createLabeledShape(shape.id, x, y, 'User Need');
  return [shape, ...items.filter(i => i.id !== shape.id)];
}

export async function createInternalCapability(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'circle',
    x,
    y,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    style: {
      fillColor: COLORS.internalCapability,
      borderColor: COLORS.border,
      borderWidth: 2,
    },
  });

  const items = await createLabeledShape(shape.id, x, y, 'Internal');
  return [shape, ...items.filter(i => i.id !== shape.id)];
}

export async function createExternalCapability(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'circle',
    x,
    y,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    style: {
      fillColor: COLORS.externalCapability,
      borderColor: COLORS.externalCapability,
      borderWidth: 0,
    },
  });

  const items = await createLabeledShape(shape.id, x, y, 'External');
  return [shape, ...items.filter(i => i.id !== shape.id)];
}

export async function createSystem(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'rectangle',
    x,
    y,
    width: RECTANGLE_WIDTH,
    height: RECTANGLE_HEIGHT,
    content: 'System',
    style: {
      fillColor: COLORS.system,
      borderStyle: 'dotted',
      borderColor: COLORS.border,
      borderWidth: 2,
      textAlign: 'left',
      textAlignVertical: 'top'
    },
  });

  return [shape];
}

export async function createProcess(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'rectangle',
    x,
    y,
    width: RECTANGLE_WIDTH,
    height: RECTANGLE_HEIGHT,
    content: 'Process',
    style: {
      fillColor: COLORS.process,
      borderStyle: 'dashed',
      borderColor: COLORS.border,
      borderWidth: 2,
      textAlign: 'left',
      textAlignVertical: 'top'
    },
  });

  return [shape];
}

export async function createConnector(x: number, y: number): Promise<CreatedItem[]> {
  // Connectors don't need labels - they just connect shapes
  const connector = await miro.board.createConnector({
    start: {
      position: { x: x - 50, y },
    },
    end: {
      position: { x: x + 50, y },
    },
    shape: 'straight',
    style: {
      strokeColor: COLORS.connector,
      strokeWidth: 2,
      startStrokeCap: 'none',
      endStrokeCap: 'none',
    },
  });
  return [connector];
}

// Stream-aligned team - Yellow rounded rectangle with dashed border
export async function createStreamAlignedTeam(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'round_rectangle',
    x,
    y,
    width: TEAM_WIDTH,
    height: TEAM_HEIGHT,
    content: 'Stream-aligned team',
    style: {
      fillColor: COLORS.streamAlignedTeam,
      borderColor: COLORS.streamAlignedBorder,
      borderWidth: 2,
      textAlign: 'center',
      textAlignVertical: 'top',
      fillOpacity: 0.5,
    },
  });

  return [shape];
}

// Complicated Subsystem team - Orange octagon
export async function createComplicatedSubsystemTeam(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'octagon',
    x,
    y,
    width: TEAM_WIDTH,
    height: TEAM_HEIGHT + 40,
    content: `Complicated Subsystem team`,
    style: {
      fillColor: COLORS.complicatedSubsystem,
      borderColor: COLORS.complicatedSubsystemBorder,
      borderWidth: 2,
      textAlign: 'center',
      textAlignVertical: 'top',
      fillOpacity: 0.5,
    },
  });

  return [shape];
}

// Value Stream Grouping - Light blue rectangle with dashed border
export async function createValueStreamGrouping(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'rectangle',
    x,
    y,
    width: GROUPING_WIDTH,
    height: GROUPING_HEIGHT,
    content: `Value Stream Grouping`,
    style: {
      fillColor: COLORS.valueStreamGrouping,
      borderColor: COLORS.valueStreamBorder,
      borderWidth: 2,
      borderStyle: 'dotted',
      textAlign: 'left',
      textAlignVertical: 'top',
      fillOpacity: 0.5,
    },
  });

  return [shape];
}

// Platform Team - Light blue rectangle with solid border
export async function createPlatformTeam(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'rectangle',
    x,
    y,
    width: TEAM_WIDTH,
    height: TEAM_HEIGHT,
    content: `Platform Team`,
    style: {
      fillColor: COLORS.platformTeam,
      borderColor: COLORS.platformBorder,
      borderWidth: 2,
      borderStyle: 'dotted',
      textAlign: 'center',
      textAlignVertical: 'top',
      fillOpacity: 0.5,
    },
  });

  return [shape];
}


// Platform Grouping - Light blue rectangle with dotted border
export async function createPlatformGrouping(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'rectangle',
    x,
    y,
    width: GROUPING_WIDTH,
    height: GROUPING_HEIGHT,
    content: `Platform Grouping`,
    style: {
      fillColor: COLORS.platformGrouping,
      borderColor: COLORS.platformBorder,
      borderWidth: 2,
      borderStyle: 'dotted',
      textAlign: 'left',
      textAlignVertical: 'top',
      fillOpacity: 0.5,
    },
  });

  return [shape];
}

// Undefined Grouping - Grey rectangle with dotted border
export async function createUndefinedGrouping(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'rectangle',
    x,
    y,
    width: GROUPING_WIDTH,
    height: GROUPING_HEIGHT,
    content: `Undefined Grouping`,
    style: {
      fillColor: COLORS.undefinedGrouping,
      borderColor: COLORS.undefinedBorder,
      borderWidth: 2,
      borderStyle: 'dotted',
      textAlign: 'left',
      textAlignVertical: 'top',
      fillOpacity: 0.5,
    },
  });

  return [shape];
}

// Undefined team - Grey rounded rectangle with dashed border
export async function createUndefinedTeam(x: number, y: number): Promise<CreatedItem[]> {
  const shape = await miro.board.createShape({
    shape: 'round_rectangle',
    x,
    y,
    width: TEAM_WIDTH,
    height: TEAM_HEIGHT,
    content: `Undefined team`,
    style: {
      fillColor: COLORS.undefinedTeam,
      borderColor: COLORS.undefinedBorder,
      borderWidth: 2,
      borderStyle: 'dashed',
      textAlign: 'center',
      textAlignVertical: 'top',
      fillOpacity: 0.5,
    },
  });

  return [shape];
}

// Factory function to create shapes by type
export async function createShape(type: ShapeType, x: number, y: number): Promise<CreatedItem[]> {
  switch (type) {
    case 'user':
      return createUser(x, y);
    case 'userNeed':
      return createUserNeed(x, y);
    case 'internalCapability':
      return createInternalCapability(x, y);
    case 'externalCapability':
      return createExternalCapability(x, y);
    case 'system':
      return createSystem(x, y);
    case 'process':
      return createProcess(x, y);
    case 'connector':
      return createConnector(x, y);
    case 'streamAlignedTeam':
      return createStreamAlignedTeam(x, y);
    case 'platformTeam':
      return createPlatformTeam(x, y);
    case 'undefinedTeam':
      return createUndefinedTeam(x, y);
    case 'complicatedSubsystemTeam':
      return createComplicatedSubsystemTeam(x, y);
    case 'valueStreamGrouping':
      return createValueStreamGrouping(x, y);
    case 'platformGrouping':
      return createPlatformGrouping(x, y);
    case 'undefinedGrouping':
      return createUndefinedGrouping(x, y);
    default:
      console.warn(`Unknown shape type: ${type}`);
      return [];
  }
}
