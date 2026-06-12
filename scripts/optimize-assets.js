#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function minifyCss(css) {
  return css
    .replace(/\/\*![\s\S]*?\*\//g, (match) => match)
    .replace(/\/\*(?![!])[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,>+~])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

function minifyJs(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:])\s*/g, '$1')
    .trim();
}

const outputs = [
  ['css/styles.css', 'css/styles.min.css', minifyCss],
  ['js/custom.js', 'js/custom.min.js', minifyJs],
];

for (const [src, dest, fn] of outputs) {
  const input = fs.readFileSync(path.join(process.cwd(), src), 'utf8');
  const output = fn(input);
  fs.writeFileSync(path.join(process.cwd(), dest), output + '\n');
  const saved = Buffer.byteLength(input) - Buffer.byteLength(output);
  console.log(`${dest}: saved ${saved} bytes`);
}
