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
  const strings = [];
  const placeholder = (index) => `__ELEVARE_STR_${index}__`;
  const protectedJs = js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/(["'])(?:\\.|(?!\1)[^\\\r\n])*\1/g, (match) => {
      const idx = strings.length;
      strings.push(match);
      return placeholder(idx);
    });

  return protectedJs
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}();,:])\s*/g, '$1')
    .replace(/__ELEVARE_STR_(\d+)__/g, (_, idx) => strings[Number(idx)])
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
