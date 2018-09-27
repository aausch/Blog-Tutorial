import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import { Home } from '../../components';
import { Viewer } from '../../components';

const App = (props) => {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/view/:id" component={Viewer} />
    </Switch>
  )
}

export default withRouter(App);
