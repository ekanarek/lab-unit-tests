import { getWord, isWord } from './words.js';

const LETTER_STATUSES = {
  ABSENT: 'ABSENT',
  PRESENT: 'PRESENT',
  CORRECT: 'CORRECT',
};
const { ABSENT, PRESENT, CORRECT } = LETTER_STATUSES;

// Construct a letter object.
export function buildLetter(letter, status) {
  return {
    letter: letter,
    status: status,
  };
}

export class Wordle {
  wordSize = 5;

  maxGuesses = 6;

  constructor(maxGuesses) {
    this.maxGuesses = maxGuesses ?? this.maxGuesses;
    this.guesses = new Array(this.maxGuesses).fill(null); // array of letter objects
    this.word = getWord();
    this.currGuess = 0;
  }

  // Build a guess from a word.
  buildGuessFromWord(word) {
    return word.split('').map((letter, i) => {
      let status;
      if (this.word[i] === letter) {
        status = CORRECT;
      } else if (this.word.includes(letter)) {
        status = PRESENT;
      } else {
        status = ABSENT;
      }

      return buildLetter(letter, status);
    });
  }

  // Append a guess to the guesses array and increment the current guess.
  appendGuess(word) {
    const normalizedWord = word.toUpperCase();

    if (this.currGuess >= this.maxGuesses) {
      throw new Error('No more guesses allowed');
    }

    if (normalizedWord.length !== this.wordSize) {
      throw new Error('Guess must be of length 5');
    }

    if (!isWord(normalizedWord)) {
      throw new Error('Guess must be a word');
    }

    this.guesses[this.currGuess] = this.buildGuessFromWord(normalizedWord);
    this.currGuess += 1;

    return this;
  }

  // Return true if the latest guess is the correct word
  isSolved() {
    const latest = this.guesses[this.currGuess - 1];
    return latest?.every(({ status }) => status === CORRECT) ?? false;
  }

  // Check if the game should end
  shouldEndGame() {
    return this.isSolved() || this.currGuess >= this.maxGuesses;
  }
}
