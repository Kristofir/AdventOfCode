/**
 * @url https://adventofcode.com/2023/day/1
 */

import path from 'path';
import fs from 'fs';

const inputURL = path.join(process.cwd(), '2023', 'inputs', '1.txt')
const input = fs.readFileSync(inputURL, 'utf8')

const digitMap = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four' : 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9
} as Record<string, number>

function parseNumber(str: string): number {
  return str.length == 1 ? parseInt(str) : digitMap[str]
}


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

console.log(`Part 1 Total: ${subtotal}`)

let part2Subtotal = 0;

for (let line of lines) {
  console.log(line)
  const regex = new RegExp("(?=([0-9]|one|two|three|four|five|six|seven|eight|nine))", "g")

  const matches = function (text = line) {
    let matches = []
    let match
    while ((match = regex.exec(text)) != null) {
      matches.push(match[1])
      regex.lastIndex++
    }
    return matches.map(n => parseNumber(n))
  }();

  if (matches && matches.length > 0) {
    const firstDigit = matches[0];
    const secondDigit = matches[matches.length - 1];

    const calibrationSubvalue = firstDigit * 10 + secondDigit;
    part2Subtotal += calibrationSubvalue;
  } else {
    console.log('no matches')
  
  }
}

console.log(`Part 2 Total: ${part2Subtotal}`)