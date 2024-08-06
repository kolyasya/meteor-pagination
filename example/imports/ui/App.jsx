import React, { useState, Suspense } from 'react';

import PostsTable from './PostsTable';
import UsersTable from './UsersTable';

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '47%', marginRight: '3%' }}>
          <Suspense fallback={<div>Loading Users...</div>}>
            <UsersTable />
          </Suspense>
        </div>
        <div style={{ width: '50%' }}>
          <PostsTable />
        </div>
      </div>
    </Suspense>
  );
};

export default App;
