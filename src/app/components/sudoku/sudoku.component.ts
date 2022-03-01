import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {

  board: any = [];
  constructor() { 
    this.board = new Array(9).fill(new Array(9).fill(1));
    // this.board = new Array(9).fill(new Array(9).fill(0).map((i,index) => {
    //   return ((count + index) % 9);
    // }));
    for(let row=0; row < 9; row++){      
      for(let col =0; col< 9; col++) {        
      }
    }
    console.log(this.board);
  }

  ngOnInit(): void {
  }

}
