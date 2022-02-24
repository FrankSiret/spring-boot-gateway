import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Form, Input, DatePicker, Select, Space, Spin, Alert } from 'antd';
import { Translate, translate } from 'react-jhipster';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import { getEntity, updateEntity } from './device.reducer';
import { convertDateTimeToServer } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Status } from 'app/shared/model/enumerations/status.model';
import PageHeaderTitle from 'app/shared/layout/page-header-title';
import Title from 'antd/lib/typography/Title';
import moment from 'moment';

const { Option } = Select;

export const DeviceUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  // const [isNew] = useState(!props.match.params || !props.match.params.id);

  const gateways = useAppSelector(state => state.gateway.entities);
  const deviceEntity = useAppSelector(state => state.device.entity);
  const loading = useAppSelector(state => state.device.loading);
  const updating = useAppSelector(state => state.device.updating);
  const updateSuccess = useAppSelector(state => state.device.updateSuccess);
  const statusValues = Object.keys(Status);
  const handleClose = () => {
    props.history.push('/device' + props.location.search);
  };

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.date = convertDateTimeToServer(values.date);

    const entity = {
      ...deviceEntity,
      ...values,
      gateway: { id: deviceEntity?.gateway?.id },
    };

    dispatch(updateEntity(entity));
  };

  const defaultValues = () => ({
    status: Status.OFFLINE,
    ...deviceEntity,
    date: moment(deviceEntity.date),
    gateway: deviceEntity?.gateway?.id,
  });

  const cancelClick = () => {
    props.history.replace('/device');
  };

  const title = translate('gatewaysApp.device.home.editLabel');

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.submit();
  };

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
      path: `/device/${deviceEntity.id}/edit`,
      breadcrumbName: title,
    },
  ];

  return (
    <Space direction="vertical" className="gateway-update">
      <PageHeaderTitle
        className="device-update__heading"
        title={<Title level={2}>{title}</Title>}
        subtitle={translate('gatewaysApp.device.home.createOrEditLabel')}
        routes={routes}
      />
      <div>
        {loading ? (
          <Spin tip="">
            <Alert message={translate('global.loading')}></Alert>
          </Spin>
        ) : (
          <Space direction="vertical" size="middle" className="device-update__body">
            <Form layout="vertical" initialValues={defaultValues()} onFinish={saveEntity} form={form}>
              <Form.Item
                label={translate('gatewaysApp.device.uid')}
                name="uid"
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.device.vendor')}
                name="vendor"
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.device.date')}
                name="date"
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <DatePicker allowClear />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.device.status')}
                name="status"
                rules={[{ required: true, message: 'Please pick an item!' }]}
              >
                <Select>
                  <Option value={Status.ONLINE}>{translate('gatewaysApp.Status.' + Status.ONLINE)}</Option>
                  <Option value={Status.OFFLINE}>{translate('gatewaysApp.Status.' + Status.OFFLINE)}</Option>
                </Select>
              </Form.Item>
            </Form>
            <Space size="middle">
              <Button id="cancel-save" data-cy="entityCreateCancelButton" onClick={cancelClick} icon={<ArrowLeftOutlined />}>
                <Translate contentKey="entity.action.back">Back</Translate>
              </Button>
              <Button
                type="primary"
                id="save-entity"
                data-cy="entityCreateSaveButton"
                onClick={handleSubmit}
                disabled={updating}
                icon={<SaveOutlined />}
              >
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </Space>
          </Space>
        )}
      </div>
    </Space>
  );
};

export default DeviceUpdate;
