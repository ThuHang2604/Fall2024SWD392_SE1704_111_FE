import React from 'react';
import { Box, Typography, Button, Divider, IconButton, Paper, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const BookingSummary = ({ selectedServices, onAddMore, onFinish, onRemoveService }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        width: '400px',
        borderRadius: '10px',
        mx: 'auto',
        mt: 4,
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Appointment Summary
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {selectedServices.map((service, index) => (
        <Stack
          key={index}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2, p: 1, backgroundColor: '#f9f9f9', borderRadius: '5px' }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {service.serviceName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Stylist: {service.stylist || 'Not Assigned'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {service.estimateTime} min | ${service.price}
            </Typography>
          </Box>
          <IconButton edge="end" aria-label="delete" onClick={() => onRemoveService(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" justifyContent="space-between">
        <Button onClick={onAddMore} variant="text" color="primary">
          + Add More Services
        </Button>
        <Button onClick={onFinish} variant="contained" color="primary" sx={{ ml: 2 }}>
          Schedule Appointment
        </Button>
      </Stack>
    </Paper>
  );
};

export default BookingSummary;
