import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Avatar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { getVoucherList } from '@/redux/slice/voucherSlice';
import { createBooking } from '@/redux/slice/userBooking';
import { fetchScheduleById } from '@/redux/slice/scheduleSlice';
import { addServiceToCart, clearCart } from '@/redux/slice/cartSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConfirmBookingModal from './ConfirmBookingModal';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const FinalScheduleModal = ({ open, onClose, onBack, bookingData, onRemoveService, onClearBookingData }) => {
  const dispatch = useDispatch();
  const { vouchers = [], isLoading } = useSelector((state) => state.voucher);
  const { user } = useSelector((state) => state.userProfile);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState(''); // State for phone error message
  const [scheduleDetails, setScheduleDetails] = useState({});

  useEffect(() => {
    if (open) {
      dispatch(clearCart());
      bookingData?.forEach((item) => {
        dispatch(addServiceToCart(item));
      });
    }
  }, [open, bookingData, dispatch]);

  useEffect(() => {
    const fetchSchedules = async () => {
      const schedules = {};
      for (const item of bookingData) {
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
  }, [bookingData, dispatch]);

  useEffect(() => {
    if (open && isAuthenticated) {
      dispatch(getVoucherList());
      if (user) {
        setName(user.fullName);
        setPhone(user.phone);
      }
    }
  }, [open, dispatch, isAuthenticated, user]);

  useEffect(() => {
    const total = bookingData?.reduce((acc, item) => acc + (item.service?.price || 0), 0);
    setTotalPrice(total);
  }, [bookingData]);

  const applyVoucherDiscount = () => {
    const voucher = vouchers?.find((v) => v.voucherId === selectedVoucher);
    if (voucher) {
      return Math.max(totalPrice - voucher.discountAmount, 0);
    }
    return totalPrice;
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    if (/^\d*$/.test(input) && input.length <= 10) {
      setPhone(input);
      setPhoneError(''); // Clear error if input is valid
    } else {
      setPhoneError('Phone number must be 10 digits and contain only numbers');
    }
  };

  const handleConfirmBooking = async () => {
    if (!isValidPhone()) return; // Prevent booking if phone is invalid
    const bookingPayload = {
      userName: isAuthenticated ? user.fullName : name,
      phone: isAuthenticated ? user.phone : phone,
      voucherId: isAuthenticated && selectedVoucher ? selectedVoucher : null,
      scheduleId: Array.from(new Set(bookingData.flatMap((item) => item.schedules || []))) || [],
      serviceId: bookingData.map((item) => item.service?.serviceId || '') || [],
      stylistId: bookingData.map((item) => item.stylist?.stylistId || '') || [],
    };

    try {
      const resultAction = await dispatch(createBooking(bookingPayload));
      setConfirmModalOpen(false); // Close the confirmation modal

      if (createBooking.fulfilled.match(resultAction)) {
        toast.success('Booking created successfully');
        dispatch(clearCart());
        onClearBookingData();
        onClose();
      } else {
        throw new Error(resultAction.payload || 'Unknown error.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      setConfirmModalOpen(false); // Close the confirmation modal
      toast.error('Booking failed. Please try again.');
    }
  };

  const isValidPhone = () => phone.length === 10 && /^\d{10}$/.test(phone);

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{ p: 4, borderRadius: 2, backgroundColor: 'white', maxWidth: 600, mx: 'auto', mt: '10vh', boxShadow: 3 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Appointment Summary</Typography>
            {/* <IconButton onClick={onBack} color="primary">
              <ArrowBackIcon />
            </IconButton> */}
          </Box>

          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
            required={!isAuthenticated}
            disabled={isAuthenticated}
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={handlePhoneChange}
            fullWidth
            margin="normal"
            required={!isAuthenticated}
            disabled={isAuthenticated}
            error={Boolean(phoneError)}
            helperText={phoneError}
          />

          <List>
            {bookingData?.map((item, index) => (
              <ListItem key={index} sx={{ borderBottom: '1px solid #f0f0f0', py: 2 }}>
                <Avatar
                  src={item.service?.imageLink}
                  alt={item.service?.serviceName}
                  variant="square"
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <ListItemText
                  primary={`${item.service?.serviceName} with ${item.stylist?.stylistName}`}
                  secondary={
                    <>
                      {item.schedules && item.schedules[index] ? (
                        <div>
                          <Typography variant="body2">
                            Schedule: {scheduleDetails[item.schedules[index]]?.data?.startTime || 'N/A'} -{' '}
                            {scheduleDetails[item.schedules[index]]?.data?.endTime || 'N/A'}
                          </Typography>
                          <Typography variant="body2">
                            on: {formatDate(scheduleDetails[item.schedules[index]]?.data?.startDate)}
                          </Typography>
                        </div>
                      ) : (
                        <Typography variant="body2">Schedule: N/A</Typography>
                      )}
                      <Typography variant="body2">
                        Duration: {item.service?.estimateTime} min | Price: ${item.service?.price}
                      </Typography>
                    </>
                  }
                />
                <IconButton edge="end" onClick={() => onRemoveService(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItem>
            ))}
          </List>

          {isAuthenticated && (
            <FormControl fullWidth sx={{ mt: 2 }} disabled={isLoading}>
              <InputLabel>Voucher</InputLabel>
              <Select value={selectedVoucher} onChange={(e) => setSelectedVoucher(e.target.value)}>
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {vouchers.map((voucher) => (
                  <MenuItem key={voucher.voucherId} value={voucher.voucherId}>
                    Voucher {voucher.voucherId} - Discount: ${voucher.discountAmount}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Typography variant="h6" sx={{ mt: 2, textAlign: 'right' }}>
            Total: ${applyVoucherDiscount()?.toFixed(2)}
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button onClick={onClose} variant="text" color="primary">
              Add More Services
            </Button>
            <Button
              onClick={() => setConfirmModalOpen(true)}
              variant="contained"
              color="primary"
              disabled={!name || !isValidPhone()}
            >
              Confirm Appointment
            </Button>
          </Box>
        </Box>
      </Modal>
      <ConfirmBookingModal
        open={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmBooking}
      />
    </>
  );
};

export default FinalScheduleModal;
