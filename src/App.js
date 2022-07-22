/* eslint-disable no-undef */
import "./App.css";

import StartScreen from "./components/StartScreen";

import { useCallback, useEffect, useState } from "react";
import { wordsList } from "./data/Words";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
    { id: 1, name: "start" },
    { id: 2, name: "game" },
    { id: 3, name: "end" },
];

function App() {
    const [gameStage, setGameStage] = useState(stages[0].name);
    const [words] = useState(wordsList);

    const [pickedWord, setPickedWord] = useState("");
    const [pickedCategory, setPickedCategory] = useState("");
    const [letters, setLetters] = useState([]);

    const [guessedLetters, setGuessedLetter] = useState([]);
    const [wrongLetters, setWrongLetters] = useState([]);
    const [guesses, setGuesses] = useState(3);
    const [score, setScore] = useState(0);

    const pickWordAndPickCategory = useCallback(() => {
        const categories = Object.keys(words);
        const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];
        // console.log(category);

        const word = words[category][Math.floor(Math.random() * words[category].length)];
        // console.log(word);

        return { word, category };
    }, [words]);

    const startGame = useCallback( () => {
        clearLetterStates();

        const { word, category } = pickWordAndPickCategory();

        let wordLetters = word.split("");
        wordLetters = wordLetters.map((l) => l.toLowerCase());

        // console.log(word, category);
        // console.log(wordLetters);

        setPickedWord(word);
        setPickedCategory(category);
        setLetters(wordLetters);
        setGameStage(stages[1].name);
    },[pickWordAndPickCategory]);

    const verifyLetter = (letter) => {
        const normalizedLetter = letter.toLowerCase();

        if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
            return;
        }

        if (letters.includes(normalizedLetter)) {
            setGuessedLetter((actualGuessedLetters) => [...actualGuessedLetters, normalizedLetter]);
        } else {
            setWrongLetters((actualWrongLetters) => [...actualWrongLetters, normalizedLetter]);
            setGuesses((actualGuesses) => actualGuesses - 1);
        }

    };

    const clearLetterStates = () => {
        setGuessedLetter([]);
        setWrongLetters([]);
    };

    useEffect(() => {
        if (guesses <= 0) {
            clearLetterStates();
            setGameStage(stages[2].name);
        }
    }, [guesses]);

    useEffect(() => {
        const uniqueLetters = [...new Set(letters)]

        if(guessedLetters.length === uniqueLetters.length) {
            setScore((actualScore) => (actualScore += 100))

            startGame()
        }
    }, [guessedLetters, letters, startGame])

    const retry = () => {
        setScore(0);
        setGuesses(3);
        setGameStage(stages[0].name);
    };

    return (
        <div className="App">
            {gameStage === "start" && <StartScreen startGame={startGame} />}
            {gameStage === "game" && (
                <Game
                    verifyLetter={verifyLetter}
                    pickedWord={pickedWord}
                    pickedCategory={pickedCategory}
                    letters={letters}
                    guessedLetters={guessedLetters}
                    wrongLetters={wrongLetters}
                    guesses={guesses}
                    score={score}
                />
            )}
            {gameStage === "end" && <GameOver retry={retry} score={score} />}
        </div>
    );
}

export default App;
