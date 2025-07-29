import { saveRecap } from './saveRecap.js';
import generateRecap from './generateRecap.js';
import { sports } from './sports.js'
import { exec } from 'child_process';


const successFulRecapTimeout = 1000 * 60 * 1; // 1 minute
const unsuccessFulRecapTimeout = 1000 * 60 * 1; // 30 seconds
const errorTimeout = 1000 * 60 * 1; // 5 minutes




function discrepancyCalculator(str1, str2) {
  const normalize = (str) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/);

  const words1 = normalize(str1);
  const words2 = normalize(str2);

  let matchCount = 0;
  const words2Copy = [...words2];

  for (let word of words1) {
    const index = words2Copy.indexOf(word);
    if (index !== -1) {
      matchCount++;
      words2Copy.splice(index, 1);
    }
  }

  const avgLength = (words1.length + words2.length) / 2;
  const percentage = (matchCount / avgLength) * 100;

  // Inverted result
  return (100 - percentage).toFixed(2) + '%';
}


let lastPush = Date.now();
const minInterval = 60 * 1000 * 2; // 2 minute

export default async function runRecapGenerator() {
  while (true) {
    for (const sport of sports) {
      for (const team of sport.teams) {
        try {
          const recap = await generateRecap(team.back, sport.back);
          if (recap && recap.id) {
            saveRecap(recap);
            const discrepancy = discrepancyCalculator(team.back, recap.teamName);
            if (discrepancy !== '0.00%') {
              console.log('\x1b[31m%s\x1b[0m', `⚠️ Discrepancy detected for ${team.back}: ${discrepancy}`);
              console.log(`${team.back} compared to ${recap.teamName}`);
            }
            console.log(`✅ Recap saved for ${recap.teamName}: ${recap.title}`);
            await new Promise(resolve => setTimeout(resolve, successFulRecapTimeout));
          } else {
            // console.debug(`No recap generated for ${team.back}, skipping...`);
            await new Promise(resolve => setTimeout(resolve, unsuccessFulRecapTimeout));
          }

          if (Date.now() - lastPush > minInterval) {
            lastPush = Date.now();
            exec('node ./pushDbIfChanged.js', (err, stdout, stderr) => {
              if (err) {
                console.error('Push script error:', err.message);
                return;
              }
              if (stderr) console.error(stderr);
              if (stdout) console.log(stdout);
            });
          }

        } catch (err) {
          console.error(`💥 Error with team ${team.back}:`, err.message);
          await new Promise(resolve => setTimeout(resolve, errorTimeout)); // backoff on error
        }
      }
    }

    // console.log('🔁 Finished full cycle of all teams. Restarting in 1 minute...');
    await new Promise(resolve => setTimeout(resolve, 1 * 60 * 1000)); // wait 5 min between cycles
  }
}


