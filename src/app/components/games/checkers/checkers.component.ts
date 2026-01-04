import { Component, OnInit } from '@angular/core';
import { GameStatisticsService } from 'src/app/services/game-statistics.service';

interface CheckersSquare {
  row: number;
  col: number;
  piece: 'red' | 'black' | null;
  isKing: boolean;
  isHighlighted: boolean;
  isPossibleMove: boolean;
}

@Component({
  selector: 'app-checkers',
  templateUrl: './checkers.component.html',
  styleUrls: ['./checkers.component.scss']
})
export class CheckersComponent implements OnInit {
  board: CheckersSquare[][] = [];
  selectedSquare: CheckersSquare | null = null;
  possibleMoves: CheckersSquare[] = [];
  currentPlayer: 'red' | 'black' = 'black';
  gameStatus: 'playing' | 'game-over' = 'playing';
  winner: 'red' | 'black' | null = null;
  redPieces: number = 12;
  blackPieces: number = 12;
  moveHistory: string[] = [];

  constructor(private gameStatsService: GameStatisticsService) { }

  ngOnInit(): void {
    this.loadStats();
    this.initializeBoard();
  }

  loadStats(): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser?.id) {
      // Load checkers statistics from database
      this.gameStatsService.getGameStatistics(currentUser.id, 'checkers')
        .subscribe(
          (response: any) => {
            if (response.success && response.data) {
              const stats = response.data;
              console.log('Checkers stats loaded from DB:', stats);
            }
          },
          (error) => {
            console.error('Error loading checkers statistics:', error);
          }
        );
    }
  }

  initializeBoard(): void {
    this.board = [];
    this.selectedSquare = null;
    this.possibleMoves = [];
    this.currentPlayer = 'black';
    this.gameStatus = 'playing';
    this.winner = null;
    this.redPieces = 12;
    this.blackPieces = 12;
    this.moveHistory = [];

    for (let row = 0; row < 8; row++) {
      this.board[row] = [];
      for (let col = 0; col < 8; col++) {
        let piece: 'red' | 'black' | null = null;

        // Place black pieces at top (rows 0-2)
        if ((row + col) % 2 === 1 && row < 3) {
          piece = 'black';
        }
        // Place red pieces at bottom (rows 5-7)
        else if ((row + col) % 2 === 1 && row > 4) {
          piece = 'red';
        }

        this.board[row][col] = {
          row,
          col,
          piece,
          isKing: false,
          isHighlighted: false,
          isPossibleMove: false
        };
      }
    }
  }

  onSquareClick(square: CheckersSquare): void {
    if (this.gameStatus === 'game-over') {
      return;
    }

    // If clicking on a highlighted square (possible move)
    if (square.isPossibleMove) {
      this.makeMove(square);
      return;
    }

    // If clicking on own piece
    if (square.piece === this.currentPlayer) {
      this.selectSquare(square);
    }
    // If clicking on empty square, deselect
    else if (square.piece === null) {
      this.deselectSquare();
    }
  }

  selectSquare(square: CheckersSquare): void {
    this.deselectSquare();
    this.selectedSquare = square;
    square.isHighlighted = true;
    this.possibleMoves = this.getValidMoves(square);
    this.possibleMoves.forEach(m => m.isPossibleMove = true);
  }

  deselectSquare(): void {
    if (this.selectedSquare) {
      this.selectedSquare.isHighlighted = false;
    }
    this.possibleMoves.forEach(m => m.isPossibleMove = false);
    this.selectedSquare = null;
    this.possibleMoves = [];
  }

  getValidMoves(square: CheckersSquare): CheckersSquare[] {
    const moves: CheckersSquare[] = [];
    const isKing = square.isKing;
    const directions = this.getDirections(square.piece, isKing);

    // Regular moves (one square diagonally)
    for (const [dRow, dCol] of directions) {
      const newRow = square.row + dRow;
      const newCol = square.col + dCol;
      if (this.isValidSquare(newRow, newCol) && this.board[newRow][newCol].piece === null) {
        moves.push(this.board[newRow][newCol]);
      }
    }

    // Capture moves (two squares diagonally)
    for (const [dRow, dCol] of directions) {
      const captureRow = square.row + dRow;
      const captureCol = square.col + dCol;
      const newRow = square.row + dRow * 2;
      const newCol = square.col + dCol * 2;

      if (this.isValidSquare(captureRow, captureCol) &&
          this.isValidSquare(newRow, newCol) &&
          this.board[captureRow][captureCol].piece !== null &&
          this.board[captureRow][captureCol].piece !== square.piece &&
          this.board[newRow][newCol].piece === null) {
        moves.push(this.board[newRow][newCol]);
      }
    }

    return moves;
  }

  getDirections(piece: 'red' | 'black' | null, isKing: boolean): [number, number][] {
    if (isKing) {
      return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    }
    if (piece === 'black') {
      return [[1, -1], [1, 1]]; // Black moves down
    } else {
      return [[-1, -1], [-1, 1]]; // Red moves up
    }
  }

  isValidSquare(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  makeMove(targetSquare: CheckersSquare): void {
    if (!this.selectedSquare) return;

    const fromRow = this.selectedSquare.row;
    const fromCol = this.selectedSquare.col;
    const toRow = targetSquare.row;
    const toCol = targetSquare.col;

    const isCapture = Math.abs(toRow - fromRow) === 2;

    // Move piece
    targetSquare.piece = this.selectedSquare.piece;
    targetSquare.isKing = this.selectedSquare.isKing;
    this.selectedSquare.piece = null;
    this.selectedSquare.isKing = false;

    // Handle capture
    if (isCapture) {
      const captureRow = (fromRow + toRow) / 2;
      const captureCol = (fromCol + toCol) / 2;
      const capturedPiece = this.board[captureRow][captureCol];
      const capturedColor = capturedPiece.piece;
      capturedPiece.piece = null;
      capturedPiece.isKing = false;

      if (capturedColor === 'red') {
        this.redPieces--;
      } else if (capturedColor === 'black') {
        this.blackPieces--;
      }
    }

    // Check for king promotion
    if ((targetSquare.piece === 'black' && toRow === 7) ||
        (targetSquare.piece === 'red' && toRow === 0)) {
      targetSquare.isKing = true;
    }

    // Record move
    const moveNotation = `${String.fromCharCode(65 + fromCol)}${fromRow + 1} → ${String.fromCharCode(65 + toCol)}${toRow + 1}`;
    this.moveHistory.unshift(moveNotation);

    this.deselectSquare();

    // Switch player
    this.currentPlayer = this.currentPlayer === 'black' ? 'red' : 'black';

    // Check for game end
    this.checkGameStatus();
  }

  checkGameStatus(): void {
    if (this.redPieces === 0) {
      this.gameStatus = 'game-over';
      this.winner = 'black';
      this.saveCheckersGameStatistics('win', 500);
    } else if (this.blackPieces === 0) {
      this.gameStatus = 'game-over';
      this.winner = 'red';
      this.saveCheckersGameStatistics('loss', 0);
    } else {
      // Check if current player has valid moves
      let hasValidMoves = false;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (this.board[row][col].piece === this.currentPlayer) {
            if (this.getValidMoves(this.board[row][col]).length > 0) {
              hasValidMoves = true;
              break;
            }
          }
        }
        if (hasValidMoves) break;
      }
      if (!hasValidMoves) {
        this.gameStatus = 'game-over';
        this.winner = this.currentPlayer === 'black' ? 'red' : 'black';
        const result = this.winner === 'black' ? 'win' : 'loss';
        const score = this.winner === 'black' ? 400 : 100;
        this.saveCheckersGameStatistics(result, score);
      }
    }
  }

  saveCheckersGameStatistics(result: string, score: number): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      this.gameStatsService.saveGameStatistic({
        userId: currentUser.id,
        username: currentUser.username,
        gameName: 'checkers',
        score: score,
        time: this.moveHistory.length * 3, // Rough estimate: 3 seconds per move
        difficulty: 'medium',
        moves: this.moveHistory.length,
        result: result as 'win' | 'loss' | 'draw'
      }).subscribe(
        (response) => {
          if (response.success) {
            console.log('Checkers statistics saved!');
          }
        },
        (error) => {
          console.error('Error saving checkers statistics:', error);
        }
      );
    }
  }

  resetGame(): void {
    this.initializeBoard();
  }

  isBlackSquare(row: number, col: number): boolean {
    return (row + col) % 2 === 1;
  }
}
