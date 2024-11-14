import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';

const ConfirmBookingModal = ({ open, onClose, onConfirm }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: 'white',
          maxWidth: 400,
          mx: 'auto',
          mt: '20vh',
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Confirm Booking
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Are you sure you want to confirm this appointment?
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button variant="contained" color="error" onClick={onClose}>
            No
          </Button>
          <Button variant="contained" color="primary" onClick={onConfirm}>
            Yes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmBookingModal;
