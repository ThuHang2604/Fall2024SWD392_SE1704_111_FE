import React from 'react';
import { Box, Typography } from '@mui/material';
import UserListTable from './UserListTable';

function UserList({ userList, bookingsNoStylist, error }) {
  return (
    <div>
      {error ? (
        <Box sx={{ textAlign: 'center', color: 'red', marginBottom: '10px' }}>
          <Typography variant="body1" sx={{ fontSize: 18 }}>
            {error.message || 'An error occurred'}
          </Typography>
        </Box>
      ) : (
        <UserListTable userList={userList} bookingsNoStylist={bookingsNoStylist} />
      )}
    </div>
  );
}

export default UserList;
