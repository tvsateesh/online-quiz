import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-odd-man-out',
  templateUrl: './odd-man-out.component.html',
  styleUrls: ['./odd-man-out.component.scss']
})
export class OddManOutComponent implements OnInit {

  startGameTimer: any = null;
  time: number = 0;
  timer: any = '';

  board: any;
  row: number = 20;
  col: number = 20;
  defaultFillingList:any = undefined;
  completed: boolean = false;
  foundCount = 0;
  fillingNumbers: string[] = [];
  randamNumber:string = '';
  totalHiddenNumbers: number = 10;
  endGameDuration: number = 0;

  constructor() {
    this.defaultFillingList = {
      "606": ["680","906","609","909","666"],
      "909" :["606","989","808","099"],
      "888" : ["808","898","989","999","666"]
    };
    this.fillingNumbers = Object.keys(this.defaultFillingList);
    
  }

  startGame(){
    this.completed = false;
    this.randamNumber = this.fillingNumbers[this.getRandomNumber(this.fillingNumbers.length - 1 , 0 )];
    this.board = Array(this.row).fill(null).map(()=>Array(this.col).fill(this.randamNumber));
    this.generateBoard();
    let that = this;
    this.startGameTimer = new Date();
    this.timer = setInterval(function(){
      that.time++;
    },1000)
  }

  endGame(){
    let end:any = new Date();
    this.endGameDuration = Math.round(((end - this.startGameTimer)/1000)/60);
    clearInterval(this.timer);
    this.time = 0;
  }


  generateBoard(){
    
    let similarNumerbs:any[] = this.defaultFillingList[this.randamNumber];
    for(let i=0; i<this.totalHiddenNumbers; i++){
      let row = this.getRandomNumber(this.row-1,0);
      let col = this.getRandomNumber(this.col-1,0);
      let randNo = this.getRandomNumber(similarNumerbs.length - 1 , 0);
      this.board[row][col] = this.defaultFillingList[this.randamNumber][randNo];
    }
  }

  ngOnInit(): void {
  }

  getRandomNumber (max: number,min: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  verifyValue(ele: any) {

    if ( ele.target.innerText !== this.randamNumber) {
      ele.target.classList.add("done");
      this.foundCount++;
      if ( this.foundCount === this.totalHiddenNumbers) {
        this.completed = true;
        this.endGame();
      }
    }

  }



}
