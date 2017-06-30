"use strict";

import React from "react";

class Title extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: props.title
    }

  }

  render() {

    return(
      <h1>{this.state.title}</h1>
    );

  }
}

export default Title;
