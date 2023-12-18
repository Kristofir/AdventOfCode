/**
 * @url https://adventofcode.com/2023/day/2
 */

import path from 'path';
import fs from 'fs';


type Schematic = string[][]

interface SchematicNumber {
  value: number;
  row: number;
  start: number;
  end: number;
}



(function main() {
  console.log("Start")
  const schematicReader = new SchematicReader
  schematicReader.compileSchematicNumbers()

  const partNumbers = schematicReader.schematicNumbers
    .filter((schematicNumber) => {
      return schematicReader.searchAroundNumber(schematicNumber)
    })
    .map(partNumber => partNumber.value)

  console.log(partNumbers)

  let partnumberSum = 0
  partNumbers.forEach((partNumber) => { 
    partnumberSum += partNumber
  })

  console.log(`Part 1: ${partnumberSum}`)
})()



class SchematicReader {
  schematic: Schematic
  schematicNumbers: SchematicNumber[]

  constructor() {
    this.schematic = load()
    this.schematicNumbers = []
  }

  get maxWidth() : number {
    return this.schematic[0].length
  }

  get maxHeight() : number {
    return this.schematic.length
  }

  compileSchematicNumbers() {
    console.log("Compiling")
    for (let row = 0; row < this.maxHeight; row++) {
      let partialNumber = ""
      for (let col = 0; col < this.maxWidth; col++) {

        const char = this.schematic[row][col]
        const kind = classifyCell(char)

        if (kind == "NUMBER") {
          partialNumber += char
        }

        if (
          (kind != "NUMBER" ||
           col == this.maxWidth - 1) // reach end of column
          && partialNumber.length > 0) {
          const number = parseInt(partialNumber)
          const schematicNumber = {
            value: number,
            row: row,
            start: col - partialNumber.length,
            end: col
          }
          this.schematicNumbers.push(schematicNumber)

          partialNumber = ""
        }
        
      }
    }
  }

  /**
   * 
   * @param sNum 
   * @returns true if there is a symbol around the number
   */
  searchAroundNumber(sNum: SchematicNumber) : boolean {
    const searchParams = {
      row: {
        start: sNum.row - 1 > 0 ? sNum.row - 1 : 0,
        end: sNum.row + 1 < this.maxHeight ? sNum.row + 1 : sNum.row
      },
      col: {
        start: sNum.start - 1 > 0 ? sNum.start - 1 : 0,
        end: sNum.end < this.maxWidth ? sNum.end : sNum.end - 1
      }
    }

    for (let row = searchParams.row.start; row <= searchParams.row.end; row++) {
      for (let col = searchParams.col.start; col <= searchParams.col.end; col++) {
        const char = this.schematic[row][col]
        const kind = classifyCell(char)

        if (sNum.value == 21) {
          console.log(char)
        }

        if (kind == "SYMBOL") {
          return true
        }
      }
    }

    return false
  }
}



function load() : Schematic {
  const inputURL = path.join(process.cwd(), '2023', 'inputs', '3.txt')
  const input = fs.readFileSync(inputURL, 'utf8').split('\n')

  const schematic = input.map((line) => {
    return line.split('')
  })

  return schematic
}

function classifyCell(char : string) : "PERIOD" | "NUMBER" | "SYMBOL" {
  if (char === '.') {
    return "PERIOD"
  } else {
    const num = parseInt(char)
    if (num || num >= 0) {
      return "NUMBER"
    } else {
      return "SYMBOL"
    }
  }
}