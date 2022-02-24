import React, { useState, useEffect, FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Collapse, Divider, Space, Table, Tooltip } from 'antd';
import { Translate, TextFormat, translate } from 'react-jhipster';
import { SyncOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { IDevice } from 'app/shared/model/device.model';
import { APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ColumnsType } from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import AddModal from './add-modal';
import DeviceStatus from 'app/shared/components/device-status';
import { getDevices } from 'app/entities/gateway/gateway.reducer';
import { IGateway } from '../model/gateway.model';
import DeleteModal from './delete-modal';
const { Panel } = Collapse;

export interface IGatewayDevices {
  id: string;
}

export const GatewayDevice: FC<IGatewayDevices> = ({ id }) => {
  const dispatch = useAppDispatch();

  const location = useLocation();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

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

  const editClick = (record: IGateway) => e => {
    e.stopPropagation();
    setSelectedEntity({ ...record });
    setOpenEdit(true);
  };

  const deleteClick = (record: IGateway) => e => {
    e.stopPropagation();
    setSelectedEntity({ ...record });
    setOpenDelete(true);
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

  const acceptEdit = () => {
    setOpenEdit(false);
    onUpdate();
  };

  const cancelEdit = () => {
    setOpenEdit(false);
  };

  const acceptDelete = () => {
    setOpenDelete(false);
    onUpdate();
  };

  const cancelDelete = () => {
    setOpenDelete(false);
  };

  const columns: ColumnsType<IDevice> = [
    { key: 'uid', dataIndex: 'uid', title: <Translate contentKey="gatewaysApp.device.uid">UID</Translate> },
    { key: 'vendor', dataIndex: 'vendor', title: <Translate contentKey="gatewaysApp.device.vendor">Vendor</Translate> },
    {
      key: 'date',
      dataIndex: 'date',
      title: <Translate contentKey="gatewaysApp.device.date">Date</Translate>,
      render: date => (date ? <TextFormat type="date" value={date} format={APP_LOCAL_DATE_FORMAT} /> : null),
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
      render: (_text, record) => (
        <Space size="small">
          <Tooltip title={translate('entity.action.edit')}>
            <Button type="primary" size="small" icon={<EditOutlined />} onClick={editClick(record)} />
          </Tooltip>
          <Tooltip title={translate('entity.action.delete')}>
            <Button danger size="small" icon={<DeleteOutlined />} onClick={deleteClick(record)} />
          </Tooltip>
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
      {selectedEntity && <AddModal entity={selectedEntity} gatewayId={id} visible={openEdit} onOk={acceptEdit} onCancel={cancelEdit} />}
      {selectedEntity && <DeleteModal entity={selectedEntity} visible={openDelete} onOk={acceptDelete} onCancel={cancelDelete} />}
    </Collapse>
  );
};

export default GatewayDevice;
