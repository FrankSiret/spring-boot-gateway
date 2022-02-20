import React, { useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Space, Table, Tag } from 'antd';
import { Translate, TextFormat, getSortState, translate } from 'react-jhipster';
import { SyncOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { getEntities } from './device.reducer';
import { IDevice } from 'app/shared/model/device.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { ColumnsType } from 'antd/lib/table';

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

  const addClick = () => {
    props.history.push(`${match.url}/new`);
  };

  const columns: ColumnsType<IDevice> = [
    {
      key: 'id',
      dataIndex: 'id',
      title: <Translate contentKey="gatewaysApp.device.id">Id</Translate>,
      render: id => <a href={`${match.url}/${id}`}>{id}</a>,
    },
    { key: 'uID', dataIndex: 'uID', title: <Translate contentKey="gatewaysApp.device.uID">UID</Translate> },
    { key: 'vendor', dataIndex: 'vendor', title: <Translate contentKey="gatewaysApp.device.vendor">Vendor</Translate> },
    {
      key: 'date',
      dataIndex: 'date',
      title: <Translate contentKey="gatewaysApp.device.date">Date</Translate>,
      render: date => (date ? <TextFormat type="date" value={date} format={APP_DATE_FORMAT} /> : null),
    },
    {
      key: 'status',
      title: <Translate contentKey="gatewaysApp.device.status">Status</Translate>,
      render: status => <Tag color={status.toUpperCase() === 'ONLINE' ? 'volcano' : 'green'}>{status.toUpperCase()}</Tag>,
    },
    {
      key: 'gateway',
      title: <Translate contentKey="gatewaysApp.device.gateway">Gateway</Translate>,
      render: gateway => <a href={`gateway/${gateway.id}`}>{gateway.id}</a>,
    },
    {
      key: 'action',
      title: <Translate contentKey="gatewaysApp.device.action">Action</Translate>,
      render: (_text, gateway) => (
        <Space size="middle">
          <Button
            href={`${match.url}/${gateway.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
            type="primary"
            size="small"
            data-cy="entityEditButton"
            icon={<EditOutlined />}
            title={translate('entity.action.edit', {}, 'Edit')}
          >
            {/* <Translate contentKey="entity.action.edit">Edit</Translate> */}
          </Button>
          <Button
            href={`${match.url}/${gateway.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
            danger
            size="small"
            data-cy="entityEditButton"
            icon={<DeleteOutlined />}
            title={translate('entity.action.delete', {}, 'Delete')}
          >
            {/* <Translate contentKey="entity.action.delete">Delete</Translate> */}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 id="device-heading" data-cy="DeviceHeading">
        <Translate contentKey="gatewaysApp.device.home.title">Devices</Translate>
        <div className="d-flex justify-content-end">
          <Button onClick={handleSyncList} disabled={loading} icon={<SyncOutlined spin={loading} />}>
            <Translate contentKey="gatewaysApp.device.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Button onClick={addClick} id="jh-create-entity" data-cy="entityCreateButton" icon={<PlusOutlined />}>
            <Translate contentKey="gatewaysApp.device.home.createLabel">Create new Device</Translate>
          </Button>
        </div>
      </h2>
      <Table
        columns={columns}
        dataSource={deviceList}
        pagination={{
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          current: paginationState.activePage,
          onChange: handlePagination,
          defaultPageSize: 20,
          total: totalItems,
        }}
      />
    </div>
  );
};

export default Device;
