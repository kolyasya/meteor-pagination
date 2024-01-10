import { Mongo } from 'meteor/mongo';
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

import { withTracker } from 'meteor/react-meteor-data';

const PostsPaginated = new Mongo.Collection('posts.paginated');

const columns = [
  {
    name: 'Title',
    selector: 'title',
    sortable: true,
    width: '100px',
    grow: 0
  },
  {
    name: 'Content',
    sortable: false,
    width: '200px',
    selector: (row, index) =>
      row?.content?.length > 30
        ? row.content.slice(0, 30) + '...'
        : row.content
  },
  {
    name: 'ID',
    selector: '_id',
    sortable: true,
    width: '170px',
    grow: 0
  }
];

const Table = ({
  posts,
  postsLoading,
  onChangePage,
  onChangeRowsPerPage,
  totalRows,
  onSort
}) => {
  const fetchUsers = async (page) => {
    setLoading(true);

    setData(response.data.data);
    setTotalRows(response.data.total);
    setLoading(false);
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);

    setData(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  return (
    <DataTable
      title="Posts"
      columns={columns}
      data={posts}
      progressPending={postsLoading}
      pagination
      paginationServer
      selectableRows
      paginationTotalRows={totalRows}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onChangePage={onChangePage}
      onSort={onSort}
    />
  );
};

export default withTracker(({ perPage, page, sort }) => {
  const totalRows = Counts.get('posts.paginated.count');

  const paginatedPostsSub = Meteor.subscribe('posts.paginated', {
    skip: page * perPage,
    limit: perPage,
    fields: {
      title: 1,
      content: 1
    },
    sort,

    cursorSelector: {},

    shouldLeadToParamsWarning: true
  });

  return {
    postsLoading: !paginatedPostsSub.ready(),
    posts: PostsPaginated.find().fetch(),
    totalRows
  };
})(Table);
