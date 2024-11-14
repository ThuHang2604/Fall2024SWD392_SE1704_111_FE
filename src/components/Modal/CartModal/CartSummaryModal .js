import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItemText,
  IconButton,
  Button,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeServiceFromCart } from '@/redux/slice/cartSlice';
import { createBooking } from '@/redux/slice/userBooking';
import { fetchScheduleById } from '@/redux/slice/scheduleSlice';
import { showToast } from '@/redux/slice/toastSlice'; // Import showToast action from toastSlice
import ConfirmBookingModal from '@/components/Card/ServiceCard/ConfirmBookingModal';
// import ConfirmBookingModal from '@components/Card/ServiceCard/ConfirmBookingModal'; // Import the confirmation modal

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const CartSummaryModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [totalPrice, setTotalPrice] = useState(0);
  const [scheduleDetails, setScheduleDetails] = useState({});
  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // State for confirm modal

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + (item.service?.price || 0), 0);
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedules = {};
      for (const item of cartItems) {
        if (Array.isArray(item.schedules)) {
          for (const scheduleId of item.schedules) {
            if (!schedules[scheduleId]) {
              const result = await dispatch(fetchScheduleById(scheduleId));
              if (result.payload) {
                schedules[scheduleId] = result.payload;
              }
            }
          }
        }
      }
      setScheduleDetails(schedules);
    };
    fetchSchedules();
  }, [cartItems, dispatch]);

  const handleCreateBooking = async () => {
    const uniqueScheduleIds = Array.from(new Set(cartItems.flatMap((item) => item.schedules || [])));

    const bookingPayload = {
      userName: isAuthenticated ? user.fullName : '',
      phone: isAuthenticated ? user.phone : '',
      scheduleId: uniqueScheduleIds,
      serviceId: cartItems.map((item) => item.service?.serviceId || ''),
      stylistId: cartItems.map((item) => item.stylist?.stylistId || ''),
    };

    try {
      const resultAction = await dispatch(createBooking(bookingPayload));
      setConfirmModalOpen(false); // Close the confirmation modal

      if (createBooking.fulfilled.match(resultAction)) {
        dispatch(showToast({ type: 'success', message: 'Booking created successfully' }));
        dispatch(clearCart());
        onClose();
      } else {
        throw new Error(resultAction.payload || 'Unknown error.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      dispatch(showToast({ type: 'error', message: 'Booking failed. Please try again.' }));
    }
  };

  const handleConfirmClick = () => {
    setConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalOpen(false);
  };

  return (
    <>
      <Modal open={open} onClose={onClose} centered>
        <Box
          sx={{
            width: '90%',
            maxWidth: 500,
            margin: 'auto',
            mt: '10vh',
            p: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: 'fantasy', mb: 3 }}>
            Services Booking
          </Typography>

          <List sx={{ width: '100%' }}>
            {cartItems.map((item, index) => (
              <Card
                key={index}
                variant="outlined"
                sx={{
                  mb: 2,
                  borderRadius: 1,
                  boxShadow: 1,
                  position: 'relative',
                }}
              >
                <CardContent sx={{ padding: '16px', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ flexShrink: 0, ml: 2 }}>
                    <img
                      src={item.service?.imageLink}
                      alt="Service"
                      style={{ width: '100px', height: '100px', borderRadius: '8px' }}
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {item.service?.serviceName}
                        </Typography>
                      }
                      secondary={
                        <>
                          {item.schedules && item.schedules[index] ? (
                            <div>
                              <Typography variant="body2">
                                Schedule: {scheduleDetails[item.schedules[index]]?.data?.startTime || 'N/A'} -{' '}
                                {scheduleDetails[item.schedules[index]]?.data?.endTime || 'N/A'}
                              </Typography>
                              <Typography variant="body2">
                                on : {`${formatDate(scheduleDetails[item.schedules[index]]?.data?.startDate)}`}
                              </Typography>
                            </div>
                          ) : (
                            <Typography variant="body2">Schedule: ... !</Typography>
                          )}
                          <Typography variant="body2" color="textSecondary">
                            With <strong>{item.stylist?.stylistName || 'any staff member'} </strong>•{' '}
                            {item.service?.estimateTime || '45 min'} • ${item.service?.price || '30'}
                          </Typography>
                        </>
                      }
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </List>

          <Divider sx={{ width: '100%', my: 2 }} />

          <Typography variant="h6" sx={{ mb: 1, textAlign: 'right', width: '100%', fontWeight: 'bold' }}>
            Total: ${totalPrice.toFixed(2)}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, width: '100%' }}>
            <Button onClick={onClose} variant="outlined" color="primary">
              Close
            </Button>
            <Button onClick={handleConfirmClick} variant="contained" color="primary">
              Confirm Appointment
            </Button>
          </Box>
        </Box>
      </Modal>

      <ConfirmBookingModal open={confirmModalOpen} onClose={handleCloseConfirmModal} onConfirm={handleCreateBooking} />
    </>
  );
};

export default CartSummaryModal;
