import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-word-hunt',
  templateUrl: './word-hunt.component.html',
  styleUrls: ['./word-hunt.component.scss']
})
export class WordHuntComponent implements OnInit {

  board:any | undefined;
  foundCount : number = 0;
//   hiddenWords:string[] = ["Lottery","Lift","Movies","Museum","Musical",
//   "Opera","Parking","Plane","Queue","Raffle",
//   "Skiing","Speeding","Theatre","Train","Zoo",
//   // "AmusementPark","ArtShow","Ballet","Baseball"
// ];
  hiddenWords:string[] = ["Lottery","Lift","Movies","Museum","Musical"];
  // hiddenWords:string[] = ["Rupa","Roshan","Prabha","Sateesh","Malli"];
  
  gameThemeName = 'Got A Ticket'
  //Store the board metadata like position of Sateesh like row and col. inside keep the string index.
  directions: string[] = ['UP','DOWN','LEFT','RIGHT'];
  // directions: string[] = ['UP'];
  defaultFillingChar = '0'
  randamLetters: any;

  isHighLight: boolean = false;
  startGameTimer:any = '';
//TODO update this at the end of the solution verification 
  endGameDuration:number = 0;

  boardMetadata: number[][] = [];
  boardMetadataByName: string[]=[];
  solvedWords: string[] = [];
  row: number = 19;
  col: number = 11;
  fillingRow = 0;
  fillingCol = 0;
  completed: boolean = false;
  
  // Difficulty levels
  difficulty: string = 'medium';
  difficultyLevels = [
    { value: 'easy', label: 'Easy', rows: 12, cols: 8 },
    { value: 'medium', label: 'Medium', rows: 16, cols: 10 },
    { value: 'hard', label: 'Hard', rows: 20, cols: 14 }
  ];

  // Selection tracking
  isSelecting: boolean = false;
  selectedCells: Set<string> = new Set();
  solvedCells: Set<string> = new Set();
  selectionStartRow: number = -1;
  selectionStartCol: number = -1;
  selectionDirection: string | null = null;

  constructor() { 
    

  }

  ngOnInit(): void {


  }

  time: number = 0;
  timer: any = '';

  setDifficulty(level: string) {
    this.difficulty = level;
    const config = this.difficultyLevels.find(d => d.value === level);
    if (config) {
      this.row = config.rows;
      this.col = config.cols;
    }
    // Reset game if already started
    if (this.time > 0) {
      this.endGame();
    }
  }

