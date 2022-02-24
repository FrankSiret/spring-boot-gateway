import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { Translate } from 'react-jhipster';
import { StopOutlined, DeleteOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, deleteEntity } from './gateway.reducer';

export const GatewayDeleteDialog = (props: RouteComponentProps<{ id: string }>) => {
  const [loadModal, setLoadModal] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
    setLoadModal(true);
  }, []);

  const gatewayEntity = useAppSelector(state => state.gateway.entity);
  const updateSuccess = useAppSelector(state => state.gateway.updateSuccess);

  const handleClose = () => {
    props.history.push('/gateway' + props.location.search);
  };

  useEffect(() => {
    if (updateSuccess && loadModal) {
      handleClose();
      setLoadModal(false);
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    dispatch(deleteEntity(gatewayEntity.id));
  };

  return (
    <Modal
      visible
      title={<Translate contentKey="entity.delete.title">Confirm delete operation</Translate>}
      onCancel={handleClose}
      footer={[
        <Button key="back" size="small" onClick={handleClose} icon={<StopOutlined />}>
          <Translate contentKey="entity.action.cancel">Cancel</Translate>
        </Button>,
        <Button
          key="submit"
          size="small"
          danger
          type="primary"
          id="jhi-confirm-delete-gateway"
          data-cy="entityConfirmDeleteButton"
          onClick={confirmDelete}
          icon={<DeleteOutlined />}
        >
          <Translate contentKey="entity.action.delete">Delete</Translate>
        </Button>,
      ]}
    >
      <div id="gatewaysApp.gateway.delete.question">
        <Translate contentKey="gatewaysApp.gateway.delete.question" interpolate={{ id: gatewayEntity.name }}>
          Are you sure you want to delete this Gateway?
        </Translate>
      </div>
    </Modal>
  );
};

export default GatewayDeleteDialog;
