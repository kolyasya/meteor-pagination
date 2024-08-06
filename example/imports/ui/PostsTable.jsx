import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

import {
  useTracker,
  useSubscribe,
  withTracker,
} from 'meteor/react-meteor-data';

import { Counts } from 'meteor/compat:publish-counts';

const PostsPaginated = new Mongo.Collection('posts.paginated');

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
    id: 'title',
    name: 'Title',
    selector: row => row.title,
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

const PostsTable = ({
  postsLoading,
  onChangePage,
  onChangeRowsPerPage,
  onSort,
}) => {
  const totalRows = useTracker(() => Counts.get('posts.paginated.count'));
  const posts = useTracker(() => PostsPaginated.find().fetch());

  console.log(totalRows, posts);

  // const fetchUsers = async (page) => {
  //   setLoading(true);

  //   setData(response.data.data);
  //   setTotalRows(response.data.total);
  //   setLoading(false);
  // };

  // const handlePageChange = (page) => {
  //   fetchUsers(page);
  // };

  // const handlePerRowsChange = async (newPerPage, page) => {
  //   setLoading(true);

  //   setData(response.data.data);
  //   setPerPage(newPerPage);
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     Meteor.call('insertPost');
  //   }, 3000);

  //   return () => clearInterval(intervalId);
  // }, []);

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
      defaultSortFieldId="createdAt"
    />
  );
};

export default props => {
  const [perPagePosts, setPerPagePosts] = useState(10);
  const [pagePosts, setPagePosts] = useState(0);
  const [sortPosts, setSortPosts] = useState({ createdAt: -1 });

  const handlePagePostsChange = page => {
    setPagePosts(page - 1);
  };

  const handleRowsPerPagePostsChange = (newPerPage, page) => {
    setPerPagePosts(newPerPage);
    setPagePosts(page);
  };

  const handleSortPosts = (column, sortDirection) => {
    setSortPosts({ [column.id]: sortDirection === 'asc' ? 1 : -1 });
  };

  const isPostsPaginatedSubLoading = useSubscribe('posts.paginated', {
    skip: pagePosts * perPagePosts,
    limit: perPagePosts,
    fields: {
      title: 1,
      content: 1,
      createdAt: 1,
    },
    sortPosts,

    cursorSelector: {},

    unsupportedParamWhichLeadsToWarning: true,
  });

  return (
    <PostsTable
      onChangePage={handlePagePostsChange}
      perPage={perPagePosts}
      onChangeRowsPerPage={handleRowsPerPagePostsChange}
      page={pagePosts}
      onSort={handleSortPosts}
      postsLoading={isPostsPaginatedSubLoading()}
      sort={sortPosts}
      {...props}
    />
  );

  /*   return {
    postsLoading: !paginatedPostsSub.ready(),
    posts: .fetch(),
    totalRows
  }; */
};
