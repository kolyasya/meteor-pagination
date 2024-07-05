import React, { useState, Suspense } from 'react';

import PostsTable from './PostsTable';
import UsersTable from './UsersTable';

const App = () => {
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({ createdAt: -1 });

  const [perPageUsers, setPerPageUsers] = useState(10);
  const [pageUsers, setPageUsers] = useState(0);
  const [sortUsers, setSortUsers] = useState({ createdAt: 1 });

  const handlePageChange = (page) => {
    setPage(page - 1);
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  const handleSort = (column, sortDirection) => {
    console.log(column, sortDirection);
    setSort({ [column.id]: sortDirection === 'asc' ? 1 : -1 });
  };

  const handlePageUsersChange = (page) => {
    setPageUsers(page - 1);
  };

  const handleRowsPerPageUsersChange = (newPerPage, page) => {
    setPerPageUsers(newPerPage);
    setPageUsers(page);
  };

  const handleSortUsers = (column, sortDirection) => {
    console.log(column, sortDirection);
    setSortUsers({ [column.id]: sortDirection === 'asc' ? 1 : -1 });
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '47%', marginRight: '3%' }}>
          <UsersTable
            onChangePage={handlePageUsersChange}
            perPage={perPageUsers}
            onChangeRowsPerPage={handleRowsPerPageUsersChange}
            page={pageUsers}
            onSort={handleSortUsers}
            sort={sortUsers}
          />
        </div>
{/*         <div style={{ width: '50%' }}>
          <PostsTable
            onChangePage={handlePageChange}
            perPage={perPage}
            onChangeRowsPerPage={handleRowsPerPageChange}
            page={page}
            onSort={handleSort}
            sort={sort}
          />
        </div> */}
      </div>
    </Suspense>
  );
};

export default App;
