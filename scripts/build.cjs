const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Render Full-Stack Build...');

try {
  console.log('📦 Step 1: Building Frontend Assets (Vite)...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('📦 Step 2: Installing Server Dependencies...');
  const serverDir = path.join(__dirname, '..', 'server');
  execSync('npm install --production', { 
    cwd: serverDir, 
    stdio: 'inherit', 
    env: Object.assign({}, process.env, { PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true' }) 
  });

  console.log('✅ Render Full-Stack Build Completed Successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
