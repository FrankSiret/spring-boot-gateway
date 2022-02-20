import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'antd';
import { Translate, TextFormat } from 'react-jhipster';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';

import { getEntity } from './device.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

export const DeviceDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const backClick = () => {
    props.history.replace('/device');
  };

  const editClick = () => {
    props.history.replace(`/device/${deviceEntity.id}/edit`);
  };

  const deviceEntity = useAppSelector(state => state.device.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="deviceDetailsHeading">
          <Translate contentKey="gatewaysApp.device.detail.title">Device</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewaysApp.device.id">Id</Translate>
            </span>
          </dt>
          <dd>{deviceEntity.id}</dd>
          <dt>
            <span id="uID">
              <Translate contentKey="gatewaysApp.device.uID">U ID</Translate>
            </span>
          </dt>
          <dd>{deviceEntity.uID}</dd>
          <dt>
            <span id="vendor">
              <Translate contentKey="gatewaysApp.device.vendor">Vendor</Translate>
            </span>
          </dt>
          <dd>{deviceEntity.vendor}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="gatewaysApp.device.date">Date</Translate>
            </span>
          </dt>
          <dd>{deviceEntity.date ? <TextFormat value={deviceEntity.date} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="status">
              <Translate contentKey="gatewaysApp.device.status">Status</Translate>
            </span>
          </dt>
          <dd>{deviceEntity.status}</dd>
          <dt>
            <Translate contentKey="gatewaysApp.device.gateway">Gateway</Translate>
          </dt>
          <dd>{deviceEntity.gateway ? deviceEntity.gateway.id : ''}</dd>
        </dl>
        <Button data-cy="entityDetailsBackButton" onClick={backClick} icon={<ArrowLeftOutlined />}>
          <Translate contentKey="entity.action.back">Back</Translate>
        </Button>
        <Button type="primary" onClick={editClick} icon={<EditOutlined />}>
          <Translate contentKey="entity.action.edit">Edit</Translate>
        </Button>
      </Col>
    </Row>
  );
};

export default DeviceDetail;
