import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const shots = [
  { name: '1-start.jpg', query: '?shot=start&seed=1' },
  { name: '2-play.jpg', query: '?shot=play&seed=1' },
  { name: '3-beacon.jpg', query: '?shot=beacon&seed=1' },
  { name: '4-end.jpg', query: '?shot=end&seed=1' },
];

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Start static server
  const server = spawn('node', ['serve.ts'], { stdio: 'ignore' });
  await sleep(1000);

  // Start chrome with remote debugging
  const chrome = spawn('/opt/meta-chromium/chrome', [
    '--headless',
    '--disable-gpu',
    '--no-sandbox',
    '--remote-debugging-port=9222',
    '--window-size=1280,720',
  ], { stdio: 'ignore' });
  await sleep(1500);

  try {
    for (const shot of shots) {
      const url = `http://localhost:8080/${shot.query}`;
      
      // Create new target / page
      const resp = await fetch(`http://localhost:9222/json/new?${url}`);
      const target = await resp.json();
      const wsUrl = target.webSocketDebuggerUrl;

      if (!wsUrl) {
        console.error(`Failed to get debugger URL for ${shot.name}`);
        continue;
      }

      const ws = new WebSocket(wsUrl);
      await new Promise((resolve) => ws.addEventListener('open', resolve));

      // Wait for __shotReady
      let ready = false;
      for (let attempt = 0; attempt < 50; attempt++) {
        ws.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression: 'window.__shotReady === true' } }));
        const result = await new Promise((resolve) => {
          const handler = (event) => {
            const data = JSON.parse(event.data);
            if (data.id === 1) {
              ws.removeEventListener('message', handler);
              resolve(data.result?.result?.value);
            }
          };
          ws.addEventListener('message', handler);
        });
        if (result === true) {
          ready = true;
          break;
        }
        await sleep(100);
      }

      if (!ready) {
        console.warn(`Timeout waiting for __shotReady on ${shot.name}, capturing anyway.`);
      }

      // Capture screenshot
      ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'jpeg', quality: 90 } }));
      const screenshotData = await new Promise((resolve) => {
        const handler = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === 2) {
            ws.removeEventListener('message', handler);
            resolve(data.result?.data);
          }
        };
        ws.addEventListener('message', handler);
      });

      ws.close();

      if (screenshotData) {
        const buffer = Buffer.from(screenshotData, 'base64');
        writeFileSync(join('screenshots', shot.name), buffer);
        console.log(`Captured ${shot.name} (${buffer.length} bytes)`);
      } else {
        console.error(`Failed to capture ${shot.name}`);
      }
    }
  } finally {
    chrome.kill();
    server.kill();
  }
}

main().catch(console.error);
