import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Form, Input, DatePicker, Radio } from 'antd';
import { isNumber, Translate, translate } from 'react-jhipster';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import { IGateway } from 'app/shared/model/gateway.model';
import { getEntities as getGateways } from 'app/entities/gateway/gateway.reducer';
import { getEntity, updateEntity, createEntity, reset } from './device.reducer';
import { IDevice } from 'app/shared/model/device.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Status } from 'app/shared/model/enumerations/status.model';

export const DeviceUpdate = (props: RouteComponentProps<{ id: string }>) => {
  const dispatch = useAppDispatch();

  const [isNew] = useState(!props.match.params || !props.match.params.id);

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
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(props.match.params.id));
    }

    dispatch(getGateways({}));
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
      gateway: gateways.find(it => it.id.toString() === values.gateway.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          date: displayDefaultDateTime(),
        }
      : {
          status: 'ONLINE',
          ...deviceEntity,
          date: convertDateTimeFromServer(deviceEntity.date),
          gateway: deviceEntity?.gateway?.id,
        };

  const cancelClick = () => {
    props.history.replace('/device');
  };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewaysApp.device.home.createOrEditLabel" data-cy="DeviceCreateUpdateHeading">
            <Translate contentKey="gatewaysApp.device.home.createOrEditLabel">Create or edit a Device</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Form layout="vertical" initialValues={defaultValues()} onFinish={saveEntity}>
              {!isNew ? (
                <Form.Item name="id" id="device-id" label={translate('gatewaysApp.device.id')} rules={[{ required: true }]}>
                  <Input readOnly />
                </Form.Item>
              ) : null}
              <Form.Item id="device-gateway" name="gateway" label={translate('gatewaysApp.device.gateway')} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.device.uID')}
                id="device-uID"
                name="uID"
                // data-cy="uID"
                rules={[
                  { required: true, message: translate('entity.validation.required') },
                  { type: 'number', message: translate('entity.validation.number') },
                ]}
              >
                <Input data-cy="uID" />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.device.vendor')}
                id="device-vendor"
                name="vendor"
                // data-cy="vendor"
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <Input data-cy="vendor" />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.device.date')}
                id="device-date"
                name="date"
                data-cy="date"
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <DatePicker data-cy="date" format="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.device.status')}
                id="device-status"
                name="status"
                // data-cy="status"
                rules={[{ required: true, message: 'Please pick an item!' }]}
              >
                <Radio.Group data-cy="status">
                  {statusValues.map(status => (
                    <Radio.Button value={status} key={status}>
                      {translate('gatewaysApp.Status.' + status)}
                    </Radio.Button>
                  ))}
                  <Radio.Button value="ONLINE">{translate('gatewaysApp.Status.' + statusValues[0])}</Radio.Button>
                  <Radio.Button value="OFFLINE">{translate('gatewaysApp.Status.' + status)}</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Button id="cancel-save" data-cy="entityCreateCancelButton" onClick={cancelClick} icon={<ArrowLeftOutlined />}>
                <Translate contentKey="entity.action.back">Back</Translate>
              </Button>
              <Button
                type="primary"
                id="save-entity"
                data-cy="entityCreateSaveButton"
                htmlType="submit"
                disabled={updating}
                icon={<SaveOutlined />}
              >
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default DeviceUpdate;
