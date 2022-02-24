import React, { FC, useState } from 'react';
import { Modal, Select } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { deleteEntity } from '../../entities/device/device.reducer';
import { IDevice } from 'app/shared/model/device.model';
import { Translate, translate } from 'react-jhipster';

const { Option } = Select;

export interface IAddModalProps {
  entity: IDevice;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const DeleteModal: FC<IAddModalProps> = ({ entity, visible, onOk, onCancel }) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const title = translate('entity.delete.title');

  const handleOk = () => {
    if (entity?.id) {
      setLoading(false);
      dispatch(deleteEntity(entity.id)).then(() => {
        setLoading(false);
        onOk();
      });
    }
  };

  return (
    <Modal title={title} visible={visible} onOk={handleOk} onCancel={onCancel} confirmLoading={loading}>
      <Translate contentKey="gatewaysApp.device.delete.question" interpolate={{ id: entity?.uid }}>
        Are you sure you want to delete this Device?
      </Translate>
    </Modal>
  );
};

export default DeleteModal;
