import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { PaginationControl } from 'react-bootstrap-pagination-control';

const UserPaginationControl = ({ usernames, page, setPage }) => {

  return (
    <div>
      <PaginationControl
        page={page}
        between={4}
        total={Math.ceil(usernames.length / 10)} 
        limit={1}
        changePage={(newPage) => {
          setPage(newPage);
        }}
        ellipsis={1}
      />
    </div>
  );
};

export default UserPaginationControl;
