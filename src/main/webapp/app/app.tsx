import 'react-toastify/dist/ReactToastify.css';
import './app.scss';
import 'app/config/dayjs.ts';

import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getSession } from 'app/shared/reducers/authentication';
import { getProfile } from 'app/shared/reducers/application-profile';
import ErrorBoundary from 'app/shared/error/error-boundary';
import AppRoutes from 'app/routes';
import AppMenu from './shared/layout/menu';

const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

const { Content, Footer } = Layout;

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getSession());
    dispatch(getProfile());
  }, []);

  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  return (
    <Router basename={baseHref}>
      <Layout className="app">
        <ToastContainer position={toast.POSITION.BOTTOM_LEFT} className="toastify-container" toastClassName="toastify-toast" />
        <AppMenu />
        <Content className="app-page">
          <div className="site-layout-content">
            <Switch>
              <Route path="/">
                <ErrorBoundary>
                  <AppRoutes />
                </ErrorBoundary>
              </Route>
            </Switch>
          </div>
        </Content>
        <Footer className="app-footer">
          Management Gateways Test ©2022 Created by{' '}
          <a href="https://github.com/FrankSiret/spring-boot-gateway" rel="noreferrer" target="_blank">
            FrankSiret
          </a>
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
