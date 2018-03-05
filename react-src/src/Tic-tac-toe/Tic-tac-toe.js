import React from 'react';
import './Tic-tac-toe.css';

const tictactoe = (props)=>{
  return (
    <div className="tictactoe">
      <div className="card-content ">
        <span className="card-title">{props.stepFlag ? 'Your turn' : 'Please, wait of your opponent turn'}</span>
      </div>
      <div className="card-action tictactoe__xo">
        <ul className="xo hoverable" onClick={props.madeTurn}>
          {props.gameSteps.map((step, i)=><li className={"xo__item xo__item_" + i + " waves-effect waves-light"} key={i}>{step}</li>)}
        </ul>
      </div>
    </div>
  )
};

export default tictactoe;