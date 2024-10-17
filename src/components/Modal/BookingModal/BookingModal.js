import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, MenuItem, Box, Typography } from '@mui/material';
import './styles.css';
import { getServiceDetail } from '@/api/ServiceApi';
import { getStylistByServiceID } from '@/api/StylistApi';

const BookingModal = ({ open, onClose, serviceId, onNext = () => {} }) => {
  const [stylists, setStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState('');
  const [serviceDetail, setServiceDetail] = useState({});
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (serviceId && open && !isFetched) {
      const fetchStylists = async () => {
        try {
          const response = await getStylistByServiceID(serviceId);
          if (response.status === 1) {
            setStylists(response.data);
          } else {
            console.error('Failed to fetch stylists:', response.message);
          }
        } catch (error) {
          console.error('Failed to fetch stylists:', error);
        }
      };

      const fetchServiceDetail = async () => {
        try {
          const detailResponse = await getServiceDetail(serviceId);
          if (detailResponse.status === 1) {
            setServiceDetail(detailResponse.data);
          } else {
            console.error('Failed to fetch service details:', detailResponse.message);
          }
        } catch (error) {
          console.error('Failed to fetch service details:', error);
        }
      };

      fetchStylists();
      fetchServiceDetail();
      setIsFetched(true);
    }
  }, [serviceId, open, isFetched]);

  const handleClose = () => {
    onClose();
    setSelectedStylist('');
    setIsFetched(false);
  };

  const handleChangeStylist = (event) => {
    setSelectedStylist(event.target.value);
  };

  const handleNext = () => {
    const bookingData = {
      serviceDetail,
      selectedStylist,
    };
    onNext(bookingData); // Ensure onNext is always a valid function
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
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Select Your Stylist
        </Typography>

        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
          <Typography variant="body1">{serviceDetail.serviceName || 'Loading...'}</Typography>
          <Typography variant="body2">
            {serviceDetail.estimateTime ? `${serviceDetail.estimateTime} • $${serviceDetail.price}` : 'Loading...'}
          </Typography>
        </Box>

        {stylists.length > 0 ? (
          <Select value={selectedStylist} onChange={handleChangeStylist} className="full-width" displayEmpty>
            <MenuItem value="" disabled>
              Select a stylist
            </MenuItem>
            {stylists.map((stylist) => (
              <MenuItem key={stylist.stylistId} value={stylist.stylistId}>
                {stylist.stylistName}
              </MenuItem>
            ))}
          </Select>
        ) : (
          <Typography>No stylists available</Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          className="full-width"
          onClick={handleNext}
          disabled={!selectedStylist}
          sx={{ marginTop: 2 }}
        >
          Next
        </Button>
      </Box>
    </Modal>
  );
};

export default BookingModal;
