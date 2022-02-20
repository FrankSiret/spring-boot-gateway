import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Avatar, Layout, Menu } from 'antd';
import { HomeOutlined, GatewayOutlined, ApiOutlined } from '@ant-design/icons';
import { languages } from 'app/config/translation';
import { Storage, Translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale';

// import './appMenu.scss'

const { Header } = Layout;

const AppMenu = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);

  const handleLocaleChange = langKey => {
    Storage.session.set('locale', langKey);
    dispatch(setLocale(langKey));
  };

  useEffect(() => {
    const l = location.pathname.split('/');
    if (location.pathname === '' || location.pathname === '/') setSelectedKeys(['home']);
    else if (l.length > 1 && l[1] === 'gateway') setSelectedKeys(['gateway']);
    else if (l.length > 1 && l[1] === 'api') setSelectedKeys(['api']);
  }, [location.pathname]);

  return (
    <Header className="app-header">
      <div className="logo">
        <Avatar>G</Avatar>
      </div>
      <Menu theme="dark" mode="horizontal" selectedKeys={selectedKeys}>
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <NavLink to="/">Home</NavLink>
        </Menu.Item>
        <Menu.Item key="gateway" icon={<GatewayOutlined />}>
          <NavLink to="/gateway">Gateway</NavLink>
        </Menu.Item>
        <Menu.Item key="api" icon={<ApiOutlined />}>
          <NavLink to="/admin/api">API</NavLink>
        </Menu.Item>
      </Menu>
      {currentLocale === 'en' && (
        <div title={languages.es.name} className="language" onClick={() => handleLocaleChange('es')}>
          <Avatar>ES</Avatar>
        </div>
      )}
      {currentLocale === 'es' && (
        <div title={languages.en.name} className="language" onClick={() => handleLocaleChange('en')}>
          <Avatar>EN</Avatar>
        </div>
      )}
      <div className="account">
        {isAuthenticated ? (
          <Link to={'/logout'}>
            <Translate contentKey="global.menu.account.logout">Sign out</Translate>
          </Link>
        ) : (
          <Link to={'/login'}>
            <Translate contentKey="global.menu.account.login">Sign in</Translate>
          </Link>
        )}
      </div>
    </Header>
  );
};

export default AppMenu;
