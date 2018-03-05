import React from 'react';
import './Chat.css';

const chat = (props)=>{
  return (
    <div className="chat">
      <div className="card-content">
        <span className="card-title">In chat now:</span>
        <ul className="player-list">{props.playersList.map((name, i)=><li className="player-name hoverable" key={i}>{name}</li>)}</ul>
        <ul className="correspondence">{props.newMsg.map((msg, i)=><li className="msg hoverable" key={i}>{msg}</li>)}</ul>
      </div>
      <div className="card-action">
        <div className="row">
          <form className="col s12" onSubmit={props.msgSubmit}>
            <div className="row">
              <div className="input-field col s12">
                <input id="message" type="text" required />
                <label htmlFor="message" data-error="wrong" data-success="right">Your message</label>
              </div>
            </div>
            <button className="waves-effect waves-light btn" type="submit">send</button>
          </form>
        </div>
      </div>
    </div>
  )
};

export default chat;