import React from 'react';
import './Registration.css';

const registration = (props)=>{
  return (
    <div className="registration">
      <div className="card-content">
        <span className="card-title">Welcome to tic-tac-toe game!</span>
        <p>Please, enter your name below and press send.</p>
      </div>
      <div className="card-action">
        <div className="row">
          <form className="col s12" onSubmit={props.regSubmit}>
            <div className="row">
              <div className="input-field col s12">
                <input id="name" type="text" required />
                <label htmlFor="name" data-error="wrong" data-success="right">Your name</label>
              </div>
            </div>
            <button className="waves-effect waves-light btn" type="submit">send</button>
          </form>
        </div>
      </div>
    </div>
  )
};

export default registration;