import React, { FC, useMemo, useState } from 'react';
import { Switch } from 'antd';
import { Status } from 'app/shared/model/enumerations/status.model';
import { IDevice } from 'app/shared/model/device.model';
import { useAppDispatch } from 'app/config/store';

import { updateEntity } from '../../entities/device/device.reducer';

export interface IDeviceStatusProps {
  gatewayId: string;
  record: IDevice;
  onUpdate?: () => void;
}

const DeviceStatus: FC<IDeviceStatusProps> = ({ gatewayId, record, onUpdate }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const changeStatus = e => {
    const device: IDevice = {
      ...record,
      status: e ? Status.ONLINE : Status.OFFLINE,
      gateway: { id: gatewayId },
    };
    setLoading(true);
    dispatch(updateEntity(device)).then(() => {
      setLoading(false);
      onUpdate && onUpdate();
    });
  };

  return (
    <Switch
      className={`device-status${record.status === Status.ONLINE ? ' device-status__online' : ' device-status__offline'}`}
      checkedChildren={Status.ONLINE}
      unCheckedChildren={Status.OFFLINE}
      checked={record.status === Status.ONLINE}
      onChange={changeStatus}
      loading={loading}
    />
  );
};

export default DeviceStatus;
