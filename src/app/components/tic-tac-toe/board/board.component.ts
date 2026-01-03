import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  square: any[] = Array(9).fill(null);
  xIsNext: boolean = true;
  winner: string = '';
  winningLine: number[] = [];
  isGameOver = false;
  gameMode: 'pvp' | 'ai' = 'ai';
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  scores = { X: 0, O: 0, draws: 0 };
  isThinking = false;

  winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }

  newGame(): void {
    this.square = Array(9).fill(null);
    this.xIsNext = true;
    this.winner = '';
    this.winningLine = [];
    this.isGameOver = false;
    this.isThinking = false;
  }

  resetScores(): void {
    this.scores = { X: 0, O: 0, draws: 0 };
    this.newGame();
  }

  setGameMode(mode: 'pvp' | 'ai'): void {
    this.gameMode = mode;
    this.resetScores();
  }

  setDifficulty(level: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = level;
    this.resetScores();
  }

  get player() {
    return this.xIsNext ? 'X' : 'O';
  }

  makeMove(idx: number): void {
    if (!this.square[idx] && !this.isGameOver && !this.isThinking) {
      this.square.splice(idx, 1, this.player);
      this.xIsNext = !this.xIsNext;
      this.checkGameState();

      // AI move
      if (this.gameMode === 'ai' && !this.isGameOver && !this.xIsNext) {
        this.isThinking = true;
        setTimeout(() => {
          this.makeAIMove();
          this.isThinking = false;
        }, 500);
      }
    }
  }

  makeAIMove(): void {
    let move: number;

    switch (this.difficulty) {
      case 'easy':
        move = this.getRandomMove();
        break;
      case 'medium':
        move = Math.random() < 0.5 ? this.getBestMove() : this.getRandomMove();
        break;
      case 'hard':
        move = this.getBestMove();
        break;
    }

    if (move !== -1) {
      this.square.splice(move, 1, 'O');
      this.xIsNext = true;
      this.checkGameState();
    }
  }

  getRandomMove(): number {
    const availableMoves = this.square
      .map((val, idx) => val === null ? idx : null)
      .filter(val => val !== null) as number[];
    
    return availableMoves.length > 0 
      ? availableMoves[Math.floor(Math.random() * availableMoves.length)]
      : -1;
  }

  getBestMove(): number {
    // Check for winning move
    for (let i = 0; i < 9; i++) {
      if (this.square[i] === null) {
        this.square[i] = 'O';
        if (this.checkWinner() === 'O') {
          this.square[i] = null;
          return i;
        }
        this.square[i] = null;
      }
    }

    // Block player's winning move
    for (let i = 0; i < 9; i++) {
      if (this.square[i] === null) {
        this.square[i] = 'X';
        if (this.checkWinner() === 'X') {
          this.square[i] = null;
          return i;
        }
        this.square[i] = null;
      }
    }

    // Take center if available
    if (this.square[4] === null) {
      return 4;
    }

    // Take a corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => this.square[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    return this.getRandomMove();
  }

  checkGameState(): void {
    this.winner = this.checkWinner();
    
    if (this.winner) {
      this.isGameOver = true;
      this.scores[this.winner as 'X' | 'O']++;
    } else if (this.square.every(cell => cell !== null)) {
      this.isGameOver = true;
      this.winner = 'Draw';
      this.scores.draws++;
    }
  }

  checkWinner(): string {
    for (let line of this.winningLines) {
      const [a, b, c] = line;
      if (
        this.square[a] &&
        this.square[a] === this.square[b] &&
        this.square[a] === this.square[c]
      ) {
        this.winningLine = line;
        return this.square[a];
      }
    }
    return '';
  }

  isWinningCell(idx: number): boolean {
    return this.winningLine.includes(idx);
  }

  getStatusMessage(): string {
    if (this.winner && this.winner !== 'Draw') {
      return this.gameMode === 'ai' && this.winner === 'O'
        ? '🤖 AI Wins!'
        : `🎉 Player ${this.winner} Wins!`;
    } else if (this.winner === 'Draw') {
      return "🤝 It's a Draw!";
    } else if (this.isThinking) {
      return '🤔 AI is thinking...';
    } else {
      return `${this.player}'s Turn`;
    }
  }
}
