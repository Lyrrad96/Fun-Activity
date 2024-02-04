import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-rpsls',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rpsls.component.html',
  styleUrl: './rpsls.component.scss'
})
export class RpslsComponent {
  imgArray = ["rock","paper","scissors","lizard","spock"]

  playerChoice = this.imgArray[0]
  opponentChoice = this.imgArray[0]
  result: string | boolean = ''
  pScore = 0
  oScore = 0

  interactionObject = {
    'rock': ['scissors', 'lizard'],
    'scissors': ['lizard', 'paper'],
    'lizard': ['paper', 'spock'],
    'paper': ['spock', 'rock'],
    'spock': ['scissors', 'rock'],
  }

  bot = (arr: any) => {
    return arr[Math.trunc(Math.random() * 5)]
  }

  selection = (img: any) => {
    this.playerChoice = img
    this.opponentChoice = this.bot(this.imgArray)
    this.result = this.calculate(this.playerChoice, this.opponentChoice)
    console.log(this.playerChoice, this.opponentChoice, this.result, this.pScore, this.oScore)
  }

  calculate(p1: string, p2: string) {
    // console.log(p1, p2)
    if(p1 == p2)
      return 'draw'
    else if (this.interactionObject[p1 as keyof typeof this.interactionObject].includes(p2)) {
      this.pScore++
      return 'player wins'
    }
    else {
      this.oScore++
      return 'bot wins'
    }
  }
}