  startGame(){
    this.completed = false;
    this.selectedCells.clear();
    this.solvedCells = new Set();
    this.isSelecting = false;
    this.foundCount = 0;
    
    // Set grid size based on difficulty
    const config = this.difficultyLevels.find(d => d.value === this.difficulty);
    if (config) {
      this.row = config.rows;
      this.col = config.cols;
    }
    this.board = Array(this.row).fill(null).map(()=>Array(this.col).fill(this.defaultFillingChar))
    this.generateBoard();
    let letters = this.hiddenWords.toString().toUpperCase().replace(/,/g,'')
    this.randamLetters = [...new Set(letters)];
    this.updateRandamLetters();
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

  generateBoard(): void {

   
    const solvedNames = [];
    let words  = Object.assign([],this.hiddenWords);
    this.solvedWords = Object.assign([],this.hiddenWords)

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
    if (this.selectedCells.size === 0) return;
    
    // Get selected letters in order
    const cells = Array.from(this.selectedCells).map(key => {
      const [row, col] = key.split('-').map(Number);
      return { row, col, letter: this.board[row][col] };
    });
    
    // Sort cells based on direction
    cells.sort((a, b) => {
      if (this.selectionDirection === 'horizontal') {
        return a.col - b.col;
      } else {
        return a.row - b.row;
      }
    });
    
    const word = cells.map(c => c.letter).join('');
    const wordReverse = word.split('').reverse().join('');
    
    console.log("Selected word:", word);
    
    let found: any[] = [];
    this.solvedWords.forEach((ele, index) => {
      const upperWord = ele.toUpperCase();
      if (upperWord === word || upperWord === wordReverse) {
        found.push(this.solvedWords.splice(index, 1)[0]);
      }
    });

    if (found.length) {
      console.log("Found word:", found[0]);
      
      // Mark cells as solved
      cells.forEach(cell => {
        const cellKey = `${cell.row}-${cell.col}`;
        if (!this.solvedCells) this.solvedCells = new Set();
        this.solvedCells.add(cellKey);
      });
      
      // Update word list UI
      const element = window.document.getElementById(found[0]);
      if (element) {
        element.classList.add("found");
      }
      
      this.foundCount = this.hiddenWords.length - this.solvedWords.length;
      
      // Check if all words found
      if (this.solvedWords.length === 0) {
        this.completed = true;
        this.endGame();
      }
    }
  }

  getRandomNumber (max: number,min: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  mouseDown(ele:any){
    const target = ele.target || ele.currentTarget;
    const rowIndex = target.getAttribute('data-row');
    const colIndex = target.getAttribute('data-col');
    
    if (rowIndex === null || colIndex === null) return;
    
    this.isSelecting = true;
    this.selectedCells.clear();
    this.selectionStartRow = parseInt(rowIndex);
    this.selectionStartCol = parseInt(colIndex);
    this.selectionDirection = null;
    
    const cellKey = `${rowIndex}-${colIndex}`;
    this.selectedCells.add(cellKey);
    
    console.log("Selection started at:", rowIndex, colIndex);
    ele.preventDefault();
    ele.stopPropagation();
  }

  mouseUp(ele: any){
    if (!this.isSelecting) return;
    
    console.log("Selection ended");
    this.verifyGame();
    
    // Clear selection
    this.selectedCells.clear();
    this.isSelecting = false;
    this.selectionDirection = null;
    
    ele.preventDefault();
    ele.stopPropagation();
  }

  getSelectedLetters(): any{
    let eles =  document.getElementsByClassName('highlight');
    console.log(eles);
    return eles;
  }
  
  removeElementsByClass(className:string){
    var elements = this.getSelectedLetters();

    for(var i=0; i<elements.length; i++){
      elements[i].classList.remove(className); 
    }

    // console.log(elements)

    // while(elements.length > 0){
    //     // elements[0].parentNode.removeChild(elements[0]);
    //     console.log(elements)
    // }
  }

  onMouseOver(ele:any){
    if (!this.isSelecting) return;
    
    const target = ele.target || ele.currentTarget;
    const rowIndex = parseInt(target.getAttribute('data-row'));
    const colIndex = parseInt(target.getAttribute('data-col'));
    
    if (isNaN(rowIndex) || isNaN(colIndex)) return;
    
    // Determine direction based on first move
    if (this.selectionDirection === null) {
      const rowDiff = rowIndex - this.selectionStartRow;
      const colDiff = colIndex - this.selectionStartCol;
      
      if (Math.abs(rowDiff) > Math.abs(colDiff)) {
        this.selectionDirection = 'vertical';
      } else if (Math.abs(colDiff) > Math.abs(rowDiff)) {
        this.selectionDirection = 'horizontal';
      }
    }
    
    // Only allow selection in the determined direction
    if (this.selectionDirection === 'horizontal' && rowIndex === this.selectionStartRow) {
      // Select all cells between start and current
      this.selectedCells.clear();
      const minCol = Math.min(this.selectionStartCol, colIndex);
      const maxCol = Math.max(this.selectionStartCol, colIndex);
      for (let c = minCol; c <= maxCol; c++) {
        this.selectedCells.add(`${this.selectionStartRow}-${c}`);
      }
    } else if (this.selectionDirection === 'vertical' && colIndex === this.selectionStartCol) {
      // Select all cells between start and current
      this.selectedCells.clear();
      const minRow = Math.min(this.selectionStartRow, rowIndex);
      const maxRow = Math.max(this.selectionStartRow, rowIndex);
      for (let r = minRow; r <= maxRow; r++) {
        this.selectedCells.add(`${r}-${this.selectionStartCol}`);
      }
    }
    
    ele.preventDefault();
    ele.stopPropagation();
  }

  isCellSolved(cell: string): boolean {
    if (cell === this.defaultFillingChar) {
      return false;
    }
    return this.solvedWords.some(word => word.toUpperCase().includes(cell));
  }

  isCellSelected(row: number, col: number): boolean {
    const cellKey = `${row}-${col}`;
    return this.selectedCells.has(cellKey);
  }

  isCellInSolvedWord(row: number, col: number): boolean {
    const cellKey = `${row}-${col}`;
    return this.solvedCells.has(cellKey);
  }
 
 
}
