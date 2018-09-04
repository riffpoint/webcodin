import React, { Component } from "react";
import "./scss/main.scss";

import { Route, Switch } from "react-router-dom";

import MattressPage from "./containers/MattressPage";
import Page404 from "./containers/Page404";

class App extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div id="main">
        <Switch>
          <Route exact path="/" component={MattressPage} />
          <Route component={Page404} />
        </Switch>
      </div>
    );
  }
}

export default App;
