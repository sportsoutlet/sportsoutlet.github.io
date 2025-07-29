import { execSync } from 'child_process';

const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/sportsoutlet/sportsoutlet.github.io.git`;

try {
  // Initialize repo if not already
  execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
} catch {
  console.log('🧱 Initializing new git repo...');
  execSync('git init');
  execSync('git branch -m main');
}

// Check if origin exists
let remotes = '';
try {
  remotes = execSync('git remote').toString();
} catch {}

if (!remotes.includes('origin')) {
  console.log('🔗 Adding origin remote...');
  execSync(`git remote add origin ${remoteUrl}`);
} else {
  execSync(`git remote set-url origin ${remoteUrl}`);
}

try {
  const output = execSync('git status --porcelain').toString();
  const dbChanged = output.split('\n').some(line => line.includes('recaps.db'));

  if (dbChanged) {
    console.log('📦 Changes detected in recaps.db. Committing and pushing...');
    execSync('git add recaps.db');
    execSync(`git commit -m "Auto-update recaps.db on ${new Date().toISOString()}"`);
    execSync('git push origin main');
  } else {
    console.log('✅ No changes to recaps.db. Skipping push.');
  }
} catch (err) {
  console.error('💥 Git error:', err.message);
}