import dayjs from 'dayjs';
import { IGateway } from 'app/shared/model/gateway.model';
import { Status } from 'app/shared/model/enumerations/status.model';

export interface IDevice {
  id?: string;
  uid?: number;
  vendor?: string;
  date?: string;
  status?: Status;
  gateway?: IGateway | null;
}

export const defaultValue: Readonly<IDevice> = {};
