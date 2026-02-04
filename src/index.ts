export {};

async function init() {
  // Open the panel when the app icon is clicked
  miro.board.ui.on('icon:click', async () => {
    await miro.board.ui.openPanel({ url: 'app.html' });
  });
}

init();
