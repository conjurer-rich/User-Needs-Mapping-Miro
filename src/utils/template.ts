// Starter template for User Needs Mapping
import {
  createUser,
  createUserNeed,
  createInternalCapability,
  createExternalCapability,
  createConnector as createConnectorShape,
  createLabeledShape, 
  CreatedItem,
} from './shapes';

const TEMPLATE_WIDTH = 1920;
const TEMPLATE_HEIGHT = 1080;
const ROW_HEIGHT = 200;
const LABEL_WIDTH = 120;

const COLORS = {
  labelBg: 'transparent',
  border: 'transparent',
  text: '#333333',
  axis: '#666666',
};

interface RowConfig {
  label: string;
  yOffset: number;
  isValueChainLabel?: boolean;
}

const ROWS: RowConfig[] = [
  { label: 'Users', yOffset: 0 },
  { label: 'User needs', yOffset: ROW_HEIGHT },
  { label: 'Capabilities', yOffset: ROW_HEIGHT * 2 },
];

// Value chain visibility labels (rotated 90 degrees)
const VALUE_CHAIN_LABELS: RowConfig[] = [
  { label: 'Visible', yOffset: ROW_HEIGHT * 3, isValueChainLabel: true },
  { label: 'Value Chain', yOffset: ROW_HEIGHT * 4, isValueChainLabel: true },
  { label: 'Invisible', yOffset: ROW_HEIGHT * 5, isValueChainLabel: true },
];

export async function createStarterTemplate(): Promise<void> {
  // Get viewport center to place template
  const viewport = await miro.board.viewport.get();
  const frameX = viewport.x;
  const frameY = viewport.y;

  // Create the main frame
  const frame = await miro.board.createFrame({
    title: 'User Needs Map',
    x: frameX,
    y: frameY,
    width: TEMPLATE_WIDTH,
    height: TEMPLATE_HEIGHT,
    style: {
      fillColor: '#FFFFFF',
    },
  });

  // Collect all items to add to the frame
  const itemsToAdd: Awaited<ReturnType<typeof miro.board.createShape | typeof miro.board.createText | typeof miro.board.createConnector>>[] = [];

  // Calculate positions relative to frame center
  const startX = frameX;
  const startY = frameY - TEMPLATE_HEIGHT / 2 + ROW_HEIGHT;

  // Create main row labels on the left side (Users, User needs, Capabilities)
  for (const row of ROWS) {
    const shape = await miro.board.createShape({
      shape: 'rectangle',
      x: startX - TEMPLATE_WIDTH / 2 + LABEL_WIDTH / 2 + 50,
      y: startY + row.yOffset,
      width: LABEL_WIDTH,
      height: ROW_HEIGHT - 10,
      content: `<p style="font-size: 12px; font-weight: bold; writing-mode: vertical-rl; transform: rotate(180deg);">${row.label}</p>`,
      style: {
        fillColor: COLORS.labelBg,
        borderColor: COLORS.border,
        borderWidth: 1,
      },
    });
    itemsToAdd.push(shape);
  }

  // Position for value chain axis (to the left of main content)
  const axisX = startX - TEMPLATE_WIDTH / 2 + LABEL_WIDTH / 2 + 50;
  const visibleY = startY + VALUE_CHAIN_LABELS[0].yOffset;
  const invisibleY = startY + VALUE_CHAIN_LABELS[2].yOffset;

  // Create vertical axis line (Value Chain Visibility Axis)
  const axisLine = await miro.board.createConnector({
    start: {
      position: { x: axisX, y: visibleY - ROW_HEIGHT / 2 + 20 },
    },
    end: {
      position: { x: axisX, y: invisibleY + ROW_HEIGHT / 2 - 20 },
    },
    shape: 'straight',
    style: {
      strokeColor: COLORS.axis,
      strokeWidth: 2,
      startStrokeCap: 'arrow',
      endStrokeCap: 'arrow',
    },
  });
  itemsToAdd.push(axisLine);

  // Create value chain labels (Visible, Value Chain, Invisible) - rotated 90 degrees
  for (const row of VALUE_CHAIN_LABELS) {
    const text = await miro.board.createText({
      x: axisX - 25,
      y: startY + row.yOffset,
      width: 60,
      content: `<p style="font-size: 11px; font-weight: 500; writing-mode: vertical-rl; transform: rotate(180deg);">${row.label}</p>`,
      style: {
        textAlign: 'center',
      },
      rotation: 270,
    });
    itemsToAdd.push(text);
  }

  // Add a "Key" legend horizontally, inline with the Users row
  const legendStartX = startX - TEMPLATE_WIDTH / 2 + LABEL_WIDTH + 100;
  const legendItems = await createKeyLegend(legendStartX, startY);
  itemsToAdd.push(...legendItems);

  // Add all items to the frame
  for (const item of itemsToAdd) {
    await frame.add(item);
  }

  // Zoom to show the frame
  await miro.board.viewport.zoomTo(frame);
}

async function createKeyLegend(x: number, y: number): Promise<CreatedItem[]> {
  const items: CreatedItem[] = [];
  const hSpacing = 120; // Horizontal spacing between items

  // Key title
  items.push(await miro.board.createText({
    x: x - 40,
    y,
    width: 50,
    content: '<p style="font-size: 14px; font-weight: bold;">Key</p>',
  }));

  let currentX = x + 40;

  // User - reuse shape function
  items.push(...await createUser(currentX, y));
  currentX += hSpacing;

  // User Need - reuse shape function
  items.push(...await createUserNeed(currentX, y));
  currentX += hSpacing;

  // Internal - reuse shape function
  items.push(...await createInternalCapability(currentX, y));
  currentX += hSpacing;

  // External - reuse shape function
  items.push(...await createExternalCapability(currentX, y));
  currentX += hSpacing;

  // Connector - reuse shape function
  const connector = await createConnectorShape(currentX, y);  
  items.push(...await createLabeledShape(connector[0].id, currentX, y, 'Depends on'));

  return items;
}
