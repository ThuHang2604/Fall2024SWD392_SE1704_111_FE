import React from 'react';
import { Box, Typography } from '@mui/material';
import ServiceCard from './ServiceCard';

function ServiceCardView({ serviceCard, error }) {
  return (
    <div>
      <Typography variant="h5" sx={{ marginLeft: '10px', marginBottom: '20px', marginTop: '15px' }}>
        Our Services
      </Typography>

      {error ? (
        <Box sx={{ textAlign: 'center', color: 'red', marginBottom: '10px' }}>
          <Typography variant="body1">{error.message || 'An error occurred'}</Typography>
        </Box>
      ) : (
        <ServiceCard serviceCard={serviceCard} />
      )}
    </div>
  );
}

export default ServiceCardView;
