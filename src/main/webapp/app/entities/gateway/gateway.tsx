import React, { useState, useEffect } from 'react';
import { Link, NavLink, RouteComponentProps } from 'react-router-dom';
import { Button, Space, Table } from 'antd';
import { Translate, getSortState, translate } from 'react-jhipster';
import { SyncOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { getEntities } from './gateway.reducer';
import { IGateway } from 'app/shared/model/gateway.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ColumnsType } from 'antd/lib/table';
import Title from 'antd/lib/typography/Title';
import PageHeaderTitle from 'app/shared/layout/page-header-title';

export const Gateway = (props: RouteComponentProps<{ url: string }>) => {
  const dispatch = useAppDispatch();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getSortState(props.location, ITEMS_PER_PAGE, 'id'), props.location.search)
  );

  const gatewayList = useAppSelector(state => state.gateway.entities);
  const loading = useAppSelector(state => state.gateway.loading);
  const totalItems = useAppSelector(state => state.gateway.totalItems);

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

  const addClick = () => {
    props.history.push(`${match.url}/new`);
  };

  const columns: ColumnsType<IGateway> = [
    {
      key: 'serialNumber',
      dataIndex: 'serialNumber',
      title: <Translate contentKey="gatewaysApp.gateway.serialNumber">Serial Number</Translate>,
      render: (_serialNumber, record) => <Link to={`${match.url}/${record.id}`}>{record.serialNumber}</Link>,
    },
    { key: 'name', dataIndex: 'name', title: <Translate contentKey="gatewaysApp.gateway.name">Name</Translate> },
    { key: 'ipAddress', dataIndex: 'ipAddress', title: <Translate contentKey="gatewaysApp.gateway.ipAddress">Ip Address</Translate> },
    {
      key: 'action',
      title: <Translate contentKey="gatewaysApp.gateway.action">Action</Translate>,
      width: 90,
      render: (_text, gateway) => (
        <Space size="small">
          <Link
            to={`${match.url}/${gateway.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
          >
            <Button
              type="primary"
              size="small"
              data-cy="entityEditButton"
              icon={<EditOutlined />}
              title={translate('entity.action.edit')}
            ></Button>
          </Link>
          <Link
            to={`${match.url}/${gateway.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
          >
            <Button
              danger
              size="small"
              data-cy="entityEditButton"
              icon={<DeleteOutlined />}
              title={translate('entity.action.delete')}
            ></Button>
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
      path: '/gateway',
      breadcrumbName: translate('gatewaysApp.gateway.home.title'),
    },
  ];

  const textRangePagination = (total, range) => (
    <Translate contentKey="entity.pagination.showtotal" interpolate={{ from: range[0], to: range[1], total }} />
  );

  return (
    <Space size="middle" direction="vertical" className="gateway">
      <PageHeaderTitle
        className="gateway__heading"
        title={<Title level={2}>{translate('gatewaysApp.gateway.home.title')}</Title>}
        subtitle={translate('gatewaysApp.gateway.home.subtitle')}
        buttons={[
          <Button key="sync" onClick={handleSyncList} disabled={loading} icon={<SyncOutlined spin={loading} />}>
            <Translate contentKey="gatewaysApp.gateway.home.refreshListLabel">Refresh List</Translate>
          </Button>,
          <Button key="create" onClick={addClick} id="jh-create-entity" data-cy="entityCreateButton" icon={<PlusOutlined />}>
            <Translate contentKey="gatewaysApp.gateway.home.createLabel">Create new Gateway</Translate>
          </Button>,
        ]}
        routes={routes}
      />
      <Table
        columns={columns}
        dataSource={gatewayList}
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

export default Gateway;
