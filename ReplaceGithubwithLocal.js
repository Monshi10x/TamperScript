const fs = require('fs');
const path = require('path');

// e.g. node script.js work
// Command-line argument: 'work' or 'home'
const mode = process.argv[2];

if(!mode || !['work', 'home'].includes(mode)) {
      console.error("❌ Please specify 'work' or 'home' as an argument.");
      process.exit(1);
}

// Paths
const inputFile = 'TamperStartDesign.js';
const outputFile = 'TamperStartDesign_Work.js';

const baseGitHubUrl = 'https://github.com/Monshi10x/TamperScript/raw/main/';
const baseLocalPath_Work = 'file://C:\\Users\\Tristan PC\\Documents\\TamperScript\\';
const baseLocalPath_Home = 'file://C:\\Users\\monsh\\Documents\\TamperScript\\';

const baseLocalPath = mode === 'work' ? baseLocalPath_Work : baseLocalPath_Home;

// Read and replace
const content = fs.readFileSync(inputFile, 'utf8');

const replaced = content.replace(
      new RegExp(baseGitHubUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
      baseLocalPath
).replace(
      /file:\/\/[^\s]+/g,
      (match) => match.replace(/\//g, '\\')
);

// Output
fs.writeFileSync(outputFile, replaced, 'utf8');
console.log(`✅ Links replaced using ${mode.toUpperCase()} path. Output saved to: ${outputFile}`);
