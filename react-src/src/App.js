import React, { Component } from 'react';
import './App.css';
import Registration from './Registration/Registration';
import Chat from './Chat/Chat';
import TicTacToe from './Tic-tac-toe/Tic-tac-toe';
import Message from './Message/Message';
import MessageGameOver from './MessageGameOver/MessageGameOver';
import openSocket from 'socket.io-client';

// const socket = openSocket('http://localhost:5000');
const socket = openSocket.connect(document.location.href);

class App extends Component {

  state = {
    components: {
      registration: true,
      chat: false,
      tictactoe: false,
      message: false,
      messageGameOver: false
    },
    winner:'',
    playerName: '',
    playersArr: [],
    correspondence: [],
    gameSteps: ['','','','','','','','',''],    
    stepFlag: false // IF TRUE PLAYER CAN TURN    
  };

  // UPDATE GAME STEPS ARRAY
  updateSteps = (gameSteps, playerId)=>{
    console.log('made step');
    if (playerId !== socket.id) {
      this.setState({    
        gameSteps: gameSteps,      
        stepFlag: true // CHANGE FLAG IF STEP WAS MADE BY ANOTHER PLAYER
      });
     } else { // 
      this.setState({ 
        gameSteps: gameSteps,
        stepFlag: false // FLAG SHOULD STAY FALSE
      });
    }
  };
  
  // MAKE PLAYERS ARRAY
  playersArrGen = (allPlayers)=>{
    let playersArr = [];
    allPlayers.forEach(player=>{
      playersArr.push(player.name);
    })
    return playersArr;
  };

  // PLAYER REGISTRATION HANDLER
  regSubmitHandler = (e) => {
    e.preventDefault();
    let myName = e.target['name'].value;
    console.log(socket.id)
    // RENDER GAME AND CHAT
    this.setState({
      components: {
        registration: false,
        chat: true,
        tictactoe: false,
        message: true,
        messageGameOver: false
      },
      playerName: myName
    });

    // SEND PLAYER'S NAME TO SERVER
    socket.emit('my name is', myName);

    // RECIEVE PLAYERS LIST
    socket.on('players list', allPlayers=>{
      this.setState({
        playersArr: this.playersArrGen(allPlayers)
      });
    });

    // RECIEVE ALL CORRESPONDENCE
    socket.on('send correspondence', correspondence=>{
      this.setState({correspondence: correspondence});
    });

    // UPDATE STEPS FOR SECOND PLAYER
    socket.on('made step', (gameSteps, playerId)=>{
      this.updateSteps(gameSteps, playerId);
    });

    // INFORMATION FOR FIRST PLAYER
    socket.on('second player conncted', ()=>{
      this.setState({
        components: {
          registration: false,
          chat: true,
          tictactoe: true, // MAKE FIELD VISIBLE
          message: false,
          messageGameOver: false
        }
      });
    });

    // CHANGE STEP FLAG FOR FIRST PLAYER
    socket.on('you can turn', ()=>{
      this.setState({
        stepFlag: true
      });
    });

  };

  // CHAT MESSAGE HANDLER  
  msgSubmitHandler = (e)=>{
    e.preventDefault();
    // SEND
    let msg = e.target['message'].value;
    socket.emit('send message', msg, this.state.playerName);
    e.target['message'].value = '';
    //RECIEVE
    socket.on('send correspondence', correspondence=>{
      this.setState({correspondence: correspondence});
    });
  };

  // GAME TURN HANDLER
  madeTurnHandler = (e)=>{
    e.preventDefault();
    if (e.target.innerText ==='' && this.state.stepFlag) {
      // TURN EMIT
      socket.emit('player make step', e.target.classList[1]);
      // CHANGE STEPFLAG
      this.setState({         
        stepFlag: false
      });

    } else {(console.log('you are bad boy'))};
    
    // STEPS ARRAY SHOULD BE CHANGED
    socket.on('made step', (gameSteps, playerId)=>{
      this.updateSteps(gameSteps, playerId);
      this.checkForGameOver(gameSteps);
    });
  };

  checkForGameOver = (gameSteps) =>{
    const combos = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let os = []; // NUMBERS OF ALL Os IN GAMESTEPS ARRAY
    let xs = []; // NUMBERS OF ALL Xs IN GAMESTEPS ARRAY

    // FILL OS AND XS ARRAYS
    gameSteps.forEach((cell, i) =>{
      if(cell === 'x') xs.push(i)
      else if (cell === 'o') os.push(i);
    });

    // SEARCH COMBOS IN OS AND XS ARRAYS
    combos.forEach(combo=>{
      // COUNTERS START WITH 0
      let xCount = 0;
      let oCount = 0;

      // SERACH IN XS ARRAY
      for (let i = 0; i < combo.length; i++) {
        if (xs.indexOf(combo[i]) !== -1) {
          xCount++; // INCREASE COUNTER IF COMBO-ITEM IN XS 
          if (xCount === 3) {
            this.setState({
              components: {
                registration: false,
                chat: true,
                tictactoe: false,
                message: false,
                messageGameOver: true
              },
              winner: 'x'
            });
            return console.log('X WIN');
          } // IF FOUND - GAME OVER
        } else { // IF AT LEAST ONE OF COMBO-ITEMS NOT IN XS
          xCount = 0; // RESET COUNTER
          break; // BREAK FOR-LOOP
        };
      };

      // SEARCH IN OS ARRAY
      for (let i = 0; i < combo.length; i++) {
        if (os.indexOf(combo[i]) !== -1) {
          oCount++; // INCREASE COUNTER IF COMBO-ITEM IN OS
          if (oCount === 3) {
            this.setState({
              components: {
                registration: false,
                chat: true,
                tictactoe: false,
                message: false,
                messageGameOver: true
              },
              winner: 'o'
            });
            return console.log('O WIN');
          } // IF FOUND - GAME OVER
        } else { // IF AT LEAST ONE OF COMBO-ITEMS NOT IN OS
          oCount = 0; // RESET COUNTER
          break; // BREAK FOR-LOOP
        };
      };
    });
    if (gameSteps.indexOf('') === -1) {
      this.setState({
        components: {
          registration: false,
          chat: true,
          tictactoe: false,
          message: false,
          messageGameOver: true
        },
        winner: 'friendship'
      });
      return console.log('Game over. Friendship win.')
    } ;
  };
    
    



  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col s12">
              <div className="card blue-grey lighten-5 hoverable">
                {this.state.components.registration ? <Registration regSubmit={this.regSubmitHandler} />  : null}
                {this.state.components.message ? <Message /> : null}
                {this.state.components.messageGameOver ? <MessageGameOver winner={this.state.winner}/> : null}
                {this.state.components.tictactoe ? <TicTacToe 
                  madeTurn={this.madeTurnHandler}
                  gameSteps={this.state.gameSteps}
                  stepFlag={this.state.stepFlag}
                /> : null}
                {this.state.components.chat ? <Chat
                  playersList={this.state.playersArr}
                  msgSubmit={this.msgSubmitHandler}
                  newMsg={this.state.correspondence}
                /> : null}                
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
};

export default App;
