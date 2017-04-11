import React from 'react';
import MainFooter from './main-footer';

export default function HorizontalWrapper(props) {
  return (
      <div id = "footer">
        <div className={props.isHidden ? "horizontal-wrapper videoBarHide" : "horizontal-wrapper videoBarShow"}>
            {props.children}
        </div>
      </div>
  );
}
