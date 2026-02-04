import { vi } from 'vitest';

type ShapeParams = {
  shape: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: Record<string, unknown>;
};

type TextParams = {
  x: number;
  y: number;
  width: number;
  height?: number;
  content: string;
  style?: Record<string, unknown>;
  rotation?: number;
};

type ConnectorParams = {
  start: { position: { x: number; y: number } };
  end: { position: { x: number; y: number } };
  shape: string;
  style?: Record<string, unknown>;
};

type FrameParams = {
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  style?: Record<string, unknown>;
};

type MockShape = ShapeParams & { id: string; type: 'shape' };
type MockText = TextParams & { id: string; type: 'text' };
type MockConnector = ConnectorParams & { id: string; type: 'connector' };
type MockFrame = FrameParams & { id: string; type: 'frame'; add: ReturnType<typeof vi.fn> };

type MockItem = MockShape | MockText | MockConnector | MockFrame;

let idCounter = 0;
let createdItems: MockItem[] = [];
let groupedItems: Array<{ items: MockItem[] }> = [];

export function resetMiroMock() {
  idCounter = 0;
  createdItems = [];
  groupedItems = [];
}

export function getCreatedItems() {
  return createdItems;
}

export function getGroupedItems() {
  return groupedItems;
}

export function getCreatedShapes() {
  return createdItems.filter((item): item is MockShape => item.type === 'shape');
}

export function getCreatedTexts() {
  return createdItems.filter((item): item is MockText => item.type === 'text');
}

export function getCreatedConnectors() {
  return createdItems.filter((item): item is MockConnector => item.type === 'connector');
}

export function getCreatedFrames() {
  return createdItems.filter((item): item is MockFrame => item.type === 'frame');
}

export function createMiroMock() {
  return {
    board: {
      createShape: vi.fn(async (params: ShapeParams) => {
        const item: MockShape = {
          ...params,
          id: `shape-${++idCounter}`,
          type: 'shape',
        };
        createdItems.push(item);
        return item;
      }),

      createText: vi.fn(async (params: TextParams) => {
        const item: MockText = {
          ...params,
          id: `text-${++idCounter}`,
          type: 'text',
        };
        createdItems.push(item);
        return item;
      }),

      createConnector: vi.fn(async (params: ConnectorParams) => {
        const item: MockConnector = {
          ...params,
          id: `connector-${++idCounter}`,
          type: 'connector',
        };
        createdItems.push(item);
        return item;
      }),

      createFrame: vi.fn(async (params: FrameParams) => {
        const item: MockFrame = {
          ...params,
          id: `frame-${++idCounter}`,
          type: 'frame',
          add: vi.fn(),
        };
        createdItems.push(item);
        return item;
      }),

      getById: vi.fn(async (id: string) => {
        return createdItems.find((item) => item.id === id);
      }),

      group: vi.fn(async ({ items }: { items: MockItem[] }) => {
        groupedItems.push({ items });
        return { id: `group-${++idCounter}`, items };
      }),

      viewport: {
        get: vi.fn(async () => ({ x: 0, y: 0, width: 1920, height: 1080 })),
        zoomTo: vi.fn(async (_item: unknown) => {}),
      },

      notifications: {
        showInfo: vi.fn(async (_message: string) => {}),
      },

      ui: {
        on: vi.fn(),
        openPanel: vi.fn(async (_options: { url: string }) => {}),
        closePanel: vi.fn(async () => {}),
      },
    },
  };
}
