import React from 'react';
import './horizontal-box.css'

export default function HorizontalBoxComponent (props) {
  return (
    <div className="horizontal-box" onClick={props.onClick}>
      {props.children}
    </div>
  );
}
