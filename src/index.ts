import { createShape, ShapeType } from './utils/shapes';

async function init() {
  // Open the panel when the app icon is clicked
  miro.board.ui.on('icon:click', async () => {
    await miro.board.ui.openPanel({ url: 'app.html' });
  });

  // Handle drag and drop from the panel
  miro.board.ui.on('drop', async ({ x, y, target }) => {
    const shapeType = target.dataset?.shapeType as ShapeType | undefined;

    if (!shapeType) {
      console.warn('No shape type found on dropped element');
      return;
    }

    try {
      await createShape(shapeType, x, y);
    } catch (error) {
      console.error(`Failed to create shape of type "${shapeType}":`, error);
    }
  });
}

init();
