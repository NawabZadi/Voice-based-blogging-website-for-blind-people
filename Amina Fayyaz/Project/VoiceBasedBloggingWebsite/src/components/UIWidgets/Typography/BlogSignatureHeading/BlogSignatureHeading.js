import React, { useContext } from "react";

import ThemeContext from "../../../../contexts/ThemeContext";

import "./style.scss";

function BlogSignatureHeading(props) {
  const theme = useContext(ThemeContext);

  return (
    <h1
      style={{ color: props.theme ? theme[props.theme].color : "inherit" }}
      className="py-formatted-blog-heading"
    >
      <span className="py-formatted-blog-heading--margin"></span>
      <span className="py-formatted-blog-heading--print">{props.children}</span>
    </h1>
  );
}

export default BlogSignatureHeading;
