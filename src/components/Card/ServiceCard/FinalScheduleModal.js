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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { getVoucherList } from '@/redux/slice/voucherSlice';
import { createBooking } from '@/redux/slice/userBooking';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const FinalScheduleModal = ({ open, onClose, bookingData, onRemoveService }) => {
  const dispatch = useDispatch();
  const { vouchers = [], isLoading } = useSelector((state) => state.voucher);
  const { user } = useSelector((state) => state.userProfile);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

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
    const total = bookingData.reduce((acc, item) => acc + item.service.price, 0);
    setTotalPrice(total);
  }, [bookingData]);

  const applyVoucherDiscount = () => {
    const voucher = vouchers?.find((v) => v.voucherId === selectedVoucher);
    if (voucher) {
      return Math.max(totalPrice - voucher.discountAmount, 0);
    }
    return totalPrice;
  };

  const handleCreateBooking = async () => {
    const bookingPayload = {
      userName: isAuthenticated ? user.fullName : name,
      phone: isAuthenticated ? user.phone : phone,
      voucherId: isAuthenticated && selectedVoucher ? selectedVoucher : null,
      scheduleId: Array.from(new Set(bookingData.flatMap((item) => item.schedules))) || [],
      serviceId: bookingData.map((item) => item.service.serviceId) || [],
      stylistId: bookingData.map((item) => item.stylist.stylistId) || [],
    };

    console.log('Payload being sent to createBooking:', bookingPayload);

    try {
      const resultAction = await dispatch(createBooking(bookingPayload));
      if (createBooking.fulfilled.match(resultAction)) {
        toast.success('Booking created successfully');
        onClose();
      } else {
        throw new Error(resultAction.payload || 'Unknown error.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Booking failed. Please try again.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box" sx={{ p: 4, borderRadius: 2, backgroundColor: 'white', minWidth: 400 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Appointment Summary
        </Typography>

        {/* Name and Phone input fields */}
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
          onChange={(e) => setPhone(e.target.value)}
          fullWidth
          margin="normal"
          required={!isAuthenticated}
          disabled={isAuthenticated}
        />

        <List>
          {bookingData?.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item?.service?.serviceName} with ${item?.stylist?.stylistName}`}
                secondary={`Scheduled: ${item.schedules?.map((scheduleId) => `#${scheduleId}`).join(', ')} | ${item.service.estimateTime} min | $${item.service.price}`}
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
          Total: ${applyVoucherDiscount().toFixed(2)}
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: 20 }}>
          <Button onClick={onClose} variant="text" color="primary">
            + Add Service
          </Button>
          <Button onClick={handleCreateBooking} variant="contained" color="primary" disabled={!name || !phone}>
            Confirm Appointment
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default FinalScheduleModal;
