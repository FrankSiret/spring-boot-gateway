import React, { useState, useEffect, FC } from 'react';
import { Link, RouteComponentProps, useLocation } from 'react-router-dom';
import { Button, Collapse, Divider, Form, Modal, Space, Table, Tag, Tooltip } from 'antd';
import { Translate, TextFormat, getSortState, translate } from 'react-jhipster';
import { SettingOutlined, SyncOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { IDevice } from 'app/shared/model/device.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ColumnsType } from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import AddModal from './add-modal';
import DeviceStatus from 'app/shared/components/device-status';
import { getDevices } from 'app/entities/gateway/gateway.reducer';
const { Panel } = Collapse;

export interface IGatewayDevices {
  id: string;
}

export const GatewayDevice: FC<IGatewayDevices> = ({ id }) => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const [openAdd, setOpenAdd] = useState(false);

  const [selectedEntity, setSelectedEntity] = useState<IDevice>(null);

  useEffect(() => {
    onUpdate();
  }, []);

  const loading: boolean = useAppSelector(state => state.gateway.devicesLoading);
  const devices: IDevice[] = useAppSelector(state => state.gateway.devices);

  const onUpdate = () => {
    dispatch(getDevices(id));
  };

  const addClick = e => {
    e.stopPropagation();
    setSelectedEntity({});
    setOpenAdd(true);
  };

  const syncClick = e => {
    e.stopPropagation();
    onUpdate();
  };

  const acceptAdd = () => {
    setOpenAdd(false);
    onUpdate();
  };

  const cancelAdd = () => {
    setOpenAdd(false);
  };

  const columns: ColumnsType<IDevice> = [
    { key: 'uID', dataIndex: 'uID', title: <Translate contentKey="gatewaysApp.device.uID">UID</Translate> },
    { key: 'vendor', dataIndex: 'vendor', title: <Translate contentKey="gatewaysApp.device.vendor">Vendor</Translate> },
    {
      key: 'date',
      dataIndex: 'date',
      title: <Translate contentKey="gatewaysApp.device.date">Date</Translate>,
      render: date => (date ? <TextFormat type="date" value={date} format={APP_DATE_FORMAT} /> : null),
    },
    {
      key: 'status',
      dataIndex: 'status',
      title: <Translate contentKey="gatewaysApp.device.status">Status</Translate>,
      render: (_status, record) => <DeviceStatus onUpdate={onUpdate} gatewayId={id} record={record} />,
    },
    {
      key: 'action',
      title: <Translate contentKey="gatewaysApp.device.action">Action</Translate>,
      width: 90,
      render: (_text, gateway) => (
        <Space size="small">
          <Link to={`/device/${gateway.id}/edit${location.search}`}>
            <Button
              type="primary"
              size="small"
              data-cy="entityEditButton"
              icon={<EditOutlined />}
              title={translate('entity.action.edit')}
            />
          </Link>
          <Button danger size="small" data-cy="entityEditButton" icon={<DeleteOutlined />} title={translate('entity.action.delete')} />
        </Space>
      ),
    },
  ];

  const header = (
    <Space className="gateway-devices__header" size="middle">
      <Title level={4}>
        <Translate contentKey="gatewaysApp.gateway.devices">Devices</Translate>
      </Title>
      <Tooltip title={translate('gatewaysApp.device.home.createLabel')}>
        <Button onClick={addClick} icon={<PlusOutlined />} shape="circle" />
      </Tooltip>
      <Divider className="divider" />
      <Tooltip title={translate('gatewaysApp.device.home.refreshListLabel')}>
        <Button onClick={syncClick} icon={<SyncOutlined spin={loading} />} shape="circle" />
      </Tooltip>
    </Space>
  );

  return (
    <Collapse defaultActiveKey={['table']} ghost>
      <Panel className="gateway-devices__header-panel" header={header} key="table">
        <Table columns={columns} dataSource={devices} pagination={false} rowKey={record => record.id} scroll={{ y: 400 }} />
      </Panel>
      <AddModal isNew gatewayId={id} visible={openAdd} onOk={acceptAdd} onCancel={cancelAdd} />
    </Collapse>
  );
};

export default GatewayDevice;
