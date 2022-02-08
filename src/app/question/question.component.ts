import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  public name: string ="";
  public questionList: any = [];
  public currentQuestion: number = 0;
  public points: number = 0;
  public counter: number = 60;
  public correctAnswer: number = 0;
  public inCorrectAnswer: number = 0;
  public interval$: any;
  public progress: string = '0';
  public isQuizCompleted: Boolean = false;
  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.questionService.getQuestions().subscribe(response =>{
      console.log(response.questions);
      this.questionList = response.questions;
      this.startCounter();
    });
  }
  public nextQuestion(){
    if ( this.currentQuestion <= this.questionList.length ){
      this.currentQuestion++;
      this.resetCounter();
    }else {
      this.isQuizCompleted = true;
    }

  }

  public previousQuestion(){
    if ( this.currentQuestion > 0){
      this.currentQuestion--;
      this.resetCounter();
    }
  }

  public answerQuestion(currentOption: number, current: any){
    if ( current.correct  ){
      this.points += 10;
      this.correctAnswer++;
    } else {
      this.points -= 10;
      this.inCorrectAnswer++;
    }
    setTimeout(() =>{
      this.currentQuestion++;
      this.resetCounter()
      this.getProgress();
      if ( this.currentQuestion+1 >= this.questionList.length){
        this.isQuizCompleted = true;
        this.stopCounter();
      }
    }, 1000)


  }

  startCounter(){
    this.interval$ = interval(1000).subscribe(val =>{
      this.counter--;
      if ( this.counter === 0){
        this.currentQuestion++;
        this.counter = 60;
        this.points -=10;
      }
    });

    setTimeout(() =>{
      this.interval$.unsubscribe();
    }, 60000)
  }

  stopCounter(){
    this.interval$.unsubscribe();
    this.counter = 0;
  }

  resetCounter(){
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
  }

  public resetQuiz(){
    this.resetCounter();
    this.currentQuestion = 0;
    this.correctAnswer = 0;
    this.inCorrectAnswer = 0;
  }

  getProgress(){
    return this.progress = ( (this.currentQuestion / this.questionList.length ) * 100 ).toString() ;
  }
}
