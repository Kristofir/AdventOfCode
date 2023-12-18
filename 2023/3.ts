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

interface Gear {
  values: number[];
  row: number;
  col: number;
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

  // Part 2

  schematicReader.compileGears()

  let gearRatioSum = 0
  schematicReader.gears.forEach((gear) => {
    const gearRatio = gear.values[0] * gear.values[1]
    gearRatioSum += gearRatio
  })

  console.log(`Part 2: ${gearRatioSum}`)
})()



class SchematicReader {
  schematic: Schematic
  schematicNumbers: SchematicNumber[]
  gears: Gear[]

  constructor() {
    this.schematic = load()
    this.schematicNumbers = []
    this.gears = []
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

  compileGears() {
    for (let row = 0; row < this.maxHeight; row++) {
      for (let col = 0; col < this.maxWidth; col++) {
        const char = this.schematic[row][col]

        if (char === "*") {
          const gear = {
            values: this.findAdjacentNumbers({row: row, col: col}),
            row: row,
            col: col
          }

          if (gear.values.length == 2) {
            this.gears.push(gear)
          } else {
            continue
          }

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

  findAdjacentNumbers(position = {row: number, col: number}) : number[] {
    const adjs = this.schematicNumbers.filter((sNum) => {
      const rowAdjacency = Math.abs(sNum.row - position.row) <= 1 ? true : false

      const left = sNum.start - 1
      const right = sNum.end
      const colAdjacency = left <= position.col && position.col <= right ? true : false

      return rowAdjacency && colAdjacency
    })

    const adjValues = adjs.map((adj) => adj.value)

    return adjValues
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