import { execSync } from 'child_process';
const remoteUrl = `https://${process.env.GITHUB_TOKEN}@github.com/sportsoutlet/sportsoutlet.github.io.git`;



try {
  // Check if recaps.db has uncommitted changes
  execSync(`git remote set-url origin ${remoteUrl}`);
  const output = execSync('git status --porcelain').toString();

  const dbChanged = output.split('\n').some(line => line.includes('recaps.db'));

  if (dbChanged) {
    console.log('📦 Changes detected in recaps.db. Committing and pushing...');
    execSync('git add recaps.db');
    execSync(`git commit -m "Auto-update recaps.db on ${new Date().toISOString()}"`);
    execSync('git push origin main');
  } else {
    // console.log('✅ No changes to recaps.db. Skipping push.');
  }
} catch (err) {
  console.error('💥 Git error:', err.message);
}