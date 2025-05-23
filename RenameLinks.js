const fs = require('fs');
const path = require('path');

// Adjust these paths as needed
const inputFile = 'input.user.js';  // Your original file
const outputFile = 'output.user.js'; // Where the modified content goes

const baseGitHubUrl = 'https://github.com/Monshi10x/TamperScript/raw/main/';
const baseLocalPath = 'file://C:\\Users\\Tristan PC\\Documents\\TamperScript\\';

// Read the input file
const content = fs.readFileSync(inputFile, 'utf8');

// Replace only the matching GitHub links
const replaced = content.replace(
      new RegExp(baseGitHubUrl.replace(/\//g, '\\/'), 'g'),
      baseLocalPath
).replace(
      /file:\/\/C:\\Users\\Tristan PC\\Documents\\TamperScript\\[^\s]+/g,
      (match) => match.replace(/\//g, '\\')
);

// Write to output file
fs.writeFileSync(outputFile, replaced, 'utf8');

console.log(`✅ Links replaced. Output saved to: ${outputFile}`);