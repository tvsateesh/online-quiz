import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Question {
  question_id: number;
  question: string;
  answer: string;
  difficulty_level: string;
  category: string;
  hint: string;
}

@Component({
  selector: 'app-escape-room',
  templateUrl: './escape-room.component.html',
  styleUrls: ['./escape-room.component.scss']
})
export class EscapeRoomComponent implements OnInit {
  questions: Question[] = [];
  currentRoom = 0;
  userAnswer = '';
  responseMessage = '';
  isGameComplete = false;
  showHint = false;
  emoji = '😜';
  
  emojis = ['😜', '🤔', '😎', '🎉', '💪', '🧠', '🎮', '🔓', '🎯', '⭐'];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.http.get<Question[]>('assets/questions-escape-room.json')
      .subscribe({
        next: (data) => {
          this.questions = data;
        },
        error: (error) => {
          console.error('Error loading questions:', error);
          this.responseMessage = 'Error loading game. Please refresh the page.';
        }
      });
  }

  getCurrentQuestion(): Question | null {
    return this.questions.length > 0 ? this.questions[this.currentRoom] : null;
  }

  checkAnswer(): void {
    if (!this.userAnswer.trim()) {
      this.responseMessage = 'Please enter an answer!';
      return;
    }

    const userAnswerWords = this.userAnswer.trim().toLowerCase().split(' ');
    const correctAnswerWords = this.questions[this.currentRoom].answer.toLowerCase().split(' ');
    
    const isCorrect = userAnswerWords.some(word => correctAnswerWords.includes(word));

    if (isCorrect) {
      this.responseMessage = '✅ Correct! You may move on to the next room.';
      this.emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
      this.currentRoom++;
      
      if (this.currentRoom < this.questions.length) {
        setTimeout(() => {
          this.userAnswer = '';
          this.responseMessage = '';
          this.showHint = false;
        }, 1500);
      } else {
        this.isGameComplete = true;
        this.responseMessage = '🎉 Congratulations! You\'ve escaped all the rooms!';
        this.emoji = '🏆';
      }
    } else {
      this.responseMessage = '❌ Incorrect. Try again.';
      this.emoji = '🤔';
    }
  }

  toggleHint(): void {
    this.showHint = !this.showHint;
  }

  newGame(): void {
    this.currentRoom = 0;
    this.userAnswer = '';
    this.responseMessage = '';
    this.isGameComplete = false;
    this.showHint = false;
    this.emoji = '😜';
  }

  getRoomProgress(): string {
    return `Room ${this.currentRoom + 1} of ${this.questions.length}`;
  }
}
