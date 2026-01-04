import { Component, OnInit } from '@angular/core';
import { GameStatisticsService } from 'src/app/services/game-statistics.service';

interface Piece {
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  color: 'white' | 'black';
  hasMoved?: boolean;
}

interface Square {
  piece: Piece | null;
  row: number;
  col: number;
}

interface Move {
  from: Square;
  to: Square;
  capturedPiece?: Piece | null;
  isEnPassant?: boolean;
  isCastling?: boolean;
  isPromotion?: boolean;
  promotedTo?: 'queen' | 'rook' | 'bishop' | 'knight';
}

@Component({
  selector: 'app-chess',
  templateUrl: './chess.component.html',
  styleUrls: ['./chess.component.scss']
})
export class ChessComponent implements OnInit {
  board: Square[][] = [];
  selectedSquare: Square | null = null;
  currentPlayer: 'white' | 'black' = 'white';
  validMoves: Square[] = [];
  gameOver = false;
  winner: string | null = null;
  capturedPieces: { white: Piece[], black: Piece[] } = { white: [], black: [] };
  moveHistory: string[] = [];
  isCheck = false;
  lastMove: Move | null = null;
  enPassantTarget: Square | null = null;
  difficulty: 'easy' | 'medium' | 'hard' = 'medium';
  
  // Game Statistics
  stats = {
    wins: 0,
    losses: 0,
    draws: 0
  };
  
  // Game History
  gameHistory: Array<{
    date: string;
    result: string;
    difficulty: string;
    moves: string[];
    winner: string;
  }> = [];
  
  // UI State
  showGameHistory = false;
  selectedGameIndex: number | null = null;

  // Expose Math for template
  Math = Math;
  
  pieceSymbols: { [key: string]: string } = {
    'white-king': '♔',
    'white-queen': '♕',
    'white-rook': '♖',
    'white-bishop': '♗',
    'white-knight': '♘',
    'white-pawn': '♙',
    'black-king': '♚',
    'black-queen': '♛',
    'black-rook': '♜',
    'black-bishop': '♝',
    'black-knight': '♞',
    'black-pawn': '♟'
  };

