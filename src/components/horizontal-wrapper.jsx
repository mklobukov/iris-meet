import React from 'react';

export default function HorizontalWrapper(props) {
  return (
      <div id = "footer">
        <div className={props.isHidden ? "horizontal-wrapper videoBarHide" : "horizontal-wrapper videoBarShow"}>
            {props.children}
        </div>
      </div>
  );
}
