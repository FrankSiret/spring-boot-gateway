import { IDevice } from 'app/shared/model/device.model';

export interface IGateway {
  id?: string;
  serialNumber?: string;
  name?: string;
  ipAddress?: string;
  devices?: IDevice[] | null;
}

export const defaultValue: Readonly<IGateway> = {};
