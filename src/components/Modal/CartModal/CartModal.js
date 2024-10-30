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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { getVoucherList } from '@/redux/slice/voucherSlice';

const CartModal = ({ open, onClose, bookingData, onRemoveService, onScheduleAppointment }) => {
  const dispatch = useDispatch();
  const { vouchers = [], isLoading } = useSelector((state) => state.voucher);
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (open) {
      dispatch(getVoucherList());
    }
  }, [open, dispatch]);

  useEffect(() => {
    const total = bookingData.reduce((acc, item) => acc + item.service.price, 0);
    setTotalPrice(total);
  }, [bookingData]);

  const handleVoucherChange = (event) => {
    setSelectedVoucher(event.target.value);
  };

  const applyVoucherDiscount = () => {
    const voucher = vouchers?.find((v) => v.voucherId === selectedVoucher);
    if (voucher) {
      const discountAmount = voucher.discountAmount;
      return totalPrice - discountAmount;
    }
    return totalPrice;
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box" sx={{ p: 4, borderRadius: 2, backgroundColor: 'white', minWidth: 400 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Appointment Summary
        </Typography>

        <List>
          {bookingData.map((item, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => onRemoveService(index)}>
                  <DeleteIcon color="error" />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${item.service.serviceName} with ${item.stylist.stylistName}`}
                secondary={`${item.service.estimateTime} min | $${item.service.price}`}
              />
            </ListItem>
          ))}
        </List>

        <FormControl fullWidth sx={{ mt: 2 }} disabled={isLoading}>
          <InputLabel>Voucher</InputLabel>
          <Select value={selectedVoucher} onChange={handleVoucherChange} label="Voucher">
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {vouchers?.map((voucher) => (
              <MenuItem key={voucher.voucherId} value={voucher.voucherId}>
                Voucher {voucher.voucherId} - Discount: ${voucher.discountAmount}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Typography variant="h6" sx={{ mt: 2, textAlign: 'right' }}>
          Total: ${applyVoucherDiscount().toFixed(2)}
        </Typography>

        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: 20 }}>
          <Button onClick={onClose} variant="text" color="primary">
            + Add Service
          </Button>
          <Button onClick={() => onScheduleAppointment(selectedVoucher)} variant="contained" color="primary">
            Schedule Appointment
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CartModal;
