/**
 * @url https://adventofcode.com/2023/day/1
 */

import path from 'path';
import fs from 'fs';

const inputURL = path.join(process.cwd(), '2023', 'inputs', '1.txt')
const input = fs.readFileSync(inputURL, 'utf8')

const lines = input.split('\n')

let subtotal = 0;

for (const line of lines) {
  const reg = /[0-9]/g;
  const matches = line.match(reg)?.map(n => parseInt(n));

  if (matches && matches.length > 0) {
    const firstDigit = matches[0];
    const secondDigit = matches[matches.length - 1];
  
    const calibrationSubvalue = firstDigit*10 + secondDigit;
    subtotal += calibrationSubvalue;
  }
}

console.log(`Total: ${subtotal}`)