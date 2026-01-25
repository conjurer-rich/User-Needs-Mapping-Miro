// Starter template for User Needs Mapping

const TEMPLATE_WIDTH = 1800;
const TEMPLATE_HEIGHT = 1400;
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

  // Add a "Key" legend inside the frame (top right)
  const legendItems = await createKeyLegend(
    startX + TEMPLATE_WIDTH / 2 - 150,
    startY - ROW_HEIGHT / 2
  );
  itemsToAdd.push(...legendItems);

  // Add all items to the frame
  for (const item of itemsToAdd) {
    await frame.add(item);
  }

  // Zoom to show the frame
  await miro.board.viewport.zoomTo(frame);
}

type BoardItem = Awaited<ReturnType<typeof miro.board.createShape | typeof miro.board.createText | typeof miro.board.createConnector>>;

async function createKeyLegend(x: number, y: number): Promise<BoardItem[]> {
  const items: BoardItem[] = [];
  const spacing = 50;

  // Key title
  items.push(await miro.board.createText({
    x,
    y: y - 40,
    width: 100,
    content: '<p style="font-size: 14px; font-weight: bold;">Key</p>',
  }));

  // User icon
  items.push(await miro.board.createShape({
    shape: 'circle',
    x: x - 30,
    y,
    width: 30,
    height: 30,
    content: '<p style="font-size: 14px;">👤</p>',
    style: { fillColor: '#FFFFFF', borderColor: '#1A1A1A', borderWidth: 1 },
  }));
  items.push(await miro.board.createText({
    x: x + 20,
    y,
    width: 60,
    content: '<p style="font-size: 10px;">User</p>',
  }));

  // User Need
  items.push(await miro.board.createShape({
    shape: 'circle',
    x: x - 30,
    y: y + spacing,
    width: 30,
    height: 30,
    style: { fillColor: '#4262FF', borderWidth: 0 },
  }));
  items.push(await miro.board.createText({
    x: x + 20,
    y: y + spacing,
    width: 80,
    content: '<p style="font-size: 10px;">User Need</p>',
  }));

  // Internal
  items.push(await miro.board.createShape({
    shape: 'circle',
    x: x - 30,
    y: y + spacing * 2,
    width: 30,
    height: 30,
    style: { fillColor: '#FFFFFF', borderColor: '#1A1A1A', borderWidth: 1 },
  }));
  items.push(await miro.board.createText({
    x: x + 20,
    y: y + spacing * 2,
    width: 60,
    content: '<p style="font-size: 10px;">Internal</p>',
  }));

  // External
  items.push(await miro.board.createShape({
    shape: 'circle',
    x: x - 30,
    y: y + spacing * 3,
    width: 30,
    height: 30,
    style: { fillColor: '#333333', borderWidth: 0 },
  }));
  items.push(await miro.board.createText({
    x: x + 20,
    y: y + spacing * 3,
    width: 60,
    content: '<p style="font-size: 10px;">External</p>',
  }));

  // Depends on line
  items.push(await miro.board.createConnector({
    start: { position: { x: x - 45, y: y + spacing * 4 } },
    end: { position: { x: x - 15, y: y + spacing * 4 } },
    shape: 'straight',
    style: {
      strokeColor: '#666666',
      strokeWidth: 2,
      startStrokeCap: 'none',
      endStrokeCap: 'none',
    },
  }));
  items.push(await miro.board.createText({
    x: x + 30,
    y: y + spacing * 4,
    width: 80,
    content: '<p style="font-size: 10px;">Depends on</p>',
  }));

  return items;
}
