import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { Component, OnInit } from "@angular/core";
import { DictionaryService } from "src/app/service/dictionary.service";

@Component({
  selector: "app-word-game",
  templateUrl: "./word-game.component.html",
  styleUrls: ["./word-game.component.scss"],
})
export class WordGameComponent implements OnInit {
  constructor(private dictionary: DictionaryService) {}
  // wordGameForm: any = '' ;
  lang: string = "english";
  allWords: any = {};

  ngOnInit(): void {
    this.dictionary.getWords().subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.allWords = result;
        this.wordList = Object.keys(this.allWords);
        this.wordList = this.wordList.filter(
          (word: string) => word.length <= 4
        );
        this.getWord();
      }
    });
    // this.wordGameForm = this.fb.group(
    //   {'lang': [null]}
    // );
    // this.wordGameForm = this.wordGameForm.get("lang").valueChanges
    // .subscribe((f : any) => {
    //   this.onLangChange(f);
    // })
  }

  onLangChange(f: any) {}

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
    
  ];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.Movies,  event.currentIndex,event.previousIndex);
  }

  // Transfer Items Between Lists
  wordList: any = [];
  word: string = "";
  letters: any[] = [];
  solved: boolean = false;
  errorMsg: string = "";

  solvedWord = [];

  onDrop(event: any) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,                
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  getWord() {
    // Math.floor(Math.random() * 6) + 1
    //this.word = Math.random() + '' //* this.wordList.length-1 + '';//(Math.floor(Math.random() * this.wordList.length-1)+1).toString();
    this.errorMsg = "";
    this.solved = false;
    this.word = this.wordList[
      Math.floor(Math.random() * this.wordList.length - 1) + 1
    ]
      .split("")
      .join("")
      .toUpperCase();
    this.letters = this.splitWord2Letters(this.word);
    this.solvedWord = [];
  }

  splitWord2Letters(word: string) {
    return word.split("").sort(function () {
      return 0.5 - Math.random();
    });
  }

  verifySolvedWord() {
    if (this.solvedWord.join("") === this.word) {
      this.solved = true;
      this.errorMsg = "";
    } else {
      this.errorMsg = "Wrong answer";
    }
  }

  resetLetters() {
    this.solvedWord = [];
    this.letters = this.splitWord2Letters(this.word);
    this.errorMsg = "";
  }

  getDescription(){
    return this.allWords[this.word.toLocaleLowerCase()];
  }
}
