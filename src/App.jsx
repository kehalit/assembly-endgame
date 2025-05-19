import React from "react"
import { languages } from './languages'
import { useState } from 'react'
import clsx from "clsx"


export default function AssemblyEndgame() {

  //state values
  const [currentWord, setCurrentWord] = useState("react")
  const [guessedLetters, setGuessedLetters] = useState([])

  // Derived values
  const wrongGuessCount = 
    guessedLetters.filter(letter => !currentWord.includes(letter)).length

    const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
    const isGameLost = wrongGuessCount >= languages.length -1 
    const isGameOver = isGameWon || isGameLost
  
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


  const letterElements = currentWord.split("").map((letter, index) => (
    <span key={index}>{guessedLetters.includes(letter) ? letter.toUpperCase() : ""}</span>
  )
  )

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
        >
            {char.toUpperCase()}
        </button>
    )
})

const gameStatusClass = clsx("game-status", {
  won: isGameWon,
  lost: isGameLost
})
  return (

    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
      </header>

      <section className={gameStatusClass}>
                {isGameOver ? (
                    isGameWon ? (
                        <>
                            <h2>You win!</h2>
                            <p>Well done! 🎉</p>
                        </>
                    ) : (
                        <>
                            <h2>Game over!</h2>
                            <p>You lose! Better start learning Assembly 😭</p>
                        </>
                    )
                ) : (
                        null
                    )
                }
            </section>
      <section className="language-chips">
        {languageElements}

      </section>

      <section className="word">
        {letterElements}
      </section>
      <section className="keyboard">{keyboardElements}</section>
      {isGameOver && <button className="new-game">New Game</button>}
    </main>
  )
}
