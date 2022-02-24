import React, { FC, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Space, Card, Input } from 'antd';
import { Translate, translate } from 'react-jhipster';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';

import { getEntity } from './device.reducer';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import PageHeaderTitle from 'app/shared/layout/page-header-title';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import moment from 'moment';

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

  const title = translate('gatewaysApp.device.detail.title');

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home',
    },
    {
      path: '/device',
      breadcrumbName: translate('gatewaysApp.device.home.title'),
    },
    {
      path: `/device/${deviceEntity.id}`,
      breadcrumbName: title,
    },
  ];

  const item: FC<{ key: string; value?: string | number }> = ({ key, value }) => (
    <>
      <Col md={8}>
        <Text strong>{key}</Text>
      </Col>
      <Col md={16}>
        <Input readOnly value={value} />
      </Col>
    </>
  );

  return (
    <Space direction="vertical" className="device-info">
      <PageHeaderTitle
        className="device-info__heading"
        title={<Title level={2}>{title}</Title>}
        subtitle={translate('gatewaysApp.device.detail.subtitle')}
        routes={routes}
      />
      <div className="device-info__left">
        <Card title={translate('gatewaysApp.device.detail.title')} bordered={false}>
          <Row className="device-info__items" gutter={[16, 16]}>
            {item({ key: translate('gatewaysApp.device.id'), value: deviceEntity.id })}
            {item({ key: translate('gatewaysApp.device.uid'), value: deviceEntity.uid })}
            {item({ key: translate('gatewaysApp.device.vendor'), value: deviceEntity.vendor })}
            {item({
              key: translate('gatewaysApp.device.date'),
              value: deviceEntity.date ? moment(deviceEntity.date).format(APP_LOCAL_DATE_FORMAT) : null,
            })}
            {item({ key: translate('gatewaysApp.device.status'), value: deviceEntity.status })}
            {item({ key: translate('gatewaysApp.device.gateway'), value: deviceEntity.gateway ? deviceEntity.gateway.id : '' })}
          </Row>
        </Card>
        <Space className="gateway-info__left__buttons" size="middle">
          <Button onClick={backClick} icon={<ArrowLeftOutlined />}>
            <Translate contentKey="entity.action.back">Back</Translate>
          </Button>
          <Button type="primary" onClick={editClick} icon={<EditOutlined />}>
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </Button>
        </Space>
      </div>
    </Space>
  );
};

export default DeviceDetail;
