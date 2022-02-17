import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-word-game',
  templateUrl: './word-game.component.html',
  styleUrls: ['./word-game.component.scss']
})
export class WordGameComponent implements OnInit {

  constructor() { }
  // wordGameForm: any = '' ;
  lang : string = 'english';
  ngOnInit(): void {
    this.getWord();
    // this.wordGameForm = this.fb.group(
    //   {'lang': [null]}
    // );
    // this.wordGameForm = this.wordGameForm.get("lang").valueChanges
    // .subscribe((f : any) => {
    //   this.onLangChange(f);
    // })
  }

  onLangChange(f: any){

  }

  // allowDrop(ev:any) {
  //   ev.preventDefault();
  // }

  // drag(ev:any) {
  //   ev.dataTransfer.setData("text", ev.target.id);
  // }

  // drop(ev:any) {
  //   ev.preventDefault();
  //   var data = ev.dataTransfer.getData("text");
  //   ev.target.appendChild(document.getElementById(data));
  // }


  Movies = [
    'Blade Runner',
    'Cool Hand Luke',
    'Heat',
    'Juice',
    'The Far Side of the World',
    'Morituri',
    'Napoleon Dynamite',
    'Pulp Fiction'
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Movies, event.previousIndex, event.currentIndex);
  }

  // Transfer Items Between Lists
  wordList = [
    'World',
    'Dynamite',
    'Fiction',
    'Runner',
    'Blade',
    'Cool',
    'Hand',
    'Heat',
    'Juice'
  ];
  word : string = '';
  letters: any[] = [];
  solved: boolean = false;
  errorMsg: string = '';

  solvedWord = [
    'Place Here'
  ];

  onDrop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  getWord(){
    // Math.floor(Math.random() * 6) + 1
    //this.word = Math.random() + '' //* this.wordList.length-1 + '';//(Math.floor(Math.random() * this.wordList.length-1)+1).toString();
     this.word = this.wordList[Math.floor(Math.random() * this.wordList.length-1)+1].split('').join('').toUpperCase();
     this.letters = this.splitWord2Letters(this.word);
     this.solvedWord = ['Place Here'];
  }

  splitWord2Letters(word:string){
    return word.split('').sort(function(){return 0.5-Math.random()});
  }

  verifySolvedWord(){
      let solved = this.solvedWord.filter(el => el !== 'Place Here');
      if ( solved.join('') === this.word ) {
          this.solved = true;
          this.errorMsg = '';
      }else {
        this.errorMsg = 'Wrong answer';
      }
  }

  resetLetters(){
    this.solvedWord = ['Place Here'];
    this.letters = this.splitWord2Letters(this.word);
  }
}
