import React, { Component } from 'react';
import './Hangman.css';
import { randomWord } from './Words.js';
//import {getRandomLangName} from './Wordlist.js';
import step0 from './images/0.jpg';
import step1 from './images/1.jpg';
import step2 from './images/2.jpg';
import step3 from './images/3.jpg';
import step4 from './images/4.jpg';
import step5 from './images/5.jpg';
import step6 from './images/6.jpg';



class Hangman extends Component {


  
  static defaultProps = {
    maxWrong: 6,
    images: [step0, step1, step2, step3, step4, step5, step6],
  };

  constructor(props) {
    super(props);
    this.state = {
      mistake: 0,
      guessed: new Set([]),
      answer: randomWord(),
      emoji: "😃",
      score: 100,
      timer: 60, // Initialize the timer to 60 seconds
      
    };
    this.startTimer();

  }
  startTimer() {
    this.timerID = setInterval(() => {
      if (this.state.timer > 0) {
        this.setState((prevState) => ({ timer: prevState.timer - 1 }));
      } else {
        clearInterval(this.timerID);
        // You can add code here to handle what happens when the timer reaches 0.
        // For example, ending the game.
      }
    }, 1000);
    
  }
  stopTimer() {
    clearInterval(this.timerID);
  }
  

  handleGuess = (e) => {
    let letter = e.target.value;
    let isCorrectGuess = this.state.answer.includes(letter);
    let emoji = isCorrectGuess ? "😃" : "😢";

    // Calculate the new score based on mistakes and maxWrong
    const newMistake = isCorrectGuess ? this.state.mistake : this.state.mistake + 1;
    const newScore = Math.max(
      100 - (newMistake * (100 / this.props.maxWrong)),
      0
    );

    this.setState((st) => ({
      guessed: st.guessed.add(letter),
      emoji: emoji,
      mistake: newMistake,
      score: newScore,
    }));
  }

  
  

    guessedWord(){
        return this.state.answer.split("").map(letter => (this.state.guessed.has(letter) ? letter : " _ " ));

    }
    generateButtons() {
        const letters = "abcdefghijklmnopqrstuvwxyz";
        const firstHalf = Array.from(letters.slice(0, 13));
        const secondHalf = Array.from(letters.slice(13));
      
        return (
          <div className="row">
            <div className="col-lg-6">
              {firstHalf.map((letter) => this.renderButton(letter))}
            </div>
            <div className="col-lg-6">
              {secondHalf.map((letter) => this.renderButton(letter))}
            </div>
          </div>
        );
      }
      
      renderButton(letter) {
        return (
          <button
            className="btn btn-lg btn-primary m-2"
            key={letter}
            value={letter}
            onClick={this.handleGuess}
            disabled={this.state.guessed.has(letter)}
          >
            {letter}
          </button>
        );
      }
      
    
    resetButton = () => {
        this.setState({
            mistake:0,
            guessed:new Set([]),
            answer: randomWord(),
            timer: 60,
            score:0,
        })
        this.startTimer();
    }

    render() {
        const gameOver = this.state.mistake >= this.props.maxWrong || this.state.timer === 0; 
        let gameStat = this.generateButtons();
        const isWinner = this.guessedWord().join("") === this.state.answer;
       
        
        if (isWinner) {
          gameStat = "You Won!!";
          this.stopTimer();
        }
        if (gameOver) {
          gameStat = "You Lost!!";
          this.setState({
            
            score:0
        })
        }

        return (
            <div className='Hangman container'>
               <h1 className='text-center'>HANGMAN {this.state.emoji}</h1>
               <div className='float-right'>Wrong Guesses: {this.state.mistake} of {this.props.maxWrong} </div>
               <div className='text-center '>
                <img src={!gameOver ? this.props.images[this.state.mistake] :this.props.images[6] } alt="" />
               </div>
               <div className='text-center '>
                <p className=''>Guess the Programming Languages:</p>
                <p className=''> {!gameOver ? this.guessedWord() : this.state.answer } </p>
                <p className='text-xl'>
                    {gameStat}
                </p>
                {isWinner || gameOver ? (
            <p className=''>Score: {this.state.score}</p>
          ) : null}
          <div className="text-center">
  <p>Time Remaining: {this.state.timer} seconds</p>
</div>
                <button className="btn btn-info" onClick={this.resetButton} >Reset</button>
               </div>
     
            </div>
        )
    }
}
export default Hangman;
