/**
 * @url https://adventofcode.com/2023/day/2
 */

import path from 'path';
import fs from 'fs';


interface Game {
  id: number;
  rounds: GameRound[];
}

interface GameRound {
  red: number;
  green: number;
  blue: number;
}

(function main() {
  console.log("Start")
  const cubeGame = new CubeGame()
  const passedGames = cubeGame.check({ red: 12, green: 13, blue: 14 })

  const passedGameIds = passedGames.map((game) => game.id)
  let passedGameIdSum = 0
  passedGameIds.forEach((id) => {
    passedGameIdSum += id
  })

  console.log(`Part 1: ${passedGameIdSum}`)
})()



class CubeGame {
  games: Game[] = []

  constructor() {
    this.games = loadGames()
  }

  check(counts: { red: number, green: number, blue: number}) : Game[] {
    const passedGames = this.games.filter((game) => {
      
      const rounds = game.rounds.map((round) => {
        const condition = round.red <= counts.red && round.green <= counts.green && round.blue <= counts.blue

        return condition ? true : false
      })

      return rounds.every((round) => round)
    })

    return passedGames
  }
}



function loadGames() : Game[] {
  const inputURL = path.join(process.cwd(), '2023', 'inputs', '2.txt')
  const input = fs.readFileSync(inputURL, 'utf8').split('\n')

  const games: Game[] = []

  for (const line of input) {

    const id = parseInt(line.split(": ")[0].split(" ")[1])

    const game = {
      id: id,
      rounds: []
    } as Game

    const rounds = line.split(": ")[1].split("; ").map((round) => {
      return round.split(", ")
    })

    for (const round of rounds) {
      const gameRound = {
        red: 0,
        green: 0,
        blue: 0
      }

      for (const color of round) {
        const colorComponents = color.split(" ")
        const colorName = colorComponents[1] as keyof GameRound
        const colorCount = parseInt(colorComponents[0])

        gameRound[colorName] = colorCount
      }

      game.rounds.push(gameRound)
    }

    games.push(game)
  }

  return games
}