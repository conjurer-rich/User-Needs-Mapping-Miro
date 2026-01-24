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

// Colors matching the User Needs Mapping visual style
const COLORS = {
  userNeed: '#4262FF',           // Blue filled
  internalCapability: '#FFFFFF', // White fill
  externalCapability: '#333333', // Dark gray/black
  systemProcess: '#FFFFFF',      // White fill
  teamBoundary: '#FFF3CD',       // Light yellow
  border: '#1A1A1A',             // Dark border
  connector: '#666666',          // Gray line
};

export async function createUser(x: number, y: number): Promise<void> {
  // Create a person icon using a shape with text as fallback
  // In production, you'd use createImage with a hosted SVG URL
  await miro.board.createShape({
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
}

export async function createUserNeed(x: number, y: number, label?: string): Promise<void> {
  await miro.board.createShape({
    shape: 'circle',
    x,
    y,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    content: label ? `<p style="font-size: 10px; color: white;">${label}</p>` : '',
    style: {
      fillColor: COLORS.userNeed,
      borderColor: COLORS.userNeed,
      borderWidth: 0,
    },
  });
}

export async function createInternalCapability(x: number, y: number, label?: string): Promise<void> {
  await miro.board.createShape({
    shape: 'circle',
    x,
    y,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    content: label ? `<p style="font-size: 10px;">${label}</p>` : '',
    style: {
      fillColor: COLORS.internalCapability,
      borderColor: COLORS.border,
      borderWidth: 2,
    },
  });
}

export async function createExternalCapability(x: number, y: number, label?: string): Promise<void> {
  await miro.board.createShape({
    shape: 'circle',
    x,
    y,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    content: label ? `<p style="font-size: 10px; color: white;">${label}</p>` : '',
    style: {
      fillColor: COLORS.externalCapability,
      borderColor: COLORS.externalCapability,
      borderWidth: 0,
    },
  });
}

export async function createSystemProcess(x: number, y: number, label?: string): Promise<void> {
  await miro.board.createShape({
    shape: 'rectangle',
    x,
    y,
    width: RECTANGLE_WIDTH,
    height: RECTANGLE_HEIGHT,
    content: label ? `<p style="font-size: 12px;">${label}</p>` : '',
    style: {
      fillColor: COLORS.systemProcess,
      borderColor: COLORS.border,
      borderWidth: 2,
    },
  });
}

export async function createConnector(x: number, y: number): Promise<void> {
  // Create a simple line - user will adjust endpoints
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

export async function createTeamBoundary(x: number, y: number, label?: string): Promise<void> {
  await miro.board.createShape({
    shape: 'round_rectangle',
    x,
    y,
    width: TEAM_BOUNDARY_WIDTH,
    height: TEAM_BOUNDARY_HEIGHT,
    content: label ? `<p style="font-size: 14px; font-weight: bold;">${label}</p>` : '',
    style: {
      fillColor: COLORS.teamBoundary,
      borderColor: '#E6C200',
      borderWidth: 2,
      borderStyle: 'dashed',
    },
  });
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
