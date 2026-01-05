import { Component, OnInit } from '@angular/core';

interface Sentence {
  text: string;
  words: string[];
  difficulty: string;
}

interface Word {
  text: string;
  originalIndex: number;
  id: string;
}

@Component({
  selector: 'app-sentence-game',
  templateUrl: './sentence-game.component.html',
  styleUrls: ['./sentence-game.component.scss'],
})
export class SentenceGameComponent implements OnInit {
  
  difficulty: string = 'easy';
  currentSentence: Sentence | null = null;
  shuffledWords: Word[] = [];
  orderedWords: Word[] = [];
  isCorrect: boolean = false;
  showMessage: boolean = false;
  messageText: string = '';
  messageType: 'success' | 'error' = 'error';
  gameLoaded: boolean = false;
  
  sentences = {
    easy: [
      'The cat sat on the mat',
      'I love to play games',
      'The sun is very bright',
      'She eats green apples',
      'Dogs are very friendly',
      'The bird can fly high',
      'I like to read books',
      'The flower is red',
      'He plays football well',
      'We have a big house',
    ],
    medium: [
      'The quick brown fox jumps over the lazy dog',
      'Learning new things is always fun and exciting',
      'She decided to go for a walk in the park',
      'Every morning I drink coffee before breakfast',
      'The students listened carefully to their teacher',
      'I enjoy spending time with my family members',
      'Technology has changed the way we live today',
      'The restaurant serves the best pizza in town',
      'He worked hard to achieve his dreams',
      'The conference will be held next month',
    ],
    hard: [
      'The government implemented a comprehensive policy to address environmental concerns',
      'Artificial intelligence is revolutionizing industries across the global marketplace',
      'Sustainable development requires cooperation between governments and corporations',
      'The research team discovered a breakthrough in medical science yesterday',
      'Effective communication skills are essential for professional success today',
      'Educational institutions must adapt to modern technological advancements',
      'Climate change presents unprecedented challenges to civilization worldwide',
      'The pharmaceutical company invested millions in innovative drug development',
      'Cybersecurity has become critical in protecting personal data online',
      'Economic growth depends on maintaining stable political relationships',
    ]
  };

  constructor() {}

  ngOnInit(): void {
    this.loadNewSentence();
  }

  setDifficulty(level: string): void {
    this.difficulty = level;
    this.loadNewSentence();
  }

  loadNewSentence(): void {
    const sentenceList = this.sentences[this.difficulty as keyof typeof this.sentences];
    const randomIndex = Math.floor(Math.random() * sentenceList.length);
    const sentence = sentenceList[randomIndex];
    
    const words = sentence.split(' ');
    this.currentSentence = {
      text: sentence,
      words: words,
      difficulty: this.difficulty,
    };

    this.shuffledWords = this.shuffleWords(words);
    this.orderedWords = [];
    this.isCorrect = false;
    this.showMessage = false;
    this.messageText = '';
    this.gameLoaded = true;
    
    console.log(`Loaded ${this.difficulty} sentence:`, sentence);
    console.log('currentSentence:', this.currentSentence);
    console.log('shuffledWords:', this.shuffledWords);
  }

  shuffleWords(words: string[]): Word[] {
    const wordObjects: Word[] = words.map((word, index) => ({
      text: word,
      originalIndex: index,
      id: `word-${index}-${Math.random()}`,
    }));

    // Fisher-Yates shuffle
    for (let i = wordObjects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [wordObjects[i], wordObjects[j]] = [wordObjects[j], wordObjects[i]];
    }

    return wordObjects;
  }

  addWordToOrder(word: Word, index: number): void {
    this.shuffledWords.splice(index, 1);
    this.orderedWords.push(word);
  }

  removeWordFromOrder(index: number): void {
    const word = this.orderedWords.splice(index, 1)[0];
    this.shuffledWords.push(word);
  }

  checkOrder(): void {
    if (this.orderedWords.length !== this.currentSentence!.words.length) {
      this.messageType = 'error';
      this.messageText = 'Please arrange all the words!';
      this.showMessage = true;
      return;
    }

    const correctOrder = this.currentSentence!.words.every(
      (word, index) => this.orderedWords[index].text === word
    );

    if (correctOrder) {
      this.isCorrect = true;
      this.messageType = 'success';
      this.messageText = 'Excellent! You arranged the sentence correctly!';
    } else {
      this.messageType = 'error';
      this.messageText = 'Not quite right. Try again!';
    }

    this.showMessage = true;
  }

  resetOrder(): void {
    this.shuffledWords = [
      ...this.shuffledWords,
      ...this.orderedWords,
    ];
    
    // Re-shuffle
    for (let i = this.shuffledWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.shuffledWords[i], this.shuffledWords[j]] = [this.shuffledWords[j], this.shuffledWords[i]];
    }

    this.orderedWords = [];
    this.showMessage = false;
    this.isCorrect = false;
  }

  revealSentence(): void {
    this.orderedWords = [...this.currentSentence!.words.map((word, index) => ({
      text: word,
      originalIndex: index,
      id: `word-revealed-${index}`,
    }))];
    this.shuffledWords = [];
    this.messageType = 'success';
    this.messageText = 'Here is the correct order:';
    this.showMessage = true;
  }

  getOrderedSentence(): string {
    return this.orderedWords.map(w => w.text).join(' ');
  }
}
