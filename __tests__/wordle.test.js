import { jest } from "@jest/globals";

const mockIsWord = jest.fn(() => true);
jest.unstable_mockModule("../src/words.js", () => {
  return {
    getWord: jest.fn(() => "APPLE"),
    isWord: mockIsWord,
  };
});

const { Wordle, buildLetter } = await import("../src/wordle.js");

describe("building a letter object", () => {
  test("returns a letter object", () => {
    const letter = buildLetter("E", "PRESENT");
    expect(letter).toEqual({ letter: "E", status: "PRESENT" });
  });
});

describe("constructing a new Wordle game", () => {
  test("sets maxGuesses to 6 if no argument is passed", () => {
    const game = new Wordle();
    expect(game.maxGuesses).toBe(6);
  });

  test("sets maxGuesses to the argument passed", () => {
    const testMaxGuesses = 10;
    const game = new Wordle(testMaxGuesses);
    expect(game.maxGuesses).toBe(testMaxGuesses);
  });

  test("sets guesses to an array of length maxGuesses", () => {
    const testMaxGuesses = 10;
    const game = new Wordle(testMaxGuesses);
    expect(game.guesses.length).toBe(testMaxGuesses);
  });

  test("sets currGuess to 0", () => {
    const game = new Wordle();
    expect(game.currGuess).toBe(0);
  });

  test("sets word to a word from getWord", () => {
    const game = new Wordle();
    expect(game.word).toBe("APPLE");
  });
});

describe("building a guess array from a string", () => {
  test("sets the status of a correct letter to CORRECT", () => {
    const game = new Wordle();
    const guess = game.buildGuessFromWord("A____");
    expect(guess[0].status).toBe("CORRECT");
  });

  test("sets the status of a present letter to PRESENT", () => {
    const game = new Wordle();
    const guess = game.buildGuessFromWord("E____");
    expect(guess[0].status).toBe("PRESENT");
  });

  test("sets the status of an absent letter to ABSENT", () => {
    const game = new Wordle();
    const guess = game.buildGuessFromWord("Z____");
    expect(guess[0].status).toBe("ABSENT");
  });
});

describe("making a guess", () => {
  test("throws an error if no more guesses are allowed", () => {
    const game = new Wordle(1);
    game.appendGuess("GUESS");
    expect(() => game.appendGuess("GUESS")).toThrow();
  });

  test("throws an error if the guess is not of length 5", () => {
    const game = new Wordle();
    expect(() => game.appendGuess("LONG GUESS")).toThrow();
  });

  test("throws an error if the guess is not a word", () => {
    const game = new Wordle();
    mockIsWord.mockReturnValueOnce(false);
    expect(() => game.appendGuess("GUESS")).toThrow();
  });

  test("increments the current guess", () => {
    const game = new Wordle();
    game.appendGuess("GUESS");
    expect(game.currGuess).toBe(1);
  });
});

describe("checking if the Wordle has been solved", () => {
  test("returns true if the latest guess is the correct word", () => {
    const game = new Wordle();
    game.appendGuess("APPLE");
    expect(game.isSolved()).toBe(true);
  });

  test("returns false if the latest guess is not the correct word", () => {
    const game = new Wordle();
    game.appendGuess("GUESS");
    expect(game.isSolved()).toBe(false);
  });
});

describe("checking if the game should end", () => {
  test("returns true if the latest guess is the correct word", () => {
    const game = new Wordle();
    game.appendGuess("APPLE");
    expect(game.shouldEndGame()).toBe(true);
  });

  test("returns true if there are no more guesses left", () => {
    const game = new Wordle(1);
    game.appendGuess("GUESS");
    expect(game.shouldEndGame()).toBe(true);
  });

  test("returns false if no guess has been made", () => {
    const game = new Wordle();
    expect(game.shouldEndGame()).toBe(false);
  });

  test("returns false if there are guesses left and the word has not been guessed", () => {
    const game = new Wordle();
    game.appendGuess("GUESS");
    expect(game.shouldEndGame()).toBe(false);
  });
});
