import React, { useLayoutEffect } from 'react';

import { translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { logout } from 'app/shared/reducers/authentication';
import { Alert } from 'antd';

export const Logout = () => {
  const logoutUrl = useAppSelector(state => state.authentication.logoutUrl);
  const dispatch = useAppDispatch();

  useLayoutEffect(() => {
    dispatch(logout());
    if (logoutUrl) {
      window.location.href = logoutUrl;
    }
  });

  return (
    <div className="app-page">
      <div className="site-layout-content">
        <Alert message={translate('global.logout')} />
      </div>
    </div>
  );
};

export default Logout;
