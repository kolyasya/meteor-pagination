import React, { useState } from "react";
import { withTracker } from "meteor/react-meteor-data";

import Table from "./Table";

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const handlePageChange = page => {
    setPage(page - 1);
  };

  const handleRowsPerPageChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setPage(page);
  };

  return (
    <div>
      <Table
        onChangePage={handlePageChange}
        perPage={perPage}
        onChangeRowsPerPage={handleRowsPerPageChange}
        page={page}
      />
    </div>
  );
};

export default App;