  constructor(private gameStatsService: GameStatisticsService) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadGameHistory();
    this.initializeBoard();
  }

  initializeBoard(): void {
    this.board = [];
    this.currentPlayer = 'white';
    this.gameOver = false;
    this.winner = null;
    this.capturedPieces = { white: [], black: [] };
    this.moveHistory = [];
    this.isCheck = false;
    this.lastMove = null;
    this.enPassantTarget = null;

    // Initialize empty board
    for (let row = 0; row < 8; row++) {
      this.board[row] = [];
      for (let col = 0; col < 8; col++) {
        this.board[row][col] = { piece: null, row, col };
      }
    }

    // Setup black pieces
    this.board[0][0].piece = { type: 'rook', color: 'black' };
    this.board[0][1].piece = { type: 'knight', color: 'black' };
    this.board[0][2].piece = { type: 'bishop', color: 'black' };
    this.board[0][3].piece = { type: 'queen', color: 'black' };
    this.board[0][4].piece = { type: 'king', color: 'black' };
    this.board[0][5].piece = { type: 'bishop', color: 'black' };
    this.board[0][6].piece = { type: 'knight', color: 'black' };
    this.board[0][7].piece = { type: 'rook', color: 'black' };
    
    for (let col = 0; col < 8; col++) {
      this.board[1][col].piece = { type: 'pawn', color: 'black' };
    }

    // Setup white pieces
    for (let col = 0; col < 8; col++) {
      this.board[6][col].piece = { type: 'pawn', color: 'white' };
    }
    
    this.board[7][0].piece = { type: 'rook', color: 'white' };
    this.board[7][1].piece = { type: 'knight', color: 'white' };
    this.board[7][2].piece = { type: 'bishop', color: 'white' };
    this.board[7][3].piece = { type: 'queen', color: 'white' };
    this.board[7][4].piece = { type: 'king', color: 'white' };
    this.board[7][5].piece = { type: 'bishop', color: 'white' };
    this.board[7][6].piece = { type: 'knight', color: 'white' };
    this.board[7][7].piece = { type: 'rook', color: 'white' };
  }

  selectSquare(square: Square): void {
    if (this.gameOver) return;
    if (this.currentPlayer === 'black') return; // Don't allow selection during computer's turn

    // If clicking on a valid move, make the move
    if (this.selectedSquare && this.validMoves.includes(square)) {
      this.makeMove(this.selectedSquare, square);
      this.selectedSquare = null;
      this.validMoves = [];
      return;
    }

    // Select a new square with current player's piece
    if (square.piece && square.piece.color === this.currentPlayer) {
      this.selectedSquare = square;
      this.validMoves = this.getValidMoves(square);
    } else {
      this.selectedSquare = null;
      this.validMoves = [];
    }
  }

  makeMove(from: Square, to: Square): void {
    const piece = from.piece!;
    let isEnPassant = false;
    let isCastling = false;
    let isPromotion = false;
    let capturedPiece: Piece | null = to.piece; // Store captured piece before overwriting

    // Handle en passant capture
    if (piece.type === 'pawn' && to === this.enPassantTarget) {
      isEnPassant = true;
      const captureRow = piece.color === 'white' ? to.row + 1 : to.row - 1;
      const capturedPawn = this.board[captureRow][to.col].piece!;
      this.capturedPieces[capturedPawn.color].push(capturedPawn);
      this.board[captureRow][to.col].piece = null;
      capturedPiece = capturedPawn; // En passant capture
    }

    // Handle castling
    if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
      isCastling = true;
      const rookCol = to.col > from.col ? 7 : 0;
      const rookNewCol = to.col > from.col ? to.col - 1 : to.col + 1;
      const rook = this.board[from.row][rookCol].piece!;
      
      this.board[from.row][rookNewCol].piece = rook;
      this.board[from.row][rookCol].piece = null;
      rook.hasMoved = true;
    }

    // Capture piece if present
    if (to.piece && !isEnPassant) {
      this.capturedPieces[to.piece.color].push(to.piece);
    }

    // Check for pawn promotion
    if (piece.type === 'pawn') {
      const promotionRow = piece.color === 'white' ? 0 : 7;
      if (to.row === promotionRow) {
        isPromotion = true;
        // Auto-promote to queen (can be enhanced with UI selection)
        piece.type = 'queen';
      }
    }

    // Update en passant target for next move
    this.enPassantTarget = null;
    if (piece.type === 'pawn' && Math.abs(to.row - from.row) === 2) {
      const enPassantRow = piece.color === 'white' ? from.row - 1 : from.row + 1;
      this.enPassantTarget = this.board[enPassantRow][from.col];
    }

    // Move the piece
    to.piece = from.piece;
    from.piece = null;

    if (to.piece) {
      to.piece.hasMoved = true;
    }

    // Record move
    this.lastMove = {
      from,
      to,
      capturedPiece,
      isEnPassant,
      isCastling,
      isPromotion
    };
    
    let moveNotation = this.getMoveNotation(from, to);
    
    // Switch player
    this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';

    // Update check status
    this.isCheck = this.isKingInCheck(this.currentPlayer);
    
    // Add check/checkmate symbols
    if (this.isCheck) {
      // Check if it's checkmate by looking ahead
      let hasLegalMoves = false;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const piece = this.board[row][col].piece;
          if (piece && piece.color === this.currentPlayer) {
            const moves = this.getValidMoves(this.board[row][col]);
            if (moves.length > 0) {
              hasLegalMoves = true;
              break;
            }
          }
        }
        if (hasLegalMoves) break;
      }
      moveNotation += hasLegalMoves ? '+' : '#';
    }
    
    this.moveHistory.push(moveNotation);

    // Check for checkmate
    this.checkGameOver();

    // Computer makes a move after player's move
    if (!this.gameOver && this.currentPlayer === 'black') {
      setTimeout(() => this.makeComputerMove(), 500);
    }
  }

  getValidMoves(square: Square): Square[] {
    if (!square.piece) return [];

    const pseudoMoves: Square[] = [];
    const piece = square.piece;

    switch (piece.type) {
      case 'pawn':
        pseudoMoves.push(...this.getPawnMoves(square));
        break;
      case 'rook':
        pseudoMoves.push(...this.getRookMoves(square));
        break;
      case 'knight':
        pseudoMoves.push(...this.getKnightMoves(square));
        break;
      case 'bishop':
        pseudoMoves.push(...this.getBishopMoves(square));
        break;
      case 'queen':
        pseudoMoves.push(...this.getQueenMoves(square));
        break;
      case 'king':
        pseudoMoves.push(...this.getKingMoves(square));
        break;
    }

    // Filter out moves that would leave the king in check
    return pseudoMoves.filter(move => this.isMoveLegal(square, move));
  }

  isMoveLegal(from: Square, to: Square): boolean {
    // Create a temporary board state to test the move
    const originalFromPiece = from.piece;
    const originalToPiece = to.piece;
    const piece = from.piece!;

    // Simulate the move
    to.piece = from.piece;
    from.piece = null;

    // Handle en passant in simulation
    let capturedEnPassantPiece: Piece | null = null;
    let enPassantSquare: Square | null = null;
    if (piece.type === 'pawn' && to === this.enPassantTarget) {
      const captureRow = piece.color === 'white' ? to.row + 1 : to.row - 1;
      enPassantSquare = this.board[captureRow][to.col];
      capturedEnPassantPiece = enPassantSquare.piece;
      enPassantSquare.piece = null;
    }

    // Check if the king is in check after this move
    const isLegal = !this.isKingInCheck(piece.color);

    // Restore the board state
    from.piece = originalFromPiece;
    to.piece = originalToPiece;
    if (enPassantSquare && capturedEnPassantPiece) {
      enPassantSquare.piece = capturedEnPassantPiece;
    }

    return isLegal;
  }

  isKingInCheck(color: 'white' | 'black'): boolean {
    // Find the king's position
    const kingSquare = this.findKing(color);
    if (!kingSquare) return false;

    // Check if any opponent piece can attack the king
    return this.isSquareUnderAttack(kingSquare, color);
  }

  findKing(color: 'white' | 'black'): Square | null {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col].piece;
        if (piece && piece.type === 'king' && piece.color === color) {
          return this.board[row][col];
        }
      }
    }
    return null;
  }

  getPawnMoves(square: Square): Square[] {
    const moves: Square[] = [];
    const piece = square.piece!;
    const direction = piece.color === 'white' ? -1 : 1;
    const startRow = piece.color === 'white' ? 6 : 1;

    // Move forward one square
    const forwardRow = square.row + direction;
    if (this.isValidPosition(forwardRow, square.col)) {
      const forwardSquare = this.board[forwardRow][square.col];
      if (!forwardSquare.piece) {
        moves.push(forwardSquare);

        // Move forward two squares from starting position (first move)
        if (square.row === startRow && !piece.hasMoved) {
          const doubleForwardRow = square.row + (2 * direction);
          const doubleForwardSquare = this.board[doubleForwardRow][square.col];
          if (!doubleForwardSquare.piece) {
            moves.push(doubleForwardSquare);
          }
        }
      }
    }

    // Capture diagonally
    for (let colOffset of [-1, 1]) {
      const captureRow = square.row + direction;
      const captureCol = square.col + colOffset;
      if (this.isValidPosition(captureRow, captureCol)) {
        const captureSquare = this.board[captureRow][captureCol];
        if (captureSquare.piece && captureSquare.piece.color !== piece.color) {
          moves.push(captureSquare);
        }
      }
    }

    // En passant capture
    if (this.enPassantTarget) {
      const enPassantRow = this.enPassantTarget.row;
      const enPassantCol = this.enPassantTarget.col;
      
      // Check if the en passant target is diagonally adjacent
      if (square.row + direction === enPassantRow && 
          Math.abs(square.col - enPassantCol) === 1) {
        moves.push(this.enPassantTarget);
      }
    }

    return moves;
  }

  getRookMoves(square: Square): Square[] {
    const moves: Square[] = [];
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    for (let [rowDir, colDir] of directions) {
      let currentRow = square.row + rowDir;
      let currentCol = square.col + colDir;

      while (this.isValidPosition(currentRow, currentCol)) {
        const targetSquare = this.board[currentRow][currentCol];
        
        if (!targetSquare.piece) {
          moves.push(targetSquare);
        } else {
          if (targetSquare.piece.color !== square.piece!.color) {
            moves.push(targetSquare);
          }
          break;
        }

        currentRow += rowDir;
        currentCol += colDir;
      }
    }

    return moves;
  }

  getKnightMoves(square: Square): Square[] {
    const moves: Square[] = [];
    const offsets = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1]
    ];

    for (let [rowOffset, colOffset] of offsets) {
      const targetRow = square.row + rowOffset;
      const targetCol = square.col + colOffset;

      if (this.isValidPosition(targetRow, targetCol)) {
        const targetSquare = this.board[targetRow][targetCol];
        if (!targetSquare.piece || targetSquare.piece.color !== square.piece!.color) {
          moves.push(targetSquare);
        }
      }
    }

    return moves;
  }

  getBishopMoves(square: Square): Square[] {
    const moves: Square[] = [];
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];

    for (let [rowDir, colDir] of directions) {
      let currentRow = square.row + rowDir;
      let currentCol = square.col + colDir;

      while (this.isValidPosition(currentRow, currentCol)) {
        const targetSquare = this.board[currentRow][currentCol];
        
        if (!targetSquare.piece) {
          moves.push(targetSquare);
        } else {
          if (targetSquare.piece.color !== square.piece!.color) {
            moves.push(targetSquare);
          }
          break;
        }

        currentRow += rowDir;
        currentCol += colDir;
      }
    }

    return moves;
  }

  getQueenMoves(square: Square): Square[] {
    return [...this.getRookMoves(square), ...this.getBishopMoves(square)];
  }

  getKingMoves(square: Square): Square[] {
    const moves: Square[] = [];
    const piece = square.piece!;
    const offsets = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1], [0, 1],
      [1, -1], [1, 0], [1, 1]
    ];

    // Normal king moves (one square in any direction)
    for (let [rowOffset, colOffset] of offsets) {
      const targetRow = square.row + rowOffset;
      const targetCol = square.col + colOffset;

      if (this.isValidPosition(targetRow, targetCol)) {
        const targetSquare = this.board[targetRow][targetCol];
        if (!targetSquare.piece || targetSquare.piece.color !== piece.color) {
          moves.push(targetSquare);
        }
      }
    }

    // Castling
    if (!piece.hasMoved && !this.isSquareUnderAttack(square, piece.color)) {
      // Kingside castling (short castle)
      const kingsideRook = this.board[square.row][7].piece;
      if (kingsideRook && kingsideRook.type === 'rook' && !kingsideRook.hasMoved) {
        // Check if squares between king and rook are empty
        const squaresClear = !this.board[square.row][5].piece && 
                             !this.board[square.row][6].piece;
        
        // Check if squares king passes through are not under attack
        const squaresSafe = !this.isSquareUnderAttack(this.board[square.row][5], piece.color) &&
                            !this.isSquareUnderAttack(this.board[square.row][6], piece.color);
        
        if (squaresClear && squaresSafe) {
          moves.push(this.board[square.row][6]);
        }
      }

      // Queenside castling (long castle)
      const queensideRook = this.board[square.row][0].piece;
      if (queensideRook && queensideRook.type === 'rook' && !queensideRook.hasMoved) {
        // Check if squares between king and rook are empty
        const squaresClear = !this.board[square.row][1].piece && 
                             !this.board[square.row][2].piece &&
                             !this.board[square.row][3].piece;
        
        // Check if squares king passes through are not under attack
        const squaresSafe = !this.isSquareUnderAttack(this.board[square.row][2], piece.color) &&
                            !this.isSquareUnderAttack(this.board[square.row][3], piece.color);
        
        if (squaresClear && squaresSafe) {
          moves.push(this.board[square.row][2]);
        }
      }
    }

    return moves;
  }

  isSquareUnderAttack(square: Square, byColor: 'white' | 'black'): boolean {
    // Check if the square is under attack by the opposing color
    const opponentColor = byColor === 'white' ? 'black' : 'white';
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col].piece;
        if (piece && piece.color === opponentColor) {
          const attackSquare = this.board[row][col];
          const moves = this.getPieceMoves(attackSquare, true);
          
          if (moves.some(move => move.row === square.row && move.col === square.col)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }

  getPieceMoves(square: Square, ignoreKingCheck: boolean = false): Square[] {
    if (!square.piece) return [];

    const piece = square.piece;
    let moves: Square[] = [];

    switch (piece.type) {
      case 'pawn':
        moves = this.getPawnMovesForAttack(square);
        break;
      case 'rook':
        moves = this.getRookMoves(square);
        break;
      case 'knight':
        moves = this.getKnightMoves(square);
        break;
      case 'bishop':
        moves = this.getBishopMoves(square);
        break;
      case 'queen':
        moves = this.getQueenMoves(square);
        break;
      case 'king':
        if (ignoreKingCheck) {
          // For checking attacks, only return basic king moves without castling
          const offsets = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
          ];
          for (let [rowOffset, colOffset] of offsets) {
            const targetRow = square.row + rowOffset;
            const targetCol = square.col + colOffset;
            if (this.isValidPosition(targetRow, targetCol)) {
              const targetSquare = this.board[targetRow][targetCol];
              if (!targetSquare.piece || targetSquare.piece.color !== piece.color) {
                moves.push(targetSquare);
              }
            }
          }
        } else {
          moves = this.getKingMoves(square);
        }
        break;
    }

    return moves;
  }

  getPawnMovesForAttack(square: Square): Square[] {
    // For checking attacks, only return diagonal captures (not forward moves)
    const moves: Square[] = [];
    const piece = square.piece!;
    const direction = piece.color === 'white' ? -1 : 1;

    for (let colOffset of [-1, 1]) {
      const captureRow = square.row + direction;
      const captureCol = square.col + colOffset;
      if (this.isValidPosition(captureRow, captureCol)) {
        moves.push(this.board[captureRow][captureCol]);
      }
    }

    return moves;
  }

  isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  }

  isValidMove(square: Square): boolean {
    return this.validMoves.includes(square);
  }

  isSelected(square: Square): boolean {
    return this.selectedSquare === square;
  }

  getPieceSymbol(piece: Piece): string {
    return this.pieceSymbols[`${piece.color}-${piece.type}`];
  }

  setDifficulty(level: 'easy' | 'medium' | 'hard'): void {
    this.difficulty = level;
  }

  makeComputerMove(): void {
    switch (this.difficulty) {
      case 'easy':
        this.makeEasyMove();
        break;
      case 'medium':
        this.makeMediumMove();
        break;
      case 'hard':
        this.makeHardMove();
        break;
    }
  }

  makeEasyMove(): void {
    // Easy: Just make a random legal move
    const allMoves: { from: Square, to: Square }[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.board[row][col];
        if (square.piece && square.piece.color === 'black') {
          const validMoves = this.getValidMoves(square);
          validMoves.forEach(move => {
            allMoves.push({ from: square, to: move });
          });
        }
      }
    }

    if (allMoves.length > 0) {
      const randomMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      this.makeMove(randomMove.from, randomMove.to);
    }
  }

  makeMediumMove(): void {
    // Medium: Use tactical evaluation
    const allMoves: { from: Square, to: Square, score: number }[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.board[row][col];
        if (square.piece && square.piece.color === 'black') {
          const validMoves = this.getValidMoves(square);
          validMoves.forEach(move => {
            const score = this.evaluateMove(square, move);
            allMoves.push({ from: square, to: move, score });
          });
        }
      }
    }

    if (allMoves.length > 0) {
      allMoves.sort((a, b) => b.score - a.score);
      const topScore = allMoves[0].score;
      const threshold = topScore * 0.8;
      const bestMoves = allMoves.filter(move => move.score >= threshold);
      const selectedMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      this.makeMove(selectedMove.from, selectedMove.to);
    }
  }

  makeHardMove(): void {
    // Hard: Use minimax algorithm with alpha-beta pruning
    const allMoves: { from: Square, to: Square, score: number }[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.board[row][col];
        if (square.piece && square.piece.color === 'black') {
          const validMoves = this.getValidMoves(square);
          validMoves.forEach(move => {
            // Save current state
            const capturedPiece = move.piece;
            const fromPiece = square.piece;
            
            // Make move temporarily
            move.piece = fromPiece;
            square.piece = null;
            
            // Evaluate using minimax
            const score = this.minimax(3, false, -Infinity, Infinity);
            
            // Undo move
            square.piece = fromPiece;
            move.piece = capturedPiece;
            
            allMoves.push({ from: square, to: move, score });
          });
        }
      }
    }

    if (allMoves.length > 0) {
      allMoves.sort((a, b) => b.score - a.score);
      this.makeMove(allMoves[0].from, allMoves[0].to);
    }
  }

  minimax(depth: number, isMaximizing: boolean, alpha: number, beta: number): number {
    if (depth === 0) {
      return this.evaluateBoardPosition();
    }

    const color = isMaximizing ? 'black' : 'white';
    const moves: { from: Square, to: Square }[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const square = this.board[row][col];
        if (square.piece && square.piece.color === color) {
          const validMoves = this.getValidMoves(square);
          validMoves.forEach(move => {
            moves.push({ from: square, to: move });
          });
        }
      }
    }

    if (moves.length === 0) {
      const inCheck = this.isKingInCheck(color);
      return isMaximizing ? (inCheck ? -10000 : 0) : (inCheck ? 10000 : 0);
    }

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of moves) {
        const capturedPiece = move.to.piece;
        const fromPiece = move.from.piece;
        
        move.to.piece = fromPiece;
        move.from.piece = null;
        
        const evaluation = this.minimax(depth - 1, false, alpha, beta);
        
        move.from.piece = fromPiece;
        move.to.piece = capturedPiece;
        
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) {
          break;
        }
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of moves) {
        const capturedPiece = move.to.piece;
        const fromPiece = move.from.piece;
        
        move.to.piece = fromPiece;
        move.from.piece = null;
        
        const evaluation = this.minimax(depth - 1, true, alpha, beta);
        
        move.from.piece = fromPiece;
        move.to.piece = capturedPiece;
        
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) {
          break;
        }
      }
      return minEval;
    }
  }

  evaluateBoardPosition(): number {
    let score = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col].piece;
        if (piece) {
          const pieceValue = this.getPieceValue(piece);
          const positionBonus = this.evaluateMoveAdvanced(this.board[row][col], this.board[row][col]);
          
          if (piece.color === 'black') {
            score += pieceValue + positionBonus;
          } else {
            score -= pieceValue + positionBonus;
          }
        }
      }
    }

    return score;
  }

  evaluateMoveAdvanced(from: Square, to: Square): number {
    let score = 0;
    const piece = from.piece;
    if (!piece) return 0;

    // Center control bonus
    const centerSquares = [[3, 3], [3, 4], [4, 3], [4, 4]];
    const isCenterSquare = centerSquares.some(([r, c]) => r === to.row && c === to.col);
    if (isCenterSquare) {
      score += 3;
    }

    // Development bonus
    if (piece.type === 'knight' || piece.type === 'bishop') {
      const backRank = piece.color === 'white' ? 7 : 0;
      if (from.row === backRank && to.row !== backRank) {
        score += 2;
      }
    }

    // Pawn structure
    if (piece.type === 'pawn') {
      const advancementBonus = piece.color === 'white' ? (7 - to.row) : to.row;
      score += advancementBonus * 0.5;
    }

    // King safety
    if (piece.type === 'king') {
      score += this.evaluateKingSafety(to, piece.color);
    }

    // Threats and forks
    const threatsAfterMove = this.countThreatsAfterMove(from, to);
    score += threatsAfterMove * 2;

    // Protected pieces
    const attackedPieces = this.countAttackedPiecesAfterMove(from, to);
    score += attackedPieces;

    return score;
  }

  countThreatsAfterMove(from: Square, to: Square): number {
    const piece = from.piece;
    if (!piece) return 0;

    let threats = 0;
    const directions = this.getMoveDirections(piece, to);

    for (const [dx, dy] of directions) {
      const newRow = to.row + dx;
      const newCol = to.col + dy;
      
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetSquare = this.board[newRow][newCol];
        if (targetSquare.piece && targetSquare.piece.color !== piece.color) {
          threats++;
        }
      }
    }

    return threats;
  }

  getMoveDirections(piece: Piece, from: Square): number[][] {
    switch (piece.type) {
      case 'knight':
        return [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]];
      case 'bishop':
        return [[1, 1], [1, -1], [-1, 1], [-1, -1]];
      case 'rook':
        return [[1, 0], [-1, 0], [0, 1], [0, -1]];
      case 'queen':
        return [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      case 'king':
        return [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
      default:
        return [];
    }
  }

  isPieceUnderThreat(square: Square, byColor: 'white' | 'black'): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const attacker = this.board[row][col];
        if (attacker.piece && attacker.piece.color === byColor) {
          const moves = this.getValidMoves(attacker);
          if (moves.some(m => m.row === square.row && m.col === square.col)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  countAttackedPiecesAfterMove(from: Square, to: Square): number {
    const piece = from.piece;
    if (!piece) return 0;

    let count = 0;
    const directions = this.getMoveDirections(piece, to);

    for (const [dx, dy] of directions) {
      let newRow = to.row + dx;
      let newCol = to.col + dy;
      
      while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetSquare = this.board[newRow][newCol];
        if (targetSquare.piece) {
          if (targetSquare.piece.color !== piece.color) {
            count++;
          }
          break;
        }
        
        if (piece.type === 'knight' || piece.type === 'king') {
          break;
        }
        
        newRow += dx;
        newCol += dy;
      }
    }

    return count;
  }

  evaluateKingSafety(square: Square, color: 'white' | 'black'): number {
    let safety = 0;
    const enemyColor = color === 'white' ? 'black' : 'white';

    // Check if king is under attack
    if (this.isPieceUnderThreat(square, enemyColor)) {
      safety -= 5;
    }

    // Count friendly pieces nearby (protection)
    let protectors = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const newRow = square.row + dx;
        const newCol = square.col + dy;
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
          const neighbor = this.board[newRow][newCol];
          if (neighbor.piece && neighbor.piece.color === color) {
            protectors++;
          }
        }
      }
    }
    safety += protectors * 0.5;

    return safety;
  }

  evaluateMove(from: Square, to: Square): number {
    let score = 0;
    const piece = from.piece!;

    // 1. Piece value scoring (capture value)
    if (to.piece) {
      score += this.getPieceValue(to.piece) * 10;
      
      const attackerValue = this.getPieceValue(piece);
      const victimValue = this.getPieceValue(to.piece);
      if (attackerValue < victimValue) {
        score += (victimValue - attackerValue) * 5;
      }
    }

    // 2. Center control
    const centerSquares = [[3, 3], [3, 4], [4, 3], [4, 4]];
    const isCenterSquare = centerSquares.some(([r, c]) => r === to.row && c === to.col);
    if (isCenterSquare) {
      score += 3;
    }

    // 3. Piece development
    if (piece.type !== 'pawn' && from.row === 0 && to.row !== 0) {
      score += 2;
    }

    // 4. Pawn advancement
    if (piece.type === 'pawn') {
      const advancement = from.row - to.row;
      score += advancement * 1.5;
      if (to.row === 7) {
        score += 50;
      }
    }

    // 5. Random factor for variety
    score += Math.random() * 0.5;

    return score;
  }

  getPieceValue(piece: Piece): number {
    const values: { [key: string]: number } = {
      'pawn': 1,
      'knight': 3,
      'bishop': 3,
      'rook': 5,
      'queen': 9,
      'king': 100
    };
    return values[piece.type];
  }

  countDefendedPieces(from: Square, color: 'white' | 'black'): number {
    let count = 0;
    const moves = this.getValidMovesForPosition(from.row, from.col);
    
    for (const move of moves) {
      if (move.piece && move.piece.color === color) {
        count++;
      }
    }
    
    return count;
  }

  countThreatenedPieces(from: Square, color: 'white' | 'black'): number {
    let count = 0;
    const moves = this.getValidMovesForPosition(from.row, from.col);
    
    for (const move of moves) {
      if (move.piece && move.piece.color === color) {
        count++;
      }
    }
    
    return count;
  }

  getValidMovesForPosition(row: number, col: number): Square[] {
    const tempSquare = { ...this.board[row][col], row, col };
    if (!tempSquare.piece) return [];
    return this.getValidMoves(tempSquare);
  }

  checkGameOver(): void {
    // Check if current player has any legal moves
    let hasLegalMoves = false;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = this.board[row][col].piece;
        if (piece && piece.color === this.currentPlayer) {
          const moves = this.getValidMoves(this.board[row][col]);
          if (moves.length > 0) {
            hasLegalMoves = true;
            break;
          }
        }
      }
      if (hasLegalMoves) break;
    }

    // If no legal moves and in check, it's checkmate
    if (!hasLegalMoves) {
      if (this.isCheck) {
        this.gameOver = true;
        let result: string;
        let score: number;
        
        if (this.currentPlayer === 'white') {
          this.winner = 'Black (Computer) wins by checkmate!';
          this.stats.losses++;
          result = 'loss';
          score = 0;
          this.saveGameToHistory('0-1', 'Black wins');
        } else {
          this.winner = 'White (You) wins by checkmate!';
          this.stats.wins++;
          result = 'win';
          score = 500;
          this.saveGameToHistory('1-0', 'White wins');
        }
        this.saveStats();
        
        // Save to database
        this.saveChessGameStatistics(score, result);
      } else {
        // Stalemate
        this.gameOver = true;
        this.winner = 'Stalemate - Draw!';
        this.stats.draws++;
        this.saveGameToHistory('1/2-1/2', 'Draw');
        this.saveStats();
        
        // Save to database
        this.saveChessGameStatistics(250, 'draw');
      }
    }
  }

  saveChessGameStatistics(score: number, result: string): void {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.id) {
      this.gameStatsService.saveGameStatistic({
        userId: currentUser.id,
        username: currentUser.username,
        gameName: 'chess',
        score: score,
        time: this.moveHistory.length * 2, // Rough estimate: 2 seconds per move
        difficulty: this.difficulty,
        moves: this.moveHistory.length,
        result: result as 'win' | 'loss' | 'draw'
      }).subscribe(
        (response) => {
          if (response.success) {
            console.log('Chess statistics saved!');
          }
        },
        (error) => {
          console.error('Error saving chess statistics:', error);
        }
      );
    }
  }

  getMoveNotation(from: Square, to: Square): string {
    const cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const piece = to.piece;
    if (!piece) return '';

    let notation = '';
    const toSquare = `${cols[to.col]}${8 - to.row}`;
    
    // Special case for castling
    if (this.lastMove?.isCastling) {
      return to.col > from.col ? 'O-O' : 'O-O-O';
    }

    // Piece prefix (empty for pawn)
    const pieceSymbol: { [key: string]: string } = {
      'king': 'K',
      'queen': 'Q',
      'rook': 'R',
      'bishop': 'B',
      'knight': 'N',
      'pawn': ''
    };
    
    notation += pieceSymbol[piece.type];

    // For pawns, include file if capturing
    if (piece.type === 'pawn' && this.lastMove?.capturedPiece) {
      notation += cols[from.col];
    }

    // Add 'x' for captures
    if (this.lastMove?.capturedPiece || this.lastMove?.isEnPassant) {
      notation += 'x';
    }

    // Add destination square
    notation += toSquare;

    // Add promotion
    if (this.lastMove?.isPromotion) {
      notation += '=Q';
    }

    // Add check/checkmate indicator (will be added in makeMove)
    return notation;
  }

  newGame(): void {
    this.initializeBoard();
    this.selectedSquare = null;
    this.validMoves = [];
  }

  loadStats(): void {
    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      if (currentUser?.id) {
        // Load chess statistics from database
        this.gameStatsService.getGameStatistics(currentUser.id, 'chess')
        .subscribe(
          (response: any) => {
            if (response.success && response.data) {
              const stats = response.data;
              this.stats = {
                wins: stats.wins || 0,
                losses: stats.losses || 0,
                draws: stats.draws || 0
              };
            }
          },
          (error) => {
            console.error('Error loading chess statistics:', error);
            // Fallback to localStorage
            const savedStats = localStorage.getItem('chessStats');
            if (savedStats) {
              this.stats = JSON.parse(savedStats);
            }
          }
        );
    } else {
      // Fallback to localStorage if no user logged in
      const savedStats = localStorage.getItem('chessStats');
      if (savedStats) {
        this.stats = JSON.parse(savedStats);
      }
    }
    } catch (error) {
      console.error('Error parsing currentUser in loadStats:', error);
      // Fallback to localStorage on parsing error
      const savedStats = localStorage.getItem('chessStats');
      if (savedStats) {
        try {
          this.stats = JSON.parse(savedStats);
        } catch (e) {
          console.error('Error parsing cached stats:', e);
        }
      }
    }
  }

  saveStats(): void {
    localStorage.setItem('chessStats', JSON.stringify(this.stats));
  }

  resetStats(): void {
    this.stats = { wins: 0, losses: 0, draws: 0 };
    this.saveStats();
  }

  loadGameHistory(): void {
    const savedHistory = localStorage.getItem('chessGameHistory');
    if (savedHistory) {
      this.gameHistory = JSON.parse(savedHistory);
    }
  }

  saveGameToHistory(result: string, winner: string): void {
    const game = {
      date: new Date().toISOString(),
      result: result,
      difficulty: this.difficulty,
      moves: [...this.moveHistory],
      winner: winner
    };
    this.gameHistory.unshift(game); // Add to beginning
    
    // Keep only last 50 games
    if (this.gameHistory.length > 50) {
      this.gameHistory = this.gameHistory.slice(0, 50);
    }
    
    localStorage.setItem('chessGameHistory', JSON.stringify(this.gameHistory));
  }

  exportToCSV(): void {
    if (this.gameHistory.length === 0) {
      alert('No game history to export!');
      return;
    }

    // CSV headers
    let csv = 'Date,Result,Winner,Difficulty,Moves\n';
    
    // Add each game
    this.gameHistory.forEach(game => {
      const date = new Date(game.date).toLocaleString();
      const moves = game.moves.join(' ');
      csv += `"${date}","${game.result}","${game.winner}","${game.difficulty}","${moves}"\n`;
    });

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `chess_games_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportCurrentGameToCSV(): void {
    if (this.moveHistory.length === 0) {
      alert('No moves to export!');
      return;
    }

    // CSV headers
    let csv = 'Move Number,White,Black\n';
    
    // Add moves in pairs (white and black)
    for (let i = 0; i < this.moveHistory.length; i += 2) {
      const moveNum = Math.floor(i / 2) + 1;
      const whiteMove = this.moveHistory[i] || '';
      const blackMove = this.moveHistory[i + 1] || '';
      csv += `${moveNum},"${whiteMove}","${blackMove}"\n`;
    }

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `chess_current_game_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toggleGameHistory(): void {
    this.showGameHistory = !this.showGameHistory;
    if (!this.showGameHistory) {
      this.selectedGameIndex = null;
    }
  }

  toggleGameDetails(index: number): void {
    this.selectedGameIndex = this.selectedGameIndex === index ? null : index;
  }

  formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleString();
  }

  getResultClass(result: string): string {
    if (result === '1-0') return 'result-win';
    if (result === '0-1') return 'result-loss';
    if (result === '1/2-1/2') return 'result-draw';
    return '';
  }
}
