import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Form, Input } from 'antd';
import { isNumber, Translate, translate } from 'react-jhipster';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';

import { getEntity, updateEntity, createEntity, reset } from './gateway.reducer';
import { IGateway } from 'app/shared/model/gateway.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

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

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="12">
          <h2 id="gatewaysApp.gateway.home.createOrEditLabel" data-cy="GatewayCreateUpdateHeading">
            <Translate contentKey="gatewaysApp.gateway.home.createOrEditLabel">Create or edit a Gateway</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="12">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Form layout="vertical" initialValues={defaultValues()} onFinish={saveEntity}>
              {!isNew ? (
                <Form.Item name="id" id="gateway-id" label={translate('gatewaysApp.gateway.id')} rules={[{ required: true }]}>
                  <Input readOnly />
                </Form.Item>
              ) : null}
              <Form.Item
                label={translate('gatewaysApp.gateway.serialNumber')}
                id="gateway-serialNumber"
                name="serialNumber"
                // data-cy="serialNumber"
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <Input data-cy="serialNumber" />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.gateway.name')}
                id="gateway-name"
                name="name"
                // data-cy="name"
                rules={[{ required: true, message: translate('entity.validation.required') }]}
              >
                <Input data-cy="name" />
              </Form.Item>
              <Form.Item
                label={translate('gatewaysApp.gateway.ipAddress')}
                id="gateway-ipAddress"
                name="ipAddress"
                // data-cy="ipAddress"
                rules={[
                  { required: true, message: translate('entity.validation.required') },
                  {
                    type: 'regexp',
                    pattern: /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                    message: translate('entity.validation.pattern', {
                      pattern: '^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\\.|$)){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
                    }),
                  },
                ]}
              >
                <Input data-cy="ipAddress" />
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

export default GatewayUpdate;
