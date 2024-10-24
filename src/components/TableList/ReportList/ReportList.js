import React from 'react';
import { Box, Typography } from '@mui/material';
import ReportListTable from './ReportListTable';

function ReportList({ reportList, error }) {
  return (
    <div>
      <Typography variant="h3" sx={{ marginLeft: '10px', marginBottom: '20px', fontSize: 40 }}>
        Report List
      </Typography>

      {error ? (
        <Box sx={{ textAlign: 'center', color: 'red', marginBottom: '10px' }}>
          <Typography variant="body1" sx={{ fontSize: 18 }}>
            {error.message || 'An error occurred'}
          </Typography>
        </Box>
      ) : (
        <ReportListTable reportList={reportList} />
      )}
    </div>
  );
}

export default ReportList;
