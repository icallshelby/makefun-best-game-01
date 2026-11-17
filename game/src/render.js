// Rendering for Emberflock: twilight sky, glowing ember moths, mirrors, lamps, wisps, and HUD.

import { FIELD, FONT, PALETTE, REALMS } from './config.js';

export function createRenderer(canvas) {
  const context = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    const width = Math.round(window.innerWidth * ratio);
    const height = Math.round(window.innerHeight * ratio);
    canvas.width = width;
    canvas.height = height;
    view.scale = Math.min(width / FIELD.width, height / FIELD.height);
    view.x = (width - FIELD.width * view.scale) / 2;
    view.y = (height - FIELD.height * view.scale) / 2;
  }

  const fonts = new Map();
  function text(value, x, y, size, color, align) {
    if (!fonts.has(size)) fonts.set(size, `${size}px ${FONT}`);
    context.font = fonts.get(size);
    context.fillStyle = color;
    context.textAlign = align;
    context.fillText(value, x, y);
  }

  function drawField(state) {
    // 3-band twilight sky gradient
    const grad = context.createLinearGradient(0, 0, 0, FIELD.groundY);
    grad.addColorStop(0, PALETTE.skyTop);
    grad.addColorStop(0.5, PALETTE.skyMid);
    grad.addColorStop(1, PALETTE.skyBottom);
    context.fillStyle = grad;
    context.fillRect(0, 0, FIELD.width, FIELD.groundY);

    // Ground
    context.fillStyle = PALETTE.ground;
    context.fillRect(0, FIELD.groundY, FIELD.width, FIELD.height - FIELD.groundY);
    context.fillStyle = PALETTE.grass;
    context.fillRect(0, FIELD.groundY, FIELD.width, 10);

    // Draw mirrors
    for (const mir of state.mirrors) {
      context.save();
      context.translate(mir.x, mir.y);
      context.rotate(mir.angle);
      context.fillStyle = PALETTE.mirror;
      context.fillRect(-mir.width / 2, -mir.height / 2, mir.width, mir.height);
      context.strokeStyle = '#ffffff';
      context.lineWidth = 2;
      context.strokeRect(-mir.width / 2, -mir.height / 2, mir.width, mir.height);
      context.restore();
    }

    // Draw lamps
    for (const lamp of state.lamps) {
      context.fillStyle = lamp.lit ? PALETTE.lampLit : PALETTE.lampUnlit;
      context.beginPath();
      context.arc(lamp.x, lamp.y, 16, 0, Math.PI * 2);
      context.fill();

      if (lamp.lit) {
        context.fillStyle = PALETTE.lampBeam;
        context.beginPath();
        context.arc(lamp.x, lamp.y, 45, 0, Math.PI * 2);
        context.fill();
      }

      if (lamp.requiresMirror && !lamp.lit) {
        context.strokeStyle = PALETTE.mirror;
        context.lineWidth = 2;
        context.setLineDash([4, 4]);
        context.beginPath();
        context.arc(lamp.x, lamp.y, 24, 0, Math.PI * 2);
        context.stroke();
        context.setLineDash([]);
      }
    }

    // Draw wisps
    for (const w of state.wisps) {
      context.fillStyle = PALETTE.wisp;
      context.beginPath();
      context.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = PALETTE.wispGlow;
      context.lineWidth = 3;
      context.stroke();
    }

    // Draw moths
    for (const m of state.moths) {
      if (!m.alive) continue;
      context.fillStyle = PALETTE.mothGlow;
      context.beginPath();
      context.arc(m.x, m.y, 12, 0, Math.PI * 2);
      context.fill();

      context.fillStyle = PALETTE.moth;
      context.beginPath();
      context.arc(m.x, m.y, 4, 0, Math.PI * 2);
      context.fill();
    }
  }

  function drawHud(state) {
    context.textBaseline = 'top';
    const realmName = REALMS[state.realmIdx].name;
    text(`Night ${state.night} / 7 — ${realmName}`, 24, 20, 24, PALETTE.text, 'left');
    text(`Score ${state.score}`, FIELD.width / 2, 20, 24, PALETTE.text, 'center');
    
    let aliveMoths = 0;
    for (const m of state.moths) if (m.alive) aliveMoths++;
    text(`Moths ${aliveMoths}`, FIELD.width - 24, 20, 24, aliveMoths < 15 ? '#ef4444' : PALETTE.text, 'right');

    // Timer bar
    const barWidth = 300;
    const barX = (FIELD.width - barWidth) / 2;
    const progress = Math.max(0, state.timer / 50.0);
    context.fillStyle = 'rgba(255,255,255,0.15)';
    context.fillRect(barX, 58, barWidth, 6);
    context.fillStyle = PALETTE.accent;
    context.fillRect(barX, 58, barWidth * progress, 6);
  }

  function drawPanel(title, lines, prompt) {
    const width = 640;
    const height = 360;
    const x = (FIELD.width - width) / 2;
    const y = (FIELD.height - height) / 2;

    context.fillStyle = PALETTE.panel;
    context.fillRect(x, y, width, height);
    context.strokeStyle = PALETTE.accent;
    context.lineWidth = 2;
    context.strokeRect(x, y, width, height);

    context.textBaseline = 'alphabetic';
    text(title, FIELD.width / 2, y + 80, 48, PALETTE.text, 'center');
    for (let i = 0; i < lines.length; i++) {
      text(lines[i], FIELD.width / 2, y + 160 + i * 36, 24, PALETTE.muted, 'center');
    }
    text(prompt, FIELD.width / 2, y + height - 45, 24, PALETTE.accent, 'center');
  }

  function draw(state, screen, best) {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.fillStyle = PALETTE.backdrop;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);

    drawField(state);

    if (screen === 'title') {
      drawPanel('EMBERFLOCK', ['Seven Nights of Light', 'Guide the ember-moth swarm to light the lamps before dawn.', 'Move mouse/touch to steer · Space / click for burst.'], 'Press Space or Click to Start');
    } else if (screen === 'paused') {
      drawPanel('PAUSED', ['The night pauses for you.', 'Take a breath.'], 'Press P to Resume');
    } else if (screen === 'over') {
      drawPanel('NIGHT FALLS', [`Final Score: ${state.score}`, `Best Score: ${best}`], 'Press Space or Click to Try Again');
    } else if (screen === 'win') {
      drawPanel('DAWN BREAKS', [`All 7 Nights Illuminated!`, `Final Score: ${state.score}`], 'Press Space or Click to Play Again');
    } else {
      drawHud(state);
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw };
}
