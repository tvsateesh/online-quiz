import { Component, OnInit } from '@angular/core';
import { DictionaryService } from 'src/app/service/dictionary.service';
import { GameStatisticsService } from 'src/app/services/game-statistics.service';

// Interface for word with meaning
interface WordWithMeaning {
  word: string;
  meaning: string;
}

@Component({
  selector: 'app-word-hunt',
  templateUrl: './word-hunt.component.html',
  styleUrls: ['./word-hunt.component.scss']
})
export class WordHuntComponent implements OnInit {

  board:any | undefined;
  foundCount : number = 0;
  hiddenWords:string[] = [];
  wordsWithMeanings: WordWithMeaning[] = []; // Store words with their meanings
  
  gameThemeName = 'Word Hunt'
  //Store the board metadata like position of words like row and col. inside keep the string index.
  directions: string[] = ['UP','DOWN','LEFT','RIGHT'];
  defaultFillingChar = '0'
  randamLetters: any;

  isHighLight: boolean = false;
  startGameTimer:any = '';
//TODO update this at the end of the solution verification 
  endGameDuration:number = 0;

  boardMetadata: number[][] = [];
  boardMetadataByName: string[]=[];
  solvedWords: string[] = [];
  row: number = 10;
  col: number = 10;
  fillingRow = 0;
  fillingCol = 0;
  completed: boolean = false;
  
  // Difficulty levels - all set to 10x10
  difficulty: string = 'medium';
  difficultyLevels = [
    { value: 'easy', label: 'Easy (5 words)', rows: 10, cols: 10, wordCount: 5 },
    { value: 'medium', label: 'Medium (10 words)', rows: 10, cols: 10, wordCount: 10 },
    { value: 'hard', label: 'Hard (15 words)', rows: 10, cols: 10, wordCount: 15 }
  ];

  // Selection tracking
  isSelecting: boolean = false;
  selectedCells: Set<string> = new Set();
  solvedCells: Set<string> = new Set();
  selectionStartRow: number = -1;
  selectionStartCol: number = -1;
  selectionDirection: string | null = null;

  constructor(private dictionaryService: DictionaryService, private gameStatsService: GameStatisticsService) { 
    

  }

  ngOnInit(): void {
    // Load words from dictionary service
    this.loadWordsFromDictionary();
    // Load stats from database
    this.loadStats();
  }

