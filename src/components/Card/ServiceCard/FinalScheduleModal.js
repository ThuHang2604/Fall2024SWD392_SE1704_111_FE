import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { getUserProfileCurrent } from '@/redux/slice/userProfileSlice';
import { getScheduleList } from '@/api/ScheduleApi';
// import { createBooking } from '@/api/BookingApi';
import { createBooking } from '@/redux/slice/userBooking';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const FinalScheduleModal = ({ open, onClose, bookingData, onBack }) => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.userProfile); // Lấy thông tin user từ Redux
  console.log('customer Id', user?.userProfileId);
  useEffect(() => {
    if (open) {
      dispatch(getUserProfileCurrent()); // Lấy profile khi modal mở
      fetchSchedules(); // Lấy danh sách schedule
    }
  }, [dispatch, open]);

  const fetchSchedules = async () => {
    try {
      const schedules = await getScheduleList();
      setSchedules(schedules.data);
    } catch (error) {
      console.error('Failed to fetch schedule list:', error);
      toast.error('Unable to load schedules. Please try again.');
    }
  };

  const handleBookNow = async () => {
    // Lấy user từ Redux
    const customerId = user?.userProfileId; // Lấy customerId từ userProfileId

    const newBooking = {
      scheduleId: selectedSchedule, // ID của lịch hẹn
      customerId: customerId, // Gán customerId từ userProfile
      serviceId: bookingData.map((item) => item.service.serviceId), // Lấy danh sách serviceId
      stylistId: bookingData.map((item) => item.stylist.stylistId), // Lấy danh sách stylistId
    };

    try {
      const resultAction = await dispatch(createBooking(newBooking));
      if (createBooking.fulfilled.match(resultAction)) {
        toast.success('Booking created successfully!');
        onClose(); // Đóng modal nếu thành công
      } else {
        throw new Error(resultAction.payload || 'Unknown error.');
      }
    } catch (error) {
      console.error('Booking Error:', error);
      toast.error('Booking failed. Please try again.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Confirm Your Appointment
        </Typography>

        <TextField label="Name" value={user?.fullName || ''} fullWidth margin="normal" disabled />
        <TextField label="Phone" value={user?.phone || ''} fullWidth margin="normal" disabled />

        <Typography variant="h6" sx={{ marginTop: 2, marginBottom: 1 }}>
          Selected Services
        </Typography>
        <List>
          {bookingData.map((item, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`${item.service.serviceName} with ${item.stylist.stylistName}`}
                secondary={`${item.service.estimateTime} min | $${item.service.price}`}
              />
            </ListItem>
          ))}
        </List>

        <Select
          value={selectedSchedule}
          onChange={(e) => setSelectedSchedule(e.target.value)}
          fullWidth
          displayEmpty
          sx={{ marginTop: 2 }}
        >
          <MenuItem value="" disabled>
            Select a schedule
          </MenuItem>
          {schedules.map((schedule) => (
            <MenuItem key={schedule.scheduleId} value={schedule.scheduleId}>
              {`From ${schedule.startTime} to ${schedule.endTime} on ${new Date(schedule.startDate).toLocaleDateString()}`}
            </MenuItem>
          ))}
        </Select>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          <Button variant="text" color="primary" onClick={onBack}>
            Back
          </Button>
          <Button onClick={handleBookNow} variant="contained" color="primary" disabled={!selectedSchedule}>
            Confirm Appointment
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FinalScheduleModal;
