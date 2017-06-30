"use strict";

import React from "react";
import {
  Router,
  Route,
  browserHistory,
  IndexRedirect
} from "react-router";

import Main from "./components/main.jsx";

const routes = (
  <Router history={browserHistory}>
    <Route path="/" components={Main}></Route>
  </Router>
);

export default routes;
