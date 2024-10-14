import React from 'react';
import { Box, Typography } from '@mui/material';
import ServiceListTable from './ServiceListTable';

function ServiceList({ serviceList, error }) {
  return (
    <div>
      <Typography variant="h3" sx={{ marginLeft: '10px', marginBottom: '20px' }}>
        Service List
      </Typography>

      {error ? (
        <Box sx={{ textAlign: 'center', color: 'red', marginBottom: '10px' }}>
          <Typography variant="body1">{error.message || 'An error occurred'}</Typography>
        </Box>
      ) : (
        <ServiceListTable serviceList={serviceList} />
      )}
    </div>
  );
}

export default ServiceList;
