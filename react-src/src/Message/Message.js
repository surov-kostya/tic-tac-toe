import React from 'react';
import './Message.css';

const message = (props)=>{
  return (
    <div className="message">
      <div className="card-content">
        <div className="msg-title">Please, wait for an opponent...</div>
        <div className="msg-text">You can invite him by share the link: {document.location.href}</div>
      </div>
    </div>
  )
};

export default message;