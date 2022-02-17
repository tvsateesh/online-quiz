import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dice-game',
  templateUrl: './dice-game.component.html',
  styleUrls: ['./dice-game.component.scss']
})
export class DiceGameComponent implements OnInit {

  totalDices: number = 6;
  dices: any[] = [];
  currentDicesNumberCount: number = 0;
  winner : boolean= false;
  lost: boolean= false;
  users: any[] = [];
  username: string = '';
  errorMsg: string = '';
  constructor() {
    this.users = JSON.parse(localStorage.getItem('userdetails') || "[]");
    this.sortUserByScore();
  }

  ngOnInit(): void {

  }

  createDices(){
    if ( this.username === '') {
      this.errorMsg = 'Please enter the username';
      return;
    }

    if( this.currentDicesNumberCount >= 100 ){
      this.errorMsg = 'Game over, please restart the game';
      return;
    }
    this.dices = new Array(this.totalDices).fill({
      number:0
    });
    this.dices = this.dices.map( dice => {
      return { number : this.createRandom()}
    });
    let total = this.dices.reduce( (total, diceNumber) => {
      console.log(total);
      return total + diceNumber.number;
    },0);
    this.validate(total);
  }

  validate(total: number){
    if ( this.dices.filter(dice => dice.number === 1).length === 3 ) {
      this.lost = true;
      this.currentDicesNumberCount = 0;
      // this.winner = false;
      // this.updateUserScore();
      //this.errorMsg = ''
    }else {
      this.lost = false;
      this.currentDicesNumberCount = this.currentDicesNumberCount + total;
    }
    if ( this.currentDicesNumberCount >= 100){
        this.winner = true;
        this.lost = false;
        this.updateUserScore();
    }
  }

  updateUserScore() {
    this.users.push({
      username: this.username,
      score: this.currentDicesNumberCount
    });
    localStorage.setItem('userdetails',JSON.stringify(this.users));
    this.sortUserByScore()
    this.errorMsg ='';
  }

  sortUserByScore(){
    this.users = this.users.sort(( A, B ) => B.score - A.score  );
  }

  restartGame() {
    this.winner = false;
    this.lost = false;
    this.currentDicesNumberCount = 0;
    this.dices = [];
    this.errorMsg ='';
  }

  randomIntFromInterval(min: number, max:number) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  createRandom(){
    return Math.floor(Math.random() * 6) + 1
  }

  // Player A
  // [1][1][1] = 0
  // Continues dices with count of 100 wins




}
