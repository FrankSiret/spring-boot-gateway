import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getEntity } from './gateway.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const GatewayDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const gatewayEntity = useAppSelector(state => state.gateway.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="gatewayDetailsHeading">
          <Translate contentKey="gatewaysApp.gateway.detail.title">Gateway</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewaysApp.gateway.id">Id</Translate>
            </span>
          </dt>
          <dd>{gatewayEntity.id}</dd>
          <dt>
            <span id="serialNumber">
              <Translate contentKey="gatewaysApp.gateway.serialNumber">Serial Number</Translate>
            </span>
          </dt>
          <dd>{gatewayEntity.serialNumber}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="gatewaysApp.gateway.name">Name</Translate>
            </span>
          </dt>
          <dd>{gatewayEntity.name}</dd>
          <dt>
            <span id="ipAddress">
              <Translate contentKey="gatewaysApp.gateway.ipAddress">Ip Address</Translate>
            </span>
          </dt>
          <dd>{gatewayEntity.ipAddress}</dd>
        </dl>
        <Button tag={Link} to="/gateway" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/gateway/${gatewayEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default GatewayDetail;
