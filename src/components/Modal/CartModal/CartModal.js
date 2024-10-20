import React, { useState, useEffect } from 'react';
import { Button, Modal, Box, Typography, TextField, Select, MenuItem, Divider } from '@mui/material';
import { getScheduleList } from '@/api/ScheduleApi';
import { createBooking } from '@/api/BookingApi';
import { getUserProfileCurrent } from '@/redux/slice/userProfileSlice';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import './styles.css';

const CartModal = ({ open, onClose, bookingData }) => {
  const dispatch = useDispatch();
  const [scheduleList, setScheduleList] = useState([]);
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [schedule, setSchedule] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const actionResult = await dispatch(getUserProfileCurrent());
        if (getUserProfileCurrent.fulfilled.match(actionResult)) {
          const userData = actionResult.payload;
          setUserName(userData.fullName);
          setPhone(userData.phone);
        } else {
          console.error('Failed to fetch user profile:', actionResult.error.message);
          toast.error('Unable to load user profile. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Error fetching user profile.');
      } finally {
        setLoadingUser(false);
      }
    };

    if (open) {
      fetchUserProfile();
    }
  }, [dispatch, open]);

  // Fetch lịch trình từ API
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const schedules = await getScheduleList();
        setScheduleList(schedules.data);
      } catch (error) {
        console.error('Failed to fetch schedule list:', error);
        toast.error('Unable to load schedules. Please try again.');
      } finally {
        setLoadingSchedules(false);
      }
    };

    if (open) {
      fetchSchedules();
    }
  }, [open]);

  const handleBookNow = async () => {
    const dataToSave = {
      userName,
      phone,
      voucherId: null,
      scheduleId: schedule,
      serviceId: [bookingData.serviceDetail.serviceId],
      stylistId: [bookingData.selectedStylist],
    };

    try {
      await createBooking(dataToSave);
      toast.success(
        'Your booking request has been sent successfully. Please wait for appointment confirmation from Salon.',
      );
      onClose();
    } catch (error) {
      toast.error('Failed to send booking request. Please try again.');
    }
  };

  if (!bookingData || !bookingData.serviceDetail) {
    return null;
  }

  if (loadingUser || loadingSchedules) {
    return (
      <Modal open={open} onClose={onClose} closeAfterTransition>
        <Box className="modal-box">
          <Typography variant="h6" align="center">
            Loading...
          </Typography>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-cart-title"
      aria-describedby="modal-cart-description"
      closeAfterTransition
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
      }}
    >
      <Box className="modal-box">
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box flex={1} marginRight={2}>
            <Typography variant="h6">Customer Information</Typography>
            <TextField
              label="Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="h6">Select a schedule</Typography>
            <Select value={schedule} onChange={(e) => setSchedule(e.target.value)} fullWidth displayEmpty>
              <MenuItem value="" disabled>
                Select a schedule
              </MenuItem>
              {scheduleList.map((sched) => (
                <MenuItem key={sched.scheduleId} value={sched.scheduleId}>
                  {`From ${sched.startTime} to ${sched.endTime} on ${new Date(sched.startDate).toLocaleDateString()}`}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box flex={1}>
            <Typography variant="h6">Your Services</Typography>
            <Box marginY={1}>
              <Typography variant="body1">
                {bookingData.serviceDetail.serviceName} - ${bookingData.serviceDetail.price}
              </Typography>
            </Box>
            <Divider sx={{ marginY: 2 }} />
            <Typography variant="h6">Payment Detail</Typography>
            <Typography>Payment Method: Pay at the counter</Typography>
            <Typography>Total Price: ${bookingData.serviceDetail.price}</Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="primary"
          className="full-width"
          onClick={handleBookNow}
          sx={{ marginTop: 5 }}
        >
          Book Now
        </Button>
      </Box>
    </Modal>
  );
};

export default CartModal;
