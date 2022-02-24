import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { Translate } from 'react-jhipster';
import { StopOutlined, DeleteOutlined } from '@ant-design/icons';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity, deleteEntity } from './device.reducer';

export const DeviceDeleteDialog = (props: RouteComponentProps<{ id: string }>) => {
  const [loadModal, setLoadModal] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getEntity(props.match.params.id));
    setLoadModal(true);
  }, []);

  const deviceEntity = useAppSelector(state => state.device.entity);
  const updateSuccess = useAppSelector(state => state.device.updateSuccess);

  const handleClose = () => {
    props.history.push('/device' + props.location.search);
  };

  useEffect(() => {
    if (updateSuccess && loadModal) {
      handleClose();
      setLoadModal(false);
    }
  }, [updateSuccess]);

  const confirmDelete = () => {
    dispatch(deleteEntity(deviceEntity.id));
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
      <div id="gatewaysApp.device.delete.question">
        <Translate contentKey="gatewaysApp.device.delete.question" interpolate={{ id: deviceEntity.uid }}>
          Are you sure you want to delete this Device?
        </Translate>
      </div>
    </Modal>
  );
};

export default DeviceDeleteDialog;
