import React from 'react';
import { Switch } from 'react-router-dom';

import ErrorBoundaryRoute from 'app/shared/error/error-boundary-route';

import Gateway from './gateway';
import GatewayDetail from './gateway-detail';
import GatewayUpdate from './gateway-update';
import GatewayDeleteDialog from './gateway-delete-dialog';

import './gateway.scss';

const Routes = ({ match }) => (
  <>
    <Switch>
      <ErrorBoundaryRoute exact path={`${match.url}/new`} component={GatewayUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id/edit`} component={GatewayUpdate} />
      <ErrorBoundaryRoute exact path={`${match.url}/:id`} component={GatewayDetail} />
      <ErrorBoundaryRoute path={match.url} component={Gateway} />
    </Switch>
    <ErrorBoundaryRoute exact path={`${match.url}/:id/delete`} component={GatewayDeleteDialog} />
  </>
);

export default Routes;
