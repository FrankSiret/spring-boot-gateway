import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button, Form, Input, Spin, Alert, Space } from 'antd';
import { Translate, translate } from 'react-jhipster';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import { getEntity, updateEntity, createEntity, reset } from './gateway.reducer';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import Title from 'antd/lib/typography/Title';
import PageHeaderTitle from 'app/shared/layout/page-header-title';
import GatewayDevice from 'app/shared/components/gateway-devices';

export const GatewayUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

  const gatewayEntity = useAppSelector(state => state.gateway.entity);
  const loading = useAppSelector(state => state.gateway.loading);
  const updating = useAppSelector(state => state.gateway.updating);
  const updateSuccess = useAppSelector(state => state.gateway.updateSuccess);

  const handleClose = () => {
    props.history.push('/gateway' + props.location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(props.match.params.id));
    }
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...gatewayEntity,
      ...values,
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...gatewayEntity,
        };

  const cancelClick = () => {
    props.history.replace('/gateway');
  };

  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.submit();
  };

  const title = isNew ? translate('gatewaysApp.gateway.home.createLabel') : translate('gatewaysApp.gateway.home.editLabel');

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
      path: isNew ? '/gateway/new' : `/gateway/${gatewayEntity.id}/edit`,
      breadcrumbName: title,
    },
  ];

  return (
    <Space direction="vertical" className="gateway-update">
      <PageHeaderTitle
        className="gateway-update__heading"
        title={<Title level={2}>{title}</Title>}
        subtitle={translate('gatewaysApp.gateway.home.createOrEditLabel')}
        routes={routes}
      />
      <div>
        {loading ? (
          <Spin tip="">
            <Alert message={translate('global.loading')}></Alert>
          </Spin>
        ) : (
          <Space direction="vertical" size="middle" className="gateway-update__body">
            <Form layout="vertical" initialValues={defaultValues()} onFinish={saveEntity} form={form}>
              <Form.Item
                label={translate('gatewaysApp.gateway.serialNumber')}
                id="gateway-serialNumber"
                name="serialNumber"
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <Input data-cy="serialNumber" />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.gateway.name')}
                id="gateway-name"
                name="name"
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <Input data-cy="name" />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.gateway.ipAddress')}
                id="gateway-ipAddress"
                name="ipAddress"
                rules={[
                  { required: true, message: translate('entity.validation.required') },
                  {
                    pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message: translate('entity.validation.pattern'),
                  },
                ]}
              >
                <Input data-cy="ipAddress" />
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
            {!isNew && gatewayEntity?.id && <GatewayDevice id={gatewayEntity?.id} />}
          </Space>
        )}
      </div>
    </Space>
  );
};

export default GatewayUpdate;
