// Starter template for User Needs Mapping

const TEMPLATE_WIDTH = 1600;
const ROW_HEIGHT = 200;
const LABEL_WIDTH = 120;

const COLORS = {
  labelBg: '#F5F5F5',
  border: '#CCCCCC',
  text: '#333333',
};

interface RowConfig {
  label: string;
  yOffset: number;
}

const ROWS: RowConfig[] = [
  { label: 'Users', yOffset: 0 },
  { label: 'User needs', yOffset: ROW_HEIGHT },
  { label: 'Visible', yOffset: ROW_HEIGHT * 2 },
  { label: 'Value Chain', yOffset: ROW_HEIGHT * 3 },
  { label: 'Invisible', yOffset: ROW_HEIGHT * 4 },
];

export async function createStarterTemplate(): Promise<void> {
  // Get viewport center to place template
  const viewport = await miro.board.viewport.get();
  const startX = viewport.x;
  const startY = viewport.y;

  const createdItems: string[] = [];

  // Create row labels on the left side
  for (const row of ROWS) {
    const label = await miro.board.createShape({
      shape: 'rectangle',
      x: startX - TEMPLATE_WIDTH / 2 + LABEL_WIDTH / 2,
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
    createdItems.push(label.id);

    // Create horizontal separator line
    if (row.yOffset > 0) {
      const line = await miro.board.createConnector({
        start: {
          position: {
            x: startX - TEMPLATE_WIDTH / 2,
            y: startY + row.yOffset - ROW_HEIGHT / 2,
          },
        },
        end: {
          position: {
            x: startX + TEMPLATE_WIDTH / 2,
            y: startY + row.yOffset - ROW_HEIGHT / 2,
          },
        },
        style: {
          strokeColor: COLORS.border,
          strokeWidth: 1,
          startStrokeCap: 'none',
          endStrokeCap: 'none',
        },
      });
      createdItems.push(line.id);
    }
  }

  // Create "Capabilities" bracket label for Visible/Value Chain/Invisible section
  const capabilitiesLabel = await miro.board.createText({
    x: startX - TEMPLATE_WIDTH / 2 - 80,
    y: startY + ROW_HEIGHT * 3,
    width: 40,
    content: '<p style="font-size: 11px; writing-mode: vertical-rl; transform: rotate(180deg);">Capabilities</p>',
    style: {
      textAlign: 'center',
    },
  });
  createdItems.push(capabilitiesLabel.id);

  // Create outer border
  const border = await miro.board.createShape({
    shape: 'rectangle',
    x: startX,
    y: startY + ROW_HEIGHT * 2,
    width: TEMPLATE_WIDTH,
    height: ROW_HEIGHT * 5,
    style: {
      fillColor: 'transparent',
      borderColor: COLORS.border,
      borderWidth: 2,
    },
  });
  createdItems.push(border.id);

  // Add a "Key" legend in the corner
  await createKeyLegend(startX + TEMPLATE_WIDTH / 2 + 100, startY - ROW_HEIGHT);

  // Zoom to show the template
  await miro.board.viewport.zoomTo(await miro.board.get({ id: createdItems }));
}

async function createKeyLegend(x: number, y: number): Promise<void> {
  const spacing = 50;

  // Key title
  await miro.board.createText({
    x,
    y: y - 40,
    width: 100,
    content: '<p style="font-size: 14px; font-weight: bold;">Key</p>',
  });

  // User icon
  await miro.board.createShape({
    shape: 'circle',
    x: x - 30,
    y,
    width: 30,
    height: 30,
    content: '<p style="font-size: 14px;">👤</p>',
    style: { fillColor: '#FFFFFF', borderColor: '#1A1A1A', borderWidth: 1 },
  });
  await miro.board.createText({
    x: x + 20,
    y,
    width: 60,
    content: '<p style="font-size: 10px;">User</p>',
  });

  // User Need
  await miro.board.createShape({
    shape: 'circle',
    x: x - 30,
    y: y + spacing,
    width: 30,
    height: 30,
    style: { fillColor: '#4262FF', borderWidth: 0 },
  });
  await miro.board.createText({
    x: x + 20,
    y: y + spacing,
    width: 80,
    content: '<p style="font-size: 10px;">User Need</p>',
  });

  // Internal
  await miro.board.createShape({
    shape: 'circle',
    x: x - 30,
    y: y + spacing * 2,
    width: 30,
    height: 30,
    style: { fillColor: '#FFFFFF', borderColor: '#1A1A1A', borderWidth: 1 },
  });
  await miro.board.createText({
    x: x + 20,
    y: y + spacing * 2,
    width: 60,
    content: '<p style="font-size: 10px;">Internal</p>',
  });

  // External
  await miro.board.createShape({
    shape: 'circle',
    x: x - 30,
    y: y + spacing * 3,
    width: 30,
    height: 30,
    style: { fillColor: '#333333', borderWidth: 0 },
  });
  await miro.board.createText({
    x: x + 20,
    y: y + spacing * 3,
    width: 60,
    content: '<p style="font-size: 10px;">External</p>',
  });

  // Depends on line
  await miro.board.createConnector({
    start: { position: { x: x - 45, y: y + spacing * 4 } },
    end: { position: { x: x - 15, y: y + spacing * 4 } },
    style: { strokeColor: '#666666', strokeWidth: 2 },
  });
  await miro.board.createText({
    x: x + 30,
    y: y + spacing * 4,
    width: 80,
    content: '<p style="font-size: 10px;">Depends on</p>',
  });
}
