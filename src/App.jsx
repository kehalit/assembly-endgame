import React from "react"
import { languages } from './languages'
import { useState } from 'react'
import clsx from "clsx"
import { getFarewellText, getRandomWord } from './utils'
import Confetti from "react-confetti"


export default function AssemblyEndgame() {

  //state values
  const [currentWord, setCurrentWord] = useState(getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])

  // Derived values
  const numGuessesLeft = languages.length - 1
  const wrongGuessCount =
    guessedLetters.filter(letter => !currentWord.includes(letter)).length

  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  //static values
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters =>
      prevLetters.includes(letter) ?
        prevLetters :
        [...prevLetters, letter])
  }


  const languageElements = languages.map((lang, index) => {


    const isLanguageLost = index < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    return (
      <span
        className={`chip ${isLanguageLost ? "lost" : ""}`}
        //className ="chip"
        style={styles}
        key={lang.name}
      >
        {lang.name}
      </span>
    )
  })



  const letterElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    )
  })

  const keyboardElements = alphabet.split("").map(char => {
    const isGuessed = guessedLetters.includes(char)
    const isCorrect = isGuessed && currentWord.includes(char)
    const isWrong = isGuessed && !currentWord.includes(char)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })


    return (
      <button
        className={className}
        key={char}
        onClick={() => addGuessedLetter(char)}
        disabled={isGameOver}
        aria-disable={guessedLetters.includes}
      >
        {char.toUpperCase()}
      </button>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect > 0) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1].name)}
        </p>
      )
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      )
    }

    return null
  }

  function startNewGame() {

    setCurrentWord(getRandomWord())
    setGuessedLetters([])

  }

  return (

    <main>
      {
        isGameWon &&
        <Confetti
          recycle={false}
          numberOfPieces={1000}
        />
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>

      <section
        aria-live="polite"
        role="status"
        className={gameStatusClass}
      >
        {renderGameStatus()}
      </section>
      <section className="language-chips">
        {languageElements}

      </section>

      <section className="word">
        {letterElements}
      </section>
      <section
        className="sr-only"
        aria-live="polite"
        role="status"
      >
        <p>
          {currentWord.includes(lastGuessedLetter) ?
            `Correct! The letter ${lastGuessedLetter} is in the word.` :
            `Sorry, the letter ${lastGuessedLetter} is not in the word.`
          }
          You have {numGuessesLeft} attempts left.
        </p>
        <p>Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank.")
          .join(" ")}</p>

      </section>
      <section className="keyboard">
        {keyboardElements}
      </section>
      {isGameOver && <button className="new-game" onClick={startNewGame}>New Game</button>}
    </main>
  )
}
