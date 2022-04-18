import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-word-hunt',
  templateUrl: './word-hunt.component.html',
  styleUrls: ['./word-hunt.component.scss']
})
export class WordHuntComponent implements OnInit {

  board:any | undefined;
  hiddenWords:string[] = ["Lottery","Lift","Movies","Museum","Musical",
  "Opera","Parking","Plane","Queue","Raffle",
  "Skiing","Speeding","Theatre","Train","Zoo",
  // "AmusementPark","ArtShow","Ballet","Baseball"
];
  // hiddenWords:string[] = ["Lottery","Lift","Movies","Museum","Musical"];
  
  gameThemeName = 'Got A Ticket'
  //Store the board metadata like position of Sateesh like row and col. inside keep the string index.
  directions: string[] = ['UP','DOWN','LEFT','RIGHT'];
  // directions: string[] = ['UP'];
  defaultFillingChar = '0'
  randamLetters: any;

  boardMetadata: number[][] = [];
  boardMetadataByName: string[]=[];
  row: number = 19;
  col: number = 11;
  fillingRow = 0;
  fillingCol = 0;

  constructor() { 
    this.board = Array(this.row).fill(null).map(()=>Array(this.col).fill(this.defaultFillingChar))
    this.generateBoard();
    let letters = this.hiddenWords.toString().toUpperCase().replace(/,/g,'')
    this.randamLetters = [...new Set(letters)];
    this.updateRandamLetters();

  }

  ngOnInit(): void {


  }

  generateBoard(): void {

    const startGameTimer = new Date()
    //TODO update this at the end of the solution verification 
    const endGameTimer = new Date();

    const solvedNames = [];
    let words = Object.assign([],this.hiddenWords);

    while(words.length){
      const delPos = this.getRandomNumber(words.length-1,0);
      var currentWord = words.splice(delPos,1)[0];
      let direction = this.directions[this.getRandomNumber(this.directions.length - 1, 0)];
      let filled = false;

      let retries = 10;

      console.log("Getting for "+ currentWord)
      while( filled !== true && retries > 0 ){
       
        let postion = this.getFillPostion(direction,currentWord);
        this.fillingRow = postion[0];
        this.fillingCol = postion[1];
        retries--;
        filled = this.fillingBoard(direction,postion[0],postion[1],currentWord);
        if ( filled !== false ){
          this.fillingRow++;
        }
        if ( retries != 9 )
        console.log("not getting postion for "+ currentWord)
      }
    }

  
    // Right 
    // Left
    // Up 
    // Down 
    // Left Diagonal 
    // Right Diagnal 
    //  
  }

  getFillPostion( direction:string, word: string): number[]{
    let row = this.getRandomNumber(this.row,0);
    let col = this.getRandomNumber(this.col,0);
    if ( this.fillingRow >= this.row )
      this.fillingRow = 0;
    if ( this.fillingCol >= this.col )
      this.fillingCol = 0;
      
    if ( row >= this.row) {
      row = 0;
    }

    if ( col >= this.col ) {
      col = 0;
    }

    if ( this.board[row][col] !== this.defaultFillingChar || !this.isSpaceAvalable(direction,row,col,word) )  
      return this.getFillPostion(direction, word)
    else {
      console.log("Got for "+ word + "Possiont ["+ row + " , " + col + " ]")
      return [row,col];
    }
      
  }

  isSpaceAvalable(direction:string, row: number,col: number,word: string): boolean {
    let allowed = true;
    let str = '';
    let wordLen = word.length;
    switch(direction) {
      case 'UP':
        for( var i =0; i<word.length; i++){
          if ( row-1 < 0 )
            return false;
          str += this.board[row--][col];
        }

        break;
      case 'DOWN': 
      for( var i =0; i<word.length; i++){
        if ( row+1 >= this.row )
            return false;
        str += this.board[row++][col];
      }
      break;
      case 'LEFT':
        for( var i =0; i<word.length; i++){
          if ( col - 1 < 0 )
            return false;
          str += this.board[row][col--];
        }
        break;
      case 'RIGHT':
        for( var i =0; i<word.length; i++){
          if ( col + 1 >= this.col )
            return false;
          str += this.board[row][col++];
        }
        break;
    }
    let uniqueStr = [...new Set(str.split(''))];
    if ( uniqueStr.length > 1  ) 
      return false;
    if ( uniqueStr.length === 1 && uniqueStr[0] !== this.defaultFillingChar ) {
      return false;
    }

    return allowed;
  }


  fillingBoard(direction:string, row: number, col: number, word: string):any {

    console.log("checking for "+ word + " ["+ row)
    if ( !this.checkBondries(direction, row,col, word))
      return false;

    this.fillWord(direction,row,col,word);
    return true;
  }

  checkBondries(direction:string, row: number,col: number,word: string): boolean {
    let allowed = true;
    let wordLen = word.length;
    switch(direction) {
      case 'UP':
        allowed = row - wordLen >= 0 ;
        break;
      case 'DOWN': 
        allowed = row + wordLen < this.row ;
        break;
      case 'LEFT':
        allowed = col - wordLen >= 0;
        break;
      case 'RIGHT':
        allowed = col + wordLen < this.col;
        break;
    }
    return allowed;
  }

  fillWord(direction:string, row: number,col: number,word: string){
    console.log("filling for "+ word + " ["+ row + " , "+ col + "]")
    word = word.toUpperCase();
    for ( var i = 0; i < word.length; i++) {
      switch(direction) {
        case 'UP':
          this.board[row--][col] = word[i];
          break;
        case 'DOWN': 
          this.board[row++][col] = word[i];
          break;
        case 'LEFT':
          this.board[row][col--] = word[i];
          break;
        case 'RIGHT':
          this.board[row][col++] = word[i];
          break;
      }
    }

  }

  updateRandamLetters(){
    for(let i =0; i< this.row; i++)
    for( let j=0; j< this.col; j++){
      if ( this.board[i][j] === this.defaultFillingChar)
      this.board[i][j]=this.randamLetters[this.getRandomNumber(this.randamLetters.length -1 , 0 )];
    }
  }

  verifyGame(): void {
    // Check all the name are found or not 

  }

  getRandomNumber (max: number,min: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

 
}
