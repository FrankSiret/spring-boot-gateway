import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import locale from './locale';
import authentication from './authentication';
import applicationProfile from './application-profile';

import gateway from 'app/entities/gateway/gateway.reducer';
import device from 'app/entities/device/device.reducer';

const rootReducer = {
  authentication,
  locale,
  applicationProfile,
  gateway,
  device,
  loadingBar,
};

export default rootReducer;