  loadStats(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser?.id) {
      // Load word-hunt statistics from database
      this.gameStatsService.getGameStatistics(currentUser.id, 'word-hunt')
        .subscribe(
          (response: any) => {
            if (response.success && response.data) {
              const stats = response.data;
              console.log('Word Hunt stats loaded from DB:', stats);
            }
          },
          (error) => {
            console.error('Error loading word-hunt statistics:', error);
          }
        );
    }
  }

  loadWordsFromDictionary(): void {
    this.dictionaryService.getWords().subscribe((result: any) => {
      if (result) {
        const allWords = Object.keys(result);
        let filteredWords: string[] = [];
        
        // Filter words based on difficulty level
        if (this.difficulty === 'easy') {
          // Easy: Simple 3-4 letter words, common words
          filteredWords = allWords.filter(word => word.length >= 3 && word.length <= 4);
        } else if (this.difficulty === 'medium') {
          // Medium: 4-5 letter words
          filteredWords = allWords.filter(word => word.length >= 4 && word.length <= 5);
        } else if (this.difficulty === 'hard') {
          // Hard: 5-6 letter words, longer and more complex
          filteredWords = allWords.filter(word => word.length >= 5 && word.length <= 6);
        } else {
          // Default: 3-6 letter words
          filteredWords = allWords.filter(word => word.length >= 3 && word.length <= 6);
        }
        
        // Get word count based on difficulty
        const config = this.difficultyLevels.find(d => d.value === this.difficulty);
        const wordCount = config ? config.wordCount : 10;
        
        console.log(`Loading ${this.difficulty} words: filtered ${filteredWords.length} words from ${allWords.length} total`);
        
        // Randomly select words with their meanings
        const selectedWords = [];
        const selectedWordsWithMeanings: WordWithMeaning[] = [];
        const wordsCopy = [...filteredWords];
        for (let i = 0; i < wordCount && wordsCopy.length > 0; i++) {
          const randomIndex = Math.floor(Math.random() * wordsCopy.length);
          const word = wordsCopy.splice(randomIndex, 1)[0];
          const meaning = result[word] || 'No definition available';
          selectedWords.push(word.toUpperCase());
          selectedWordsWithMeanings.push({
            word: word.toUpperCase(),
            meaning: meaning
          });
        }
        
        this.hiddenWords = selectedWords;
        this.wordsWithMeanings = selectedWordsWithMeanings;
        console.log('Loaded words from dictionary:', this.hiddenWords);
        console.log('Words with meanings:', this.wordsWithMeanings);
      }
    });
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
    // Reload words for new difficulty
    this.loadWordsFromDictionary();
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
    
    // Ensure words are loaded before starting
    if (this.hiddenWords.length === 0) {
      console.log('Words not loaded yet, loading from dictionary...');
      this.dictionaryService.getWords().subscribe((result: any) => {
        if (result) {
          const allWords = Object.keys(result);
          let filteredWords: string[] = [];
          
          // Filter words based on difficulty level
          if (this.difficulty === 'easy') {
            filteredWords = allWords.filter(word => word.length >= 3 && word.length <= 4);
          } else if (this.difficulty === 'medium') {
            filteredWords = allWords.filter(word => word.length >= 4 && word.length <= 5);
          } else if (this.difficulty === 'hard') {
            filteredWords = allWords.filter(word => word.length >= 5 && word.length <= 6);
          } else {
            filteredWords = allWords.filter(word => word.length >= 3 && word.length <= 6);
          }
          
          const config = this.difficultyLevels.find(d => d.value === this.difficulty);
          const wordCount = config ? config.wordCount : 10;
          
          const selectedWords = [];
          const selectedWordsWithMeanings: WordWithMeaning[] = [];
          const wordsCopy = [...filteredWords];
          for (let i = 0; i < wordCount && wordsCopy.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * wordsCopy.length);
            const word = wordsCopy.splice(randomIndex, 1)[0];
            const meaning = result[word] || 'No definition available';
            selectedWords.push(word.toUpperCase());
            selectedWordsWithMeanings.push({
              word: word.toUpperCase(),
              meaning: meaning
            });
          }
          
          this.hiddenWords = selectedWords;
          this.wordsWithMeanings = selectedWordsWithMeanings;
          console.log('Words loaded for game:', this.hiddenWords);
          this.initializeGame();
        }
      });
    } else {
      console.log('Words already loaded, starting game with:', this.hiddenWords);
      this.initializeGame();
    }
  }

  private initializeGame(): void {
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
    console.log('Game initialized with', this.hiddenWords.length, 'words');
  }

  endGame(){
    let end:any = new Date();
    this.endGameDuration = Math.round(((end - this.startGameTimer)/1000)/60);
    clearInterval(this.timer);
    this.time = 0;

    // Save game statistics
    if (this.completed) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser.id) {
        // Calculate score based on words found and time taken
        const score = this.foundCount * 100; // 100 points per word found
        
        this.gameStatsService.saveGameStatistic({
          userId: currentUser.id,
          username: currentUser.username,
          gameName: 'word-hunt',
          score: score,
          time: this.endGameDuration * 60, // Convert minutes to seconds
          difficulty: this.difficulty,
          result: this.completed ? 'win' : 'loss'
        }).subscribe(
          (response) => {
            if (response.success) {
              console.log('Word Hunt statistics saved!');
            }
          },
          (error) => {
            console.error('Error saving Word Hunt statistics:', error);
          }
        );
      }
    }
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

  downloadPDF(): void {
    console.log('Download PDF button clicked');
    console.log('Board exists:', !!this.board);
    console.log('Hidden words count:', this.hiddenWords.length);
    
    // Check if board is initialized
    if (!this.board) {
      alert('Please start the game first to generate a board!');
      console.warn('Board not initialized for PDF download');
      return;
    }

    console.log('Starting PDF generation...');
    // Dynamic import of pdfMake
    Promise.all([
      import('pdfmake/build/pdfmake'),
      import('pdfmake/build/vfs_fonts')
    ]).then(([pdfMakeModule, vfsFontsModule]: any[]) => {
      try {
        const pdfMake = pdfMakeModule.default || pdfMakeModule;
        
        // Handle vfs fonts - different pdfmake versions export differently
        let vfs = null;
        if (vfsFontsModule.pdfMake && vfsFontsModule.pdfMake.vfs) {
          vfs = vfsFontsModule.pdfMake.vfs;
        } else if (vfsFontsModule.default && vfsFontsModule.default.pdfMake && vfsFontsModule.default.pdfMake.vfs) {
          vfs = vfsFontsModule.default.pdfMake.vfs;
        } else if (vfsFontsModule.vfs) {
          vfs = vfsFontsModule.vfs;
        } else {
          console.warn('VFS fonts not found, continuing without custom fonts');
        }
        
        if (vfs) {
          pdfMake.vfs = vfs;
          console.log('pdfMake VFS configured');
        }

        // Create table for the grid
        const gridTable: any[] = [];
        if (this.board && this.board.length > 0) {
          for (let i = 0; i < this.board.length; i++) {
            const rowData: any[] = [];
            for (let j = 0; j < this.board[i].length; j++) {
              const cellLetter = this.board[i][j] || '';
              rowData.push({
                text: cellLetter,
                alignment: 'center',
                style: this.solvedCells.has(`${i}-${j}`) ? 'solvedCell' : 'gridCell'
              });
            }
            gridTable.push(rowData);
          }
        }
        console.log('Grid table created with', gridTable.length, 'rows');

        // Create words list
        const wordsList = this.hiddenWords.map(word => ({
          text: word.toUpperCase(),
          style: 'wordItem'
        }));

        // Determine status
        const status = this.completed ? 'COMPLETED ✓' : `IN PROGRESS (${this.foundCount}/${this.hiddenWords.length} found)`;
        const statusStyle = this.completed ? 'completedStatus' : 'inProgressStatus';

        const docDefinition: any = {
          content: [
            {
              text: 'Word Hunt Game',
              style: 'header',
              alignment: 'center'
            },
            {
              text: `Grid: ${this.row}x${this.col}`,
              alignment: 'center',
              style: 'subheader'
            },
            {
              text: `Status: ${status}`,
              alignment: 'center',
              style: statusStyle,
              margin: [0, 10, 0, 20]
            },
            {
              text: 'Word Search Grid',
              style: 'sectionHeader',
              margin: [0, 10, 0, 10]
            },
            {
              table: {
                headerRows: 0,
                widths: Array(this.col).fill('*'),
                body: gridTable
              },
              style: 'gridTable',
              margin: [0, 0, 0, 20]
            },
            {
              text: 'Hidden Words to Find',
              style: 'sectionHeader',
              margin: [0, 10, 0, 10]
            },
            {
              ul: wordsList,
              style: 'wordsList',
              margin: [20, 0, 0, 0]
            },
            {
              text: `Time Taken: ${this.endGameDuration} minutes`,
              style: 'footerText',
              margin: [0, 20, 0, 0]
            }
          ],
          styles: {
            header: {
              fontSize: 24,
              bold: true,
              color: '#2c3e50'
            },
            subheader: {
              fontSize: 14,
              color: '#34495e'
            },
            sectionHeader: {
              fontSize: 14,
              bold: true,
              color: '#2c3e50'
            },
            gridCell: {
              fontSize: 9,
              border: [1, 1, 1, 1],
              borderColor: '#bdc3c7',
              padding: 4
            },
            solvedCell: {
              fontSize: 9,
              bold: true,
              border: [1, 1, 1, 1],
              borderColor: '#27ae60',
              fillColor: '#d5f4e6',
              padding: 4
            },
            gridTable: {
              alignment: 'center'
            },
            wordItem: {
              fontSize: 11
            },
            wordsList: {
              fontSize: 11
            },
            completedStatus: {
              fontSize: 12,
              bold: true,
              color: '#27ae60'
            },
            inProgressStatus: {
              fontSize: 12,
              bold: true,
              color: '#f39c12'
            },
            footerText: {
              fontSize: 10,
              color: '#7f8c8d'
            }
          },
          pageMargins: [40, 40, 40, 40]
        };

        console.log('PDF document definition created');
        pdfMake.createPdf(docDefinition).download(`WordHunt_${new Date().getTime()}.pdf`);
        console.log('PDF download initiated');
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    }).catch((error: any) => {
      console.error('Error loading PDF libraries:', error);
      alert('Error loading PDF library. Please refresh the page and try again.');
    });
  }
 
 
}
