import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { GameStatisticsService } from 'src/app/services/game-statistics.service';

interface MathQuestion {
  num1: number;
  num2: number;
  operator: '+' | '-';
  answer: number;
}

interface GameStats {
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  startTime: number;
}

@Component({
  selector: 'app-math-game',
  templateUrl: './math-game.component.html',
  styleUrls: ['./math-game.component.scss'],
})
export class MathGameComponent implements OnInit {
  
  @ViewChild('answerInput') answerInput: ElementRef | undefined;

  difficulty: string = 'easy';
  currentQuestion: MathQuestion | null = null;
  playerAnswer: string = '';
  gameStats: GameStats = {
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timeSpent: 0,
    startTime: Date.now(),
  };
  
  gameActive: boolean = false;
  gameOver: boolean = false;
  gameWon: boolean = false;
  showFeedback: boolean = false;
  feedbackType: 'correct' | 'wrong' = 'correct';
  feedbackMessage: string = '';
  
  // Timer and animation properties
  timerProgress: number = 100;
  timerInterval: any;
  currentUser: any = null;
  
  // Difficulty settings
  difficultySettings = {
    easy: {
      min: 1,
      max: 10,
      timeLimit: 10000, // 30 seconds
    },
    medium: {
      min: 10,
      max: 50,
      timeLimit: 30000, // 30 seconds
    },
    hard: {
      min: 50,
      max: 100,
      timeLimit: 60000, // 60 seconds
    },
  };

  constructor(private gameStatsService: GameStatisticsService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing currentUser:', error);
      }
    }
  }

  setDifficulty(level: string): void {
    this.difficulty = level;
    this.startGame();
  }

  startGame(): void {
    this.gameActive = true;
    this.gameOver = false;
    this.gameWon = false;
    this.gameStats = {
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      timeSpent: 0,
      startTime: Date.now(),
    };
    this.playerAnswer = '';
    this.showFeedback = false;
    this.generateNewQuestion();
    this.focusInput(); // Focus input when game starts
  }

  generateNewQuestion(): void {
    const settings = this.difficultySettings[this.difficulty as keyof typeof this.difficultySettings];
    const num1 = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    const num2 = Math.floor(Math.random() * (settings.max - settings.min + 1)) + settings.min;
    const operator = Math.random() > 0.5 ? '+' : '-';
    
    let answer: number;
    if (operator === '+') {
      answer = num1 + num2;
    } else {
      answer = num1 - num2;
    }

    this.currentQuestion = {
      num1,
      num2,
      operator,
      answer: Math.abs(answer), // Ensure positive answer for easy difficulty
    };

    this.playerAnswer = '';
    this.showFeedback = false;
    this.startTimer();
    
    console.log('New question:', this.currentQuestion);
  }

  startTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerProgress = 100;
    const settings = this.difficultySettings[this.difficulty as keyof typeof this.difficultySettings];
    const interval = settings.timeLimit / 100;

    this.timerInterval = setInterval(() => {
      this.timerProgress -= 1;

      if (this.timerProgress <= 0) {
        clearInterval(this.timerInterval);
        this.submitAnswer(true); // Force submit with timeout
      }
    }, interval);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.gameActive && !this.gameOver) {
      event.preventDefault();
      this.submitAnswer(false);
    }
  }

  submitAnswer(timedOut: boolean = false): void {
    if (!this.gameActive || !this.currentQuestion) return;

    // Don't consider empty input as a valid answer (but allow 0)
    if (this.playerAnswer.trim() === '') {
      this.feedbackType = 'wrong';
      this.feedbackMessage = 'Please enter a number!';
      this.showFeedback = true;
      setTimeout(() => this.showFeedback = false, 1500);
      return;
    }

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    const playerNum = parseInt(this.playerAnswer, 10);

    if (timedOut) {
      this.feedbackType = 'wrong';
      this.feedbackMessage = `Time\'s up! The answer was ${this.currentQuestion.answer}`;
      this.gameStats.wrongAnswers++;
    } else if (isNaN(playerNum)) {
      this.feedbackType = 'wrong';
      this.feedbackMessage = 'Please enter a valid number';
      return;
    } else if (playerNum === this.currentQuestion.answer) {
      this.feedbackType = 'correct';
      this.feedbackMessage = 'Correct! +10 points';
      this.gameStats.score += 10;
      this.gameStats.correctAnswers++;
    } else {
      this.feedbackType = 'wrong';
      this.feedbackMessage = `Wrong! The answer was ${this.currentQuestion.answer}`;
      this.gameStats.wrongAnswers++;
    }

    this.showFeedback = true;

    if (this.gameStats.wrongAnswers >= 3) {
      this.endGame();
    } else {
      setTimeout(() => {
        this.playerAnswer = ''; // Clear the answer for the next question
        this.showFeedback = false;
        this.generateNewQuestion();
        this.focusInput(); // Focus input for next question
      }, 2000);
    }
  }

  focusInput(): void {
    if (this.answerInput && this.answerInput.nativeElement) {
      setTimeout(() => {
        this.answerInput!.nativeElement.focus();
      }, 100);
    }
  }

  endGame(): void {
    this.gameActive = false;
    this.gameOver = true;
    this.gameStats.timeSpent = Math.round((Date.now() - this.gameStats.startTime) / 1000);

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // Save stats to database
    this.saveGameStats();
    console.log('Game Over - Stats:', this.gameStats);
  }

  saveGameStats(): void {
    if (!this.currentUser || !this.currentUser.id) {
      console.warn('No user logged in, stats not saved');
      return;
    }

    const timeInSeconds = Math.round(this.gameStats.timeSpent / 1000);
    
    const statData = {
      userId: this.currentUser.id,
      username: this.currentUser.username || this.currentUser.email || 'Unknown',
      gameName: 'math-game',
      score: this.gameStats.score,
      time: timeInSeconds,
      difficulty: this.difficulty,
      result: this.gameStats.wrongAnswers >= 3 ? 'loss' : 'win',
      details: {
        correctAnswers: this.gameStats.correctAnswers,
        wrongAnswers: this.gameStats.wrongAnswers,
      }
    };

    this.gameStatsService.saveGameStatistic(statData).subscribe(
      (response: any) => {
        console.log('Game stats saved successfully:', response);
      },
      (error: any) => {
        console.error('Error saving game stats:', error);
      }
    );
  }

  resetGame(): void {
    this.gameActive = false;
    this.gameOver = false;
    this.playerAnswer = '';
    this.showFeedback = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  getQuestion(): string {
    if (!this.currentQuestion) return '';
    return `${this.currentQuestion.num1} ${this.currentQuestion.operator} ${this.currentQuestion.num2}`;
  }

  getTimerColor(): string {
    if (this.timerProgress > 60) return '#10b981'; // Green
    if (this.timerProgress > 30) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  }
}
