// Shape factory functions for User Needs Mapping elements

export type ShapeType =
  | 'user'
  | 'userNeed'
  | 'internalCapability'
  | 'externalCapability'
  | 'systemProcess'
  | 'connector'
  | 'teamBoundary';

// Shape dimensions
const CIRCLE_SIZE = 60;
const RECTANGLE_WIDTH = 120;
const RECTANGLE_HEIGHT = 60;
const TEAM_BOUNDARY_WIDTH = 400;
const TEAM_BOUNDARY_HEIGHT = 300;
const TEXT_OFFSET = 45; // Distance from shape center to text center
const TEXT_WIDTH = 120;

// Colors matching the User Needs Mapping visual style
const COLORS = {
  userNeed: '#414BB2',           // Blue filled
  internalCapability: '#FFFFFF', // White fill
  externalCapability: '#808080', // Dark gray/black
  systemProcess: '#FFFFFF',      // White fill
  teamBoundary: '#FFF3CD',       // Light yellow
  border: '#1A1A1A',             // Dark border
  connector: '#666666',          // Gray line
};

// Helper to create a text label and group it with a shape
async function createLabeledShape(
  shapeId: string,
  x: number,
  y: number,
  defaultLabel: string,
  textOffsetY: number = TEXT_OFFSET
): Promise<void> {
  const text = await miro.board.createText({
    x,
    y: y + textOffsetY,
    width: TEXT_WIDTH,
    content: `<p style="font-size: 12px; text-align: center;">${defaultLabel}</p>`,
    style: {
      textAlign: 'center',
    },
  });

  // Group the shape and text together
  const shape = await miro.board.getById(shapeId) as Awaited<ReturnType<typeof miro.board.createShape>>;
  if (shape && text) {
    await miro.board.group({ items: [shape, text] });
  }
}

export async function createUser(x: number, y: number): Promise<void> {
  const shape = await miro.board.createShape({
    shape: 'circle',
    x,
    y,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    content: '<p style="font-size: 24px;">👤</p>',
    style: {
      fillColor: '#FFFFFF',
      borderColor: COLORS.border,
      borderWidth: 2,
    },
  });

  await createLabeledShape(shape.id, x, y, 'User');
}

export async function createUserNeed(x: number, y: number): Promise<void> {
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

  await createLabeledShape(shape.id, x, y, 'User Need');
}

export async function createInternalCapability(x: number, y: number): Promise<void> {
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

  await createLabeledShape(shape.id, x, y, 'Internal');
}

export async function createExternalCapability(x: number, y: number): Promise<void> {
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

  await createLabeledShape(shape.id, x, y, 'External');
}

export async function createSystemProcess(x: number, y: number): Promise<void> {
  const shape = await miro.board.createShape({
    shape: 'rectangle',
    x,
    y,
    width: RECTANGLE_WIDTH,
    height: RECTANGLE_HEIGHT,
    style: {
      fillColor: COLORS.systemProcess,
      borderColor: COLORS.border,
      borderWidth: 2,
    },
  });

  await createLabeledShape(shape.id, x, y, 'System', RECTANGLE_HEIGHT / 2 + 20);
}

export async function createConnector(x: number, y: number): Promise<void> {
  // Connectors don't need labels - they just connect shapes
  await miro.board.createConnector({
    start: {
      position: { x: x - 50, y },
    },
    end: {
      position: { x: x + 50, y },
    },
    style: {
      strokeColor: COLORS.connector,
      strokeWidth: 2,
    },
  });
}

export async function createTeamBoundary(x: number, y: number): Promise<void> {
  const shape = await miro.board.createShape({
    shape: 'round_rectangle',
    x,
    y,
    width: TEAM_BOUNDARY_WIDTH,
    height: TEAM_BOUNDARY_HEIGHT,
    style: {
      fillColor: COLORS.teamBoundary,
      borderColor: '#E6C200',
      borderWidth: 2,
      borderStyle: 'dashed',
    },
  });

  // For team boundary, put label at the top inside the shape
  const text = await miro.board.createText({
    x,
    y: y - TEAM_BOUNDARY_HEIGHT / 2 + 30,
    width: TEAM_BOUNDARY_WIDTH - 40,
    content: '<p style="font-size: 14px; font-weight: bold; text-align: center;">Team Name</p>',
    style: {
      textAlign: 'center',
    },
  });

  const shapeItem = await miro.board.getById(shape.id) as Awaited<ReturnType<typeof miro.board.createShape>>;
  if (shapeItem && text) {
    await miro.board.group({ items: [shapeItem, text] });
  }
}

// Factory function to create shapes by type
export async function createShape(type: ShapeType, x: number, y: number): Promise<void> {
  switch (type) {
    case 'user':
      return createUser(x, y);
    case 'userNeed':
      return createUserNeed(x, y);
    case 'internalCapability':
      return createInternalCapability(x, y);
    case 'externalCapability':
      return createExternalCapability(x, y);
    case 'systemProcess':
      return createSystemProcess(x, y);
    case 'connector':
      return createConnector(x, y);
    case 'teamBoundary':
      return createTeamBoundary(x, y);
    default:
      console.warn(`Unknown shape type: ${type}`);
  }
}
