import React, { useState, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Avatar, Dropdown, Layout, Menu } from 'antd';
import { PartitionOutlined, DownOutlined, GlobalOutlined, HomeOutlined, GatewayOutlined, ApiOutlined } from '@ant-design/icons';
import { languages } from 'app/config/translation';
import { Storage, translate, Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';

import './menu.scss';

const { Header } = Layout;

const AppMenu = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const account = useAppSelector(state => state.authentication.account);

  const handleLocaleChange = () => {
    const langKey = currentLocale === 'en' ? 'es' : 'en';
    Storage.session.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  const languageName = useCallback(() => (currentLocale === 'en' ? languages.es.name : languages.en.name), [currentLocale]);
  const languageKey = useCallback(() => (currentLocale === 'en' ? 'ES' : 'EN'), [currentLocale]);

  useEffect(() => {
    const l = location.pathname.split('/');
    if (location.pathname === '' || location.pathname === '/') setSelectedKeys(['home']);
    else if (location.pathname === '/admin/docs') setSelectedKeys(['api']);
    else if (l.length > 1 && l[1] === 'gateway') setSelectedKeys(['gateway']);
    else if (l.length > 1 && l[1] === 'device') setSelectedKeys(['device']);
  }, [location.pathname]);

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to="/logout">
          <Translate contentKey="global.menu.account.logout">Sign out</Translate>
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="app-header">
      <div className="logo">
        <Link to="/">
          <Avatar className="logo-avatar">G</Avatar>
        </Link>
      </div>
      <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys} className="menu">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <NavLink to="/">{translate('global.menu.home')}</NavLink>
        </Menu.Item>
        <Menu.Item key="gateway" icon={<GatewayOutlined />}>
          <NavLink to="/gateway">Gateway</NavLink>
        </Menu.Item>
        <Menu.Item key="device" icon={<PartitionOutlined />}>
          <NavLink to="/device">
            <Translate contentKey="gatewaysApp.gateway.device">Device</Translate>
          </NavLink>
        </Menu.Item>
        <Menu.Item key="api" icon={<ApiOutlined />}>
          <NavLink to="/admin/docs">API</NavLink>
        </Menu.Item>
      </Menu>
      <div className="account">
        {isAuthenticated ? (
          <Dropdown overlay={menu} trigger={['click']}>
            <span className="account-menu">
              {account.login} <DownOutlined />
            </span>
          </Dropdown>
        ) : (
          <Link to={'/login'}>
            <Translate contentKey="global.menu.account.login">Sign in</Translate>
          </Link>
        )}
      </div>
      <div title={languageName()} className="language" onClick={handleLocaleChange}>
        <GlobalOutlined /> {languageKey()}
      </div>
    </Header>
  );
};

export default AppMenu;
