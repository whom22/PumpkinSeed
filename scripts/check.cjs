const { spawnSync } = require('node:child_process');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const tsc = require.resolve('typescript/bin/tsc');
const run = (args, cwd = root) => {
  const result = spawnSync(process.execPath, args, { cwd, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
};
for (const pkg of ['template', 'apps/trick-or-treat-map', 'apps/ghost-story-relay']) {
  console.log('\nTypecheck:', pkg);
  run([tsc, '-p', path.join(pkg, 'tsconfig.json'), '--noEmit']);
}
run(['--test', 'scripts/core.test.cjs']);
if (!process.argv.includes('--no-build')) {
  for (const app of ['trick-or-treat-map', 'ghost-story-relay']) {
    const cwd = path.join(root, 'apps', app);
    console.log('\nProduction build:', app);
    run([path.join(cwd, 'node_modules/vite/bin/vite.js'), 'build'], cwd);
  }
}

