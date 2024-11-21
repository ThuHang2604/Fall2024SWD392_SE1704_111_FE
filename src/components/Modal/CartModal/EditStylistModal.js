// EditStylistModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Select, MenuItem, Button } from '@mui/material';
import { getStylistByServiceID } from '@/api/StylistApi';

const EditStylistModal = ({ open, onClose, service, onStylistSelect }) => {
  const [stylists, setStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState(''); // Use empty string for "With any stylist"

  useEffect(() => {
    if (service) {
      getStylistByServiceID(service.serviceId).then((response) => {
        if (response.status === 1) {
          setStylists(response.data);
        }
      });
    }
  }, [service]);

  const handleNext = () => {
    // Pass selected stylist back to parent component
    onStylistSelect(selectedStylist || null); // Null for "With any stylist"
    onClose(); // Close modal after selection
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          backgroundColor: 'white',
          maxWidth: 500,
          mx: 'auto',
          mt: '10vh',
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Select Your Stylist
        </Typography>
        <Select value={selectedStylist} onChange={(e) => setSelectedStylist(e.target.value)} fullWidth displayEmpty>
          <MenuItem value="">
            <em>With any stylist</em>
          </MenuItem>
          {stylists.map((stylist) => (
            <MenuItem key={stylist.stylistId} value={stylist}>
              {stylist.stylistName}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={handleNext} sx={{ marginTop: 2 }} variant="contained" color="primary">
          Next
        </Button>
      </Box>
    </Modal>
  );
};

export default EditStylistModal;
