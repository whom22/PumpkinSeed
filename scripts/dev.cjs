const { spawn } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const children = ['trick-or-treat-map', 'ghost-story-relay'].map((app) => {
  const cwd = path.join(root, 'apps', app);
  return spawn(process.execPath, [path.join(cwd, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--strictPort'], { cwd, stdio: 'inherit' });
});
const stop = () => children.forEach((child) => child.kill());
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
children.forEach((child) => child.on('exit', (code) => { if (code) { stop(); process.exitCode = code; } }));
console.log('Local demo only. Open http://127.0.0.1:5173 and http://127.0.0.1:5174. Press Ctrl+C to stop.');

