// Emberflock configuration and tuning parameters.

export const FIELD = { width: 1280, height: 720, groundY: 660 };
export const STEP = 1 / 60;

export const REALMS = [
  { id: 1, name: 'Meadow', nights: [1, 2], wispCount: 0, mirrorCount: 0, lampCount: 5 },
  { id: 2, name: 'Old Town', nights: [3, 4, 5], wispCount: 2, mirrorCount: 3, lampCount: 8 },
  { id: 3, name: 'The Deep', nights: [6, 7], wispCount: 4, mirrorCount: 5, lampCount: 12 },
];

export const PALETTE = {
  backdrop: '#0b0d14',
  skyTop: '#121526',
  skyMid: '#241b35',
  skyBottom: '#422436',
  ground: '#181b24',
  grass: '#28323c',
  moth: '#ffd15c',
  mothGlow: 'rgba(255, 209, 92, 0.4)',
  lampUnlit: '#5a6275',
  lampLit: '#ffbe3b',
  lampBeam: 'rgba(255, 200, 80, 0.25)',
  mirror: '#7ec8e3',
  mirrorBeam: 'rgba(126, 200, 227, 0.35)',
  wisp: '#2c1638',
  wispGlow: '#9b4dca',
  text: '#f3f4f6',
  muted: '#9ca3af',
  panel: 'rgba(17, 20, 28, 0.88)',
  accent: '#f59e0b',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
export const BEST_KEY = 'emberflock.best';
