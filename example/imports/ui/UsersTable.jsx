import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { useEffect } from 'react';

import { Counts } from 'meteor/compat:publish-counts';
import DataTable from 'react-data-table-component';

import { withTracker } from 'meteor/react-meteor-data';

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
        second: '2-digit'
      });
    }
  },
  {
    id: 'name',
    name: 'Name',
    selector: (row) => row.name,
    sortable: true,
    width: '100px',
    grow: 0
  },
  {
    id: 'age',
    name: 'Age',
    selector: (row) => row?.age,
    sortable: true,
    width: '100px',
    grow: 0
  },
  {
    name: 'Content',
    sortable: false,
    width: '190px',
    selector: (row, index) =>
      row?.content?.length > 30
        ? row.content.slice(0, 30) + '...'
        : row.content
  },
  {
    id: '_id',
    name: 'ID',
    selector: (row) => row._id,
    sortable: true,
    width: '170px',
    grow: 0
  }
];

const Table = ({
  users,
  usersLoading,
  onChangePage,
  onChangeRowsPerPage,
  totalRows,
  onSort
}) => {
  return (
    <DataTable
      title="Users"
      columns={columns}
      data={users}
      progressPending={usersLoading}
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

export default withTracker(({ perPage, page, sort }) => {
  const totalRows = Counts.get('users.paginated.count');

  const paginatedUsersSub = Meteor.subscribe('users.paginated', {
    skip: page * perPage,
    limit: perPage,
    fields: {
      name: 1,
      age: 1,
      createdAt: 1
    },
    sort,
    cursorSelector: {},
    unsupportedParamWhichLeadsToWarning: true
  });

  return {
    usersLoading: !paginatedUsersSub.ready(),
    users: UsersPaginated.find().fetch(),
    totalRows
  };
})(Table);
