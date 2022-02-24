import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Space, Input, Table, Tag, Card } from 'antd';
import { TextFormat, translate, Translate } from 'react-jhipster';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';

import { getDevices, getEntity } from './gateway.reducer';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import PageHeaderTitle from 'app/shared/layout/page-header-title';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import { ColumnsType } from 'antd/lib/table';
import { IDevice } from 'app/shared/model/device.model';
import { Status } from 'app/shared/model/enumerations/status.model';

export const GatewayDetail = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const devices: IDevice[] = useAppSelector(state => state.gateway.devices);

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
    dispatch(getDevices(props.match.params.id));
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

  const item = ({ key, value }) => (
    <>
      <Col md={8}>
        <Text strong>{key}</Text>
      </Col>
      <Col md={16}>
        <Input readOnly value={value} />
      </Col>
    </>
  );

  const columns: ColumnsType<IDevice> = [
    {
      key: 'uid',
      dataIndex: 'uid',
      title: <Translate contentKey="gatewaysApp.device.uid">UID</Translate>,
    },
    { key: 'vendor', dataIndex: 'vendor', title: <Translate contentKey="gatewaysApp.device.vendor">Vendor</Translate> },
    {
      key: 'date',
      dataIndex: 'date',
      title: <Translate contentKey="gatewaysApp.device.date">Date</Translate>,
      render: date => (date ? <TextFormat type="date" value={date} format={APP_LOCAL_DATE_FORMAT} /> : null),
    },
    {
      key: 'status',
      title: <Translate contentKey="gatewaysApp.device.status">Status</Translate>,
      dataIndex: 'status',
      render: status => <Tag color={status === Status.ONLINE ? 'green' : 'volcano'}>{status}</Tag>,
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
      <div className="gateway-info__left">
        <Row gutter={16}>
          <Col md={12}>
            <Card title={translate('gatewaysApp.gateway.detail.title')} bordered={false}>
              <Row className="gateway-info__items" gutter={[16, 16]}>
                {item({ key: translate('gatewaysApp.gateway.id'), value: gatewayEntity.id })}
                {item({ key: translate('gatewaysApp.gateway.serialNumber'), value: gatewayEntity.serialNumber })}
                {item({ key: translate('gatewaysApp.gateway.name'), value: gatewayEntity.name })}
                {item({ key: translate('gatewaysApp.gateway.ipAddress'), value: gatewayEntity.ipAddress })}
                {item({ key: translate('gatewaysApp.gateway.devices'), value: devices.length ?? 0 })}
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
          </Col>
          <Col md={12}>
            <Card title={translate('gatewaysApp.device.home.title')} bordered={false}>
              <Table columns={columns} dataSource={devices} rowKey={record => record.id} pagination={false} />
            </Card>
          </Col>
        </Row>
      </div>
    </Space>
  );
};

export default GatewayDetail;
