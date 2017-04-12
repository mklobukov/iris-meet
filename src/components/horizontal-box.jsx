import React from 'react';

export default function HorizontalBoxComponent (props) {
  return (
    <div className="horizontal-box" onClick={props.onClick}>
      {props.children}
    </div>
  );
}
