import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Select, MenuItem, Button } from '@mui/material';
import { getStylistByServiceID } from '@/api/StylistApi';
import './styles.css';
const BookingModal = ({ open, onClose, service, onNext }) => {
  const [stylists, setStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState('');

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
    // Include an identifier to update the correct booking entry
    onNext({ service, stylist: selectedStylist, serviceId: service.serviceId });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Select Your Stylist
        </Typography>
        <Select value={selectedStylist} onChange={(e) => setSelectedStylist(e.target.value)} fullWidth displayEmpty>
          <MenuItem value="" disabled>
            Choose your stylist
          </MenuItem>
          {stylists.map((stylist) => (
            <MenuItem key={stylist.stylistId} value={stylist}>
              {stylist.stylistName}
            </MenuItem>
          ))}
        </Select>
        <Button
          onClick={handleNext}
          disabled={!selectedStylist}
          sx={{ marginTop: 2 }}
          variant="contained"
          color="primary"
        >
          Next
        </Button>
      </Box>
    </Modal>
  );
};

export default BookingModal;
