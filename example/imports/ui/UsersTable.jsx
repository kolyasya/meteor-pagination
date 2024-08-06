import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { useEffect, useState } from 'react';

import { useTracker, useSubscribe } from 'meteor/react-meteor-data/suspense';

import { Counts } from 'meteor/compat:publish-counts';
import DataTable from 'react-data-table-component';

const UsersPaginated = new Mongo.Collection('users.paginated');

const columns = [
  {
    name: 'Created At',
    id: 'createdAt',
    sortable: true,
    width: '170px',
    grow: 0,
    selector: (row, index) => {
      return new Date(row.createdAt).toLocaleString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    },
  },
  {
    id: 'name',
    name: 'Name',
    selector: row => row.name,
    sortable: true,
    width: '100px',
    grow: 0,
  },
  {
    id: 'age',
    name: 'Age',
    selector: row => row?.age,
    sortable: true,
    width: '100px',
    grow: 0,
  },
  {
    name: 'Content',
    sortable: false,
    width: '190px',
    selector: (row, index) =>
      row?.content?.length > 30
        ? row.content.slice(0, 30) + '...'
        : row.content,
  },
  {
    id: '_id',
    name: 'ID',
    selector: row => row._id,
    sortable: true,
    width: '170px',
    grow: 0,
  },
];

const UsersTable = ({ onChangePage, onChangeRowsPerPage, onSort }) => {
  const totalRows = useTracker('totalRows', () =>
    Counts.get('users.paginated.count')
  );
  const users = useTracker('users', () => UsersPaginated.find().fetchAsync());

  return (
    <DataTable
      title="Users"
      columns={columns}
      data={users}
      progressPending={false}
      pagination
      paginationServer
      selectableRows
      paginationTotalRows={totalRows}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onChangePage={onChangePage}
      onSort={onSort}
      defaultSortFieldId="createdAt"
    />
  );
};

export default props => {
  const [perPageUsers, setPerPageUsers] = useState(10);
  const [pageUsers, setPageUsers] = useState(0);
  const [sortUsers, setSortUsers] = useState({ createdAt: 1 });

  const handlePageUsersChange = page => {
    setPageUsers(page - 1);
  };

  const handleRowsPerPageUsersChange = (newPerPage, page) => {
    setPerPageUsers(newPerPage);
    setPageUsers(page);
  };

  const handleSortUsers = (column, sortDirection) => {
    setSortUsers({ [column.id]: sortDirection === 'asc' ? 1 : -1 });
  };

  useSubscribe('users.paginated', {
    skip: pageUsers * perPageUsers,
    limit: perPageUsers,
    fields: {
      name: 1,
      age: 1,
      createdAt: 1,
    },
    sortUsers,
    cursorSelector: {},
    unsupportedParamWhichLeadsToWarning: true,
  });

  return (
    <UsersTable
      onChangePage={handlePageUsersChange}
      perPage={perPageUsers}
      onChangeRowsPerPage={handleRowsPerPageUsersChange}
      page={pageUsers}
      onSort={handleSortUsers}
      sort={sortUsers}
      {...props}
    />
  );
};
