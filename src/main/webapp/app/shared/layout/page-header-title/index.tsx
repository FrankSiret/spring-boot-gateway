import { BreadcrumbProps, Button, Descriptions, PageHeader } from 'antd';
import { Route } from 'antd/lib/breadcrumb/Breadcrumb';
import React, { FC, ReactNode } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './page-header.scss';

export interface IPageHeaderTitleProps {
  title: string | ReactNode;
  subtitle: string;
  className: string;
  buttons?: ReactNode;
  routes: Route[];
}

const PageHeaderTitle: FC<IPageHeaderTitleProps> = ({ title, subtitle, className, buttons, routes }) => {
  const history = useHistory();

  return (
    <PageHeader
      ghost={false}
      onBack={() => routes.length >= 2 && history.push(routes[routes.length - 2].path)}
      title={title}
      subTitle={subtitle}
      className={`page-header-title ${className}`}
      extra={buttons}
      breadcrumb={{ routes, itemRender: route => <Link to={route.path}>{route.breadcrumbName}</Link> }}
    />
  );
};

export default PageHeaderTitle;
