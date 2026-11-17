// Keyboard and pointer input for Emberflock.

export const ACTION_BURST = 1;
export const ACTION_PAUSE = 2;
export const ACTION_RESTART = 4;
export const ACTION_CONFIRM = 8;

export function createInput(canvas) {
  let mouseX = FIELD_CENTER_X();
  let mouseY = FIELD_CENTER_Y();
  let pointerActive = false;
  let actions = 0;

  function FIELD_CENTER_X() { return 640; }
  function FIELD_CENTER_Y() { return 360; }

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space' || event.code === 'Enter') {
      if (!event.repeat) actions |= ACTION_BURST | ACTION_CONFIRM;
      event.preventDefault();
    } else if (event.code === 'KeyP' || event.code === 'Escape') {
      if (!event.repeat) actions |= ACTION_PAUSE;
      event.preventDefault();
    } else if (event.code === 'KeyR') {
      if (!event.repeat) actions |= ACTION_RESTART;
      event.preventDefault();
    }
  });

  canvas.addEventListener('pointermove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 720 / rect.height;
    mouseX = (event.clientX - rect.left) * scaleX;
    mouseY = (event.clientY - rect.top) * scaleY;
    pointerActive = true;
  });

  canvas.addEventListener('pointerdown', (event) => {
    actions |= ACTION_BURST | ACTION_CONFIRM;
  });

  return {
    getPointer() {
      return { x: mouseX, y: mouseY, active: pointerActive };
    },
    takeActions() {
      const taken = actions;
      actions = 0;
      return taken;
    },
  };
}
