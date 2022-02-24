/* eslint-disable no-console */
import React, { FC, useState } from 'react';
import { DatePicker, Form, Input, Modal, Radio } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { createEntity, updateEntity } from '../../entities/device/device.reducer';
import { IDevice } from 'app/shared/model/device.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { Status } from 'app/shared/model/enumerations/status.model';
import { translate } from 'react-jhipster';
import moment from 'moment';

export interface IAddModalProps {
  isNew?: boolean;
  entity?: IDevice;
  gatewayId: string;
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const AddModal: FC<IAddModalProps> = ({ isNew, entity, gatewayId, visible, onOk, onCancel }) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const submit = values => {
    values.date = convertDateTimeToServer(values.date);
    const newEntity: IDevice = {
      ...entity,
      ...values,
      gateway: { id: gatewayId },
    };

    setLoading(true);
    if (isNew) {
      dispatch(createEntity(newEntity)).then(() => {
        setLoading(false);
        onOk();
      });
    } else {
      dispatch(updateEntity(newEntity)).then(() => {
        setLoading(false);
        onOk();
      });
    }
  };

  const defaultValues = () => {
    const ret = isNew
      ? {
          date: moment(displayDefaultDateTime()),
        }
      : {
          status: Status.ONLINE,
          ...entity,
          date: moment(convertDateTimeFromServer(entity.date)),
        };
    console.log(ret);
    return ret;
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const title = isNew ? translate('gatewaysApp.gateway.home.createLabel') : translate('gatewaysApp.gateway.home.editLabel');

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel} confirmLoading={loading}>
      <Form {...layout} form={form} onFinish={submit} initialValues={defaultValues()}>
        <Form.Item
          label={translate('gatewaysApp.device.uID')}
          name="uID"
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
          <DatePicker allowClear showTime />
        </Form.Item>
        <Form.Item
          label={translate('gatewaysApp.device.status')}
          name="status"
          rules={[{ required: true, message: translate('entity.validation.required') }]}
        >
          <Radio.Group>
            <Radio.Button value={Status.ONLINE} key={Status.ONLINE}>
              {translate('gatewaysApp.Status.' + Status.ONLINE)}
            </Radio.Button>
            <Radio.Button value={Status.OFFLINE} key={Status.OFFLINE}>
              {translate('gatewaysApp.Status.' + Status.OFFLINE)}
            </Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;
