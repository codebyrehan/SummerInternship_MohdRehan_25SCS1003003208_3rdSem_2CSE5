const { execSync } = require('child_process');
const path = require('path');

const root = path.join(__dirname, '..');
const serverDir = path.join(__dirname, '..', 'server');
const env = Object.assign({}, process.env, {
  PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
  PUPPETEER_SKIP_DOWNLOAD: 'true'
});

console.log('🚀 Starting Render Full-Stack Build...');

try {
  console.log('📦 Step 1: Installing root dependencies...');
  execSync('npm install', { cwd: root, stdio: 'inherit', env });

  console.log('📦 Step 2: Building Frontend Assets (Vite)...');
  execSync('npm run build', { cwd: root, stdio: 'inherit', env });

  console.log('📦 Step 3: Installing Server dependencies...');
  execSync('npm install', { cwd: serverDir, stdio: 'inherit', env });

  console.log('✅ Render Full-Stack Build Completed Successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
