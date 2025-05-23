import React from "react";

import "./style.scss";

function DotList(props) {
  return (
    <ul className="py-dot-list py-fnt-s--1p2 py-fnt-w--bold">
      {props.items.map((item) => {
        return (
          <li key={item} className="py-dot-list--item">
            <span className="blog-authored--author">{item}</span>
          </li>
        );
      })}
    </ul>
  );
}

export default DotList;
