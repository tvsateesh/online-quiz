import { Component, OnInit } from '@angular/core';

interface Cell {
  value: number;
  isFixed: boolean;
  isHighlighted: boolean;
  isError: boolean;
}

@Component({
  selector: 'app-sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {
  board: Cell[][] = [];
  solution: number[][] = [];
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  selectedCell: { row: number, col: number } | null = null;
  timer = 0;
  timerInterval: any;
  isGameComplete = false;
  mistakes = 0;
  maxMistakes = 3;
  hintsRemaining = 3;

  difficultySettings = {
    easy: 40,    // cells to remove
    medium: 50,
    hard: 60
  };

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  newGame(): void {
    this.isGameComplete = false;
    this.mistakes = 0;
    this.hintsRemaining = 3;
    this.timer = 0;
    this.selectedCell = null;
    
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    // Generate a complete Sudoku solution
    this.solution = this.generateCompleteSudoku();
    
    // Create the puzzle by removing cells
    this.board = this.createPuzzle(this.solution, this.difficultySettings[this.difficulty]);
    
    // Start timer
    this.timerInterval = setInterval(() => {
      this.timer++;
    }, 1000);
  }

  generateCompleteSudoku(): number[][] {
    const board: number[][] = Array(9).fill(0).map(() => Array(9).fill(0));
    this.fillBoard(board);
    return board;
  }

  fillBoard(board: number[][]): boolean {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (this.isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              if (this.fillBoard(board)) {
                return true;
              }
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isValidPlacement(board: number[][], row: number, col: number, num: number): boolean {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num) return false;
      }
    }

    return true;
  }

  createPuzzle(solution: number[][], cellsToRemove: number): Cell[][] {
    const puzzle: Cell[][] = Array(9).fill(0).map(() => 
      Array(9).fill(0).map(() => ({ 
        value: 0, 
        isFixed: false, 
        isHighlighted: false,
        isError: false 
      }))
    );

    // Copy solution to puzzle
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        puzzle[i][j].value = solution[i][j];
        puzzle[i][j].isFixed = true;
      }
    }

    // Remove cells randomly
    let removed = 0;
    while (removed < cellsToRemove) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzle[row][col].isFixed && puzzle[row][col].value !== 0) {
        puzzle[row][col].value = 0;
        puzzle[row][col].isFixed = false;
        removed++;
      }
    }

    return puzzle;
  }

  shuffleArray(array: number[]): number[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  selectCell(row: number, col: number): void {
    if (this.board[row][col].isFixed || this.isGameComplete) return;
    
    // Clear previous highlights
    this.board.forEach(r => r.forEach(c => c.isHighlighted = false));
    
    this.selectedCell = { row, col };
    this.board[row][col].isHighlighted = true;
    
    // Highlight same row, column, and box
    for (let i = 0; i < 9; i++) {
      this.board[row][i].isHighlighted = true;
      this.board[i][col].isHighlighted = true;
    }
    
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        this.board[boxRow + i][boxCol + j].isHighlighted = true;
      }
    }
  }

  enterNumber(num: number): void {
    if (!this.selectedCell || this.isGameComplete) return;
    
    const { row, col } = this.selectedCell;
    const cell = this.board[row][col];
    
    if (cell.isFixed) return;
    
    cell.value = num;
    cell.isError = false;
    
    // Check if the number is correct
    if (this.solution[row][col] !== num) {
      cell.isError = true;
      this.mistakes++;
      
      if (this.mistakes >= this.maxMistakes) {
        this.gameOver();
      }
    } else {
      // Check if puzzle is complete
      this.checkCompletion();
    }
  }

  clearCell(): void {
    if (!this.selectedCell || this.isGameComplete) return;
    
    const { row, col } = this.selectedCell;
    const cell = this.board[row][col];
    
    if (cell.isFixed) return;
    
    cell.value = 0;
    cell.isError = false;
  }

  useHint(): void {
    if (this.hintsRemaining <= 0 || !this.selectedCell || this.isGameComplete) return;
    
    const { row, col } = this.selectedCell;
    const cell = this.board[row][col];
    
    if (cell.isFixed || cell.value === this.solution[row][col]) return;
    
    cell.value = this.solution[row][col];
    cell.isFixed = true;
    cell.isError = false;
    this.hintsRemaining--;
    
    this.checkCompletion();
  }

  checkCompletion(): void {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j].value !== this.solution[i][j]) {
          return;
        }
      }
    }
    
    this.isGameComplete = true;
    clearInterval(this.timerInterval);
  }

  gameOver(): void {
    this.isGameComplete = true;
    clearInterval(this.timerInterval);
  }

  setDifficulty(level: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = level;
    this.newGame();
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timer / 60);
    const seconds = this.timer % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  getBoxClass(row: number, col: number): string {
    const classes = [];
    
    if ((Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 0) {
      classes.push('light-box');
    } else {
      classes.push('dark-box');
    }
    
    return classes.join(' ');
  }
}
