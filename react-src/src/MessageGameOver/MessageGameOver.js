import React from 'react';
import './MessageGameOver.css';

const messageGameOver = (props)=>{
  return (
    <div className="tictactoe">
      <div className="card-content ">        
        {props.winner === 'x' ? <span className="card-title">X WINS</span> : null}
        {props.winner === 'o' ? <span className="card-title">O WINS</span> : null}
        {props.winner === 'friendship' ? <span className="card-title">FRIENDSHIP WINS</span> : null}
      </div>
      <div>
        <a href={document.location.href} className="play-again waves-effect waves-light btn">Play again</a>
      </div>
      <div className="card-action tictactoe__xo">
        <ul className="xo hoverable" onClick={props.madeTurn}>
          <li className="xo__item animated tada"></li>
          <li className="xo__item animated tada"></li>
          <li className="xo__item animated tada"></li>
          <li className="xo__item animated tada"></li>
          <li className="xo__item animated tada"></li>
          <li className="xo__item animated tada"></li>
          <li className="xo__item animated tada"></li>
          <li className="xo__item animated tada"></li>
          <li className="xo__item animated tada"></li>
        </ul>
      </div>
    </div>
  )
};

export default messageGameOver;