/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Space, Switch, Table, Tag, Tooltip } from 'antd';
import { Translate, TextFormat, getSortState, translate } from 'react-jhipster';
import { SyncOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Status } from 'app/shared/model/enumerations/status.model';

import { getEntities, updateEntity } from './device.reducer';
import { IDevice } from 'app/shared/model/device.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ColumnsType } from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import PageHeaderTitle from 'app/shared/layout/page-header-title';
import DeviceStatus from '../../shared/components/device-status';

export const Device = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );

  const deviceList = useAppSelector(state => state.device.entities);
  const loading = useAppSelector(state => state.device.loading);
  const totalItems = useAppSelector(state => state.device.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      })
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (props.location.search !== endURL) {
      props.history.push(`${props.location.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(props.location.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [props.location.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const { match } = props;

  const columns: ColumnsType<IDevice> = [
    {
      key: 'uid',
      dataIndex: 'uid',
      title: <Translate contentKey="gatewaysApp.device.uid">UID</Translate>,
      render: (uid, record) => <Link to={`${match.url}/${record.id}`}>{uid}</Link>,
    },
    { key: 'vendor', dataIndex: 'vendor', title: <Translate contentKey="gatewaysApp.device.vendor">Vendor</Translate> },
    {
      key: 'date',
      dataIndex: 'date',
      title: <Translate contentKey="gatewaysApp.device.date">Date</Translate>,
      render: date => (date ? <TextFormat type="date" value={date} format={APP_LOCAL_DATE_FORMAT} /> : null),
    },
    {
      key: 'status',
      title: <Translate contentKey="gatewaysApp.device.status">Status</Translate>,
      dataIndex: 'status',
      render: (_status, record) => <DeviceStatus gatewayId={record.gateway?.id} record={record} />,
    },
    {
      key: 'gateway',
      title: <Translate contentKey="gatewaysApp.device.gateway">Gateway</Translate>,
      dataIndex: 'gateway',
      render: (gateway, record) => (record?.gateway?.id ? <Link to={`/gateway/${record.gateway.id}`}>{record.gateway.name}</Link> : null),
    },
    {
      key: 'action',
      title: <Translate contentKey="gatewaysApp.device.action">Action</Translate>,
      width: 90,
      render: (_text, gateway) => (
        <Space size="small">
          <Link
            to={`${match.url}/${gateway.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
          >
            <Button type="primary" size="small" icon={<EditOutlined />} title={translate('entity.action.edit', {}, 'Edit')} />
          </Link>
          <Link
            to={`${match.url}/${gateway.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
          >
            <Button danger size="small" icon={<DeleteOutlined />} title={translate('entity.action.delete', {}, 'Delete')} />
          </Link>
        </Space>
      ),
    },
  ];

  const routes = [
    {
      path: '/',
      breadcrumbName: 'Home',
    },
    {
      path: '/device',
      breadcrumbName: translate('gatewaysApp.device.home.title'),
    },
  ];

  const textRangePagination = (total, range) => (
    <Translate contentKey="entity.pagination.showtotal" interpolate={{ from: range[0], to: range[1], total }} />
  );

  return (
    <Space size="middle" direction="vertical" className="device">
      <PageHeaderTitle
        className="device__heading"
        title={<Title level={2}>{translate('gatewaysApp.device.home.title')}</Title>}
        subtitle={translate('gatewaysApp.device.home.subtitle')}
        buttons={[
          <Tooltip key="sync" title={translate('gatewaysApp.device.home.refreshListLabel')}>
            <Button shape="circle" onClick={handleSyncList} disabled={loading} icon={<SyncOutlined spin={loading} />} />
          </Tooltip>,
        ]}
        routes={routes}
      />
      <Table
        columns={columns}
        dataSource={deviceList}
        rowKey={record => record.id}
        pagination={{
          showTotal: textRangePagination,
          current: paginationState.activePage,
          onChange: handlePagination,
          defaultPageSize: 20,
          total: totalItems,
        }}
      />
    </Space>
  );
};

export default Device;
