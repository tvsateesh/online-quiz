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

  // Difficulty level and sight words
  difficulty: string = 'easy';
  sightWords = [
    { word: 'at', meaning: 'Used to indicate a place or time' },
    { word: 'it', meaning: 'Used to refer to a thing or animal' },
    { word: 'in', meaning: 'Inside or within something' },
    { word: 'is', meaning: 'Verb to be, present tense' },
    { word: 'on', meaning: 'Above or touching a surface' },
    { word: 'to', meaning: 'Toward a place or person' },
    { word: 'and', meaning: 'Used to connect words or phrases' },
    { word: 'the', meaning: 'Definite article used before nouns' },
    { word: 'he', meaning: 'Male pronoun' },
    { word: 'be', meaning: 'Verb meaning to exist' },
    { word: 'we', meaning: 'Plural pronoun for a group including the speaker' },
    { word: 'are', meaning: 'Plural form of to be' },
    { word: 'was', meaning: 'Past tense of to be' },
    { word: 'for', meaning: 'Indicating purpose or reason' },
    { word: 'you', meaning: 'Person being addressed' },
    { word: 'she', meaning: 'Female pronoun' },
    { word: 'that', meaning: 'Used to identify a specific thing' },
    { word: 'have', meaning: 'To possess or own' },
    { word: 'this', meaning: 'Used to identify a thing nearby' },
    { word: 'they', meaning: 'Plural pronoun for multiple people or things' },
    { word: 'with', meaning: 'Accompanied by' },
    { word: 'from', meaning: 'Indicating a starting point' }
  ];

  ngOnInit(): void {
    this.dictionary.getWords().subscribe((result: any) => {
      if (result) {
        console.log(result);
        this.allWords = result;
        this.loadWordsBasedOnDifficulty();
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

  loadWordsBasedOnDifficulty(): void {
    if (this.difficulty === 'easy') {
      // Use kindergarten sight words for easy level
      this.wordList = this.sightWords.map(sw => sw.word);
      console.log(`Loading easy level words (sight words): ${this.wordList.length} words available`);
    } else {
      // Use dictionary filtering for medium and hard levels
      this.wordList = Object.keys(this.allWords);
      if (this.difficulty === 'medium') {
        // Medium: 4-5 letter words
        this.wordList = this.wordList.filter((word: string) => word.length >= 4 && word.length <= 5);
      } else if (this.difficulty === 'hard') {
        // Hard: 5-6 letter words
        this.wordList = this.wordList.filter((word: string) => word.length >= 5 && word.length <= 6);
      }
      console.log(`Loading ${this.difficulty} words: ${this.wordList.length} words available`);
    }
  }

  setDifficulty(level: string): void {
    this.difficulty = level;
    this.loadWordsBasedOnDifficulty();
    this.getWord();
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
  letters: string[] = [];
  solved: boolean = false;
  answerRevealed: boolean = false;
  errorMsg: string = "";

  solvedWord: string[] = [];

  // Click-based letter placement
  addLetterToAnswer(letter: string, index: number) {
    // Find first empty slot
    const emptyIndex = this.solvedWord.findIndex(l => l === '');
    if (emptyIndex !== -1) {
      this.solvedWord[emptyIndex] = letter;
      this.letters.splice(index, 1);
    }
  }

  removeLetterFromAnswer(index: number) {
    const letter = this.solvedWord[index];
    if (letter !== '') {
      this.letters.push(letter);
      this.solvedWord[index] = '';
    }
  }

  placeLetterAt(letter: string, letterIndex: number, slotIndex: number) {
    // If slot is empty, place the letter
    if (this.solvedWord[slotIndex] === '') {
      this.solvedWord[slotIndex] = letter;
      this.letters.splice(letterIndex, 1);
    } else {
      // Swap with existing letter
      const existingLetter = this.solvedWord[slotIndex];
      this.solvedWord[slotIndex] = letter;
      this.letters[letterIndex] = existingLetter;
    }
  }

  getWord() {
    // Math.floor(Math.random() * 6) + 1
    //this.word = Math.random() + '' //* this.wordList.length-1 + '';//(Math.floor(Math.random() * this.wordList.length-1)+1).toString();
    this.errorMsg = "";
    this.solved = false;
    this.answerRevealed = false;
    
    // Get random word
    const randomIndex = Math.floor(Math.random() * this.wordList.length);
    this.word = this.wordList[randomIndex]
      .split("")
      .join("")
      .toUpperCase();
    
    // Initialize arrays
    this.letters = this.splitWord2Letters(this.word);
    // Create empty placeholder slots for the answer
    this.solvedWord = new Array(this.word.length).fill('');
  }

  splitWord2Letters(word: string) {
    return word.split("").sort(function () {
      return 0.5 - Math.random();
    });
  }

  verifySolvedWord() {
    const answer = this.solvedWord.join("");
    console.log("Checking answer:", answer, "vs", this.word);
    console.log("Solved word array:", this.solvedWord);
    
    if (answer === this.word && !this.solvedWord.includes('')) {
      this.solved = true;
      this.errorMsg = "";
      console.log("Correct answer!");
    } else if (this.solvedWord.includes('')) {
      this.solved = false;
      this.errorMsg = "Please fill all positions";
    } else {
      this.solved = false;
      this.errorMsg = "Wrong answer";
    }
  }

  resetLetters() {
    // Return all non-empty letters back to the scrambled area
    const usedLetters = this.solvedWord.filter(letter => letter !== '');
    this.letters = [...this.letters, ...usedLetters];
    // Reset to empty placeholders
    this.solvedWord = new Array(this.word.length).fill('');
    this.errorMsg = "";
    this.solved = false;
    this.answerRevealed = false;
  }

  showAnswer() {
    // Reveal the correct answer
    this.solvedWord = this.word.split('');
    this.letters = [];
    this.answerRevealed = true;
    this.errorMsg = "Answer revealed! Try another word.";
    console.log("Answer revealed:", this.word);
  }

  getDescription(){
    return this.allWords[this.word.toLocaleLowerCase()];
  }
}
