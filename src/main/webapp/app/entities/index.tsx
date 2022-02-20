import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Gateway from './gateway';
import Device from './device';
import PageNotFound from 'app/shared/error/page-not-found';

const Routes = ({ match }) => (
  <div>
    <Switch>
      <ErrorBoundaryRoute path={`${match.url}gateway`} component={Gateway} />
      <ErrorBoundaryRoute path={`${match.url}device`} component={Device} />
      <ErrorBoundaryRoute component={PageNotFound} />
    </Switch>
  </div>
);

export default Routes;
