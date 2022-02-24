import React, { useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Space } from 'antd';
import { translate, Translate } from 'react-jhipster';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';

import { getEntity } from './gateway.reducer';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import PageHeaderTitle from 'app/shared/layout/page-header-title';
import Title from 'antd/lib/typography/Title';

export const GatewayDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  const backClick = () => {
    props.history.replace('/gateway');
  };

  const editClick = () => {
    props.history.replace(`/gateway/${gatewayEntity.id}/edit`);
  };

  const gatewayEntity = useAppSelector(state => state.gateway.entity);

  const title = translate('gatewaysApp.gateway.detail.title');

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home',
    },
    {
      path: '/gateway',
      breadcrumbName: translate('gatewaysApp.gateway.home.title'),
    },
    {
      path: `/gateway/${gatewayEntity.id}`,
      breadcrumbName: title,
    },
  ];

  return (
    <Space direction="vertical" className="gateway-info">
      <PageHeaderTitle
        className="gateway-info__heading"
        title={<Title level={2}>{title}</Title>}
        subtitle={translate('gatewaysApp.gateway.detail.subtitle')}
        routes={routes}
      />
      <Col md="12">
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
        {/* <Button data-cy="entityDetailsBackButton" onClick={backClick} icon={<ArSpaceLeftOutlined />}>
          <Translate contentKey="entity.action.back">Back</Translate>
        </Button>
        <Button type="primary" onClick={editClick} icon={<EditOutlined />}>
          <Translate contentKey="entity.action.edit">Edit</Translate>
        </Button> */}
      </Col>
    </Space>
  );
};

export default GatewayDetail;
