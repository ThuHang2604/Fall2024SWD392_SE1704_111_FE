import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, Select, MenuItem, Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getScheduleList } from '@/api/ScheduleApi';
import './styles.css';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const CartModal = ({ open, onClose, bookingData, setBookingData, onNext, onBack }) => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);

  useEffect(() => {
    if (open) {
      fetchSchedules();
    }
  }, [open]);

  const fetchSchedules = async () => {
    try {
      const response = await getScheduleList();
      setSchedules(response.data);
    } catch (error) {
      console.error('Failed to fetch schedule list:', error);
    }
  };

  const handleScheduleSelect = (event) => {
    const value = event.target.value;
    const uniqueSchedules = Array.from(new Set(value));
    setSelectedSchedules(uniqueSchedules);
  };

  const handleNext = () => {
    const updatedBookingData = bookingData.map((item) => ({
      ...item,
      schedules: selectedSchedules,
    }));
    setBookingData(updatedBookingData);
    onNext(updatedBookingData);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          {/* <IconButton onClick={onBack}>
            <ArrowBackIcon />
          </IconButton> */}
          <Typography variant="h6">Select Schedule(s)</Typography>
        </Box>

        <Select multiple value={selectedSchedules} onChange={handleScheduleSelect} fullWidth>
          {schedules.map((schedule) => (
            <MenuItem key={schedule.scheduleId} value={schedule.scheduleId}>
              {`From ${formatDate(schedule.startDate)} - ${schedule.startTime} to ${schedule.endTime}`}
            </MenuItem>
          ))}
        </Select>

        <Button
          onClick={handleNext}
          disabled={selectedSchedules.length === 0}
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

export default CartModal;
