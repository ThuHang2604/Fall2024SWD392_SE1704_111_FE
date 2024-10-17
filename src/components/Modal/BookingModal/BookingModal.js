import React from 'react';
import { Button, Modal, Select, MenuItem, Box } from '@mui/material';
import './styles.css';

const BookingModal = ({ open, onClose }) => {
  const [stylist, setStylist] = React.useState('');

  const handleClose = () => {
    onClose();
    setStylist('');
  };

  const handleChange = (event) => {
    setStylist(event.target.value);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
      }}
    >
      <Box className="modal-box">
        <h2>Select Your Stylist</h2>
        <Select value={stylist} onChange={handleChange} className="full-width">
          <MenuItem value={'Joy'}>Joy</MenuItem>
          {/* Thêm các option khác cho stylist ở đây */}
        </Select>
        <div className="mt-2">
          <p>Silk Press</p>
          <p>45 min • $30</p>
        </div>
        <Button variant="contained" color="primary" className="full-width" onClick={handleClose}>
          Add To Cart
        </Button>
      </Box>
    </Modal>
  );
};

export default BookingModal;
