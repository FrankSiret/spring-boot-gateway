/* eslint-disable no-console */
import React, { FC, useEffect, useState } from 'react';
import { DatePicker, Form, Input, Modal, Radio, Select } from 'antd';
import { useAppDispatch } from 'app/config/store';
import { createEntity, updateEntity } from '../../entities/device/device.reducer';
import { IDevice } from 'app/shared/model/device.model';
import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { Status } from 'app/shared/model/enumerations/status.model';
import { translate } from 'react-jhipster';
import moment from 'moment';

const { Option } = Select;

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
        form.resetFields();
        onOk();
      });
    } else {
      dispatch(updateEntity(newEntity)).then(() => {
        setLoading(false);
        form.resetFields();
        onOk();
      });
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          date: moment(),
        }
      : {
          status: Status.ONLINE,
          ...entity,
          date: moment(entity?.date),
        };

  useEffect(() => {
    form.setFieldsValue(defaultValues());
  }, [isNew, entity]);

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const title = isNew ? translate('gatewaysApp.gateway.home.createLabel') : translate('gatewaysApp.gateway.home.editLabel');

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const keyPress = e => {
    if (e.key === 'Enter') {
      handleOk();
    }
  };

  return (
    <Modal title={title} visible={visible} onOk={handleOk} onCancel={handleCancel} confirmLoading={loading}>
      <Form {...layout} form={form} onFinish={submit}>
        <Form.Item
          label={translate('gatewaysApp.device.uid')}
          name="uid"
          rules={[{ required: true, message: translate('entity.validation.required') }]}
        >
          <Input type="number" onKeyPress={keyPress} />
        </Form.Item>
        <Form.Item
          label={translate('gatewaysApp.device.vendor')}
          name="vendor"
          rules={[{ required: true, message: translate('entity.validation.required') }]}
        >
          <Input onKeyPress={keyPress} />
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
          rules={[{ required: true, message: translate('entity.validation.required') }]}
        >
          <Select>
            <Option value={Status.ONLINE}>{translate('gatewaysApp.Status.' + Status.ONLINE)}</Option>
            <Option value={Status.OFFLINE}>{translate('gatewaysApp.Status.' + Status.OFFLINE)}</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddModal;
