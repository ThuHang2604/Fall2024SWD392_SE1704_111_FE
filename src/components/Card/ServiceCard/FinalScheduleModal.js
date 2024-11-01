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
import { createBooking } from '@/redux/slice/userBooking';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const FinalScheduleModal = ({ open, onClose, bookingData, onBack }) => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth); // Kiểm tra trạng thái đăng nhập

  useEffect(() => {
    if (open) {
      if (isAuthenticated) {
        dispatch(getUserProfileCurrent());
      }
      fetchSchedules();
    }
  }, [dispatch, open]);

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserName(user.fullName || '');
      setPhone(user.phone || '');
    }
  }, [user, isAuthenticated]);

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
    const customerId = isAuthenticated ? user.userProfileId : null;

    const newBooking = {
      scheduleId: selectedSchedule,
      customerId: customerId,
      userName: isAuthenticated ? user.fullName : userName,
      phone: isAuthenticated ? user.phone : phone,
      serviceId: bookingData.map((item) => item.service.serviceId),
      stylistId: bookingData.map((item) => item.stylist.stylistId),
    };

    try {
      const resultAction = await dispatch(createBooking(newBooking));
      if (createBooking.fulfilled.match(resultAction)) {
        toast.success('Booking created successfully!');
        onClose();
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

        {isAuthenticated ? (
          <>
            <TextField label="Name" value={userName} fullWidth margin="normal" disabled />
            <TextField label="Phone" value={phone} fullWidth margin="normal" disabled />
          </>
        ) : (
          <>
            <TextField
              label="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          </>
        )}

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
