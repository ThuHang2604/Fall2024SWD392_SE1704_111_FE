import React, { useEffect, useState } from 'react';
import { Box, Typography, Select, MenuItem, Button } from '@mui/material';
import { getScheduleList } from '@/api/ScheduleApi';
import { getStylistByServiceID } from '@/api/StylistApi';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const CartModal = ({ open, bookingData, setBookingData }) => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedules, setSelectedSchedules] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchSchedules();
      fetchStylists();
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

  const fetchStylists = async () => {
    if (bookingData && bookingData[0]?.serviceId) {
      try {
        const response = await getStylistByServiceID(bookingData[0].serviceId);
        if (response.status === 1) {
          setStylists(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch stylists:', error);
      }
    }
  };

  const handleNext = () => {
    const updatedBookingData = bookingData.map((item) => ({
      ...item,
      schedules: selectedSchedules,
      stylist: selectedStylist || null,
    }));
    setBookingData(updatedBookingData);

    // Điều hướng sang SchedulePage và truyền dữ liệu qua state
    navigate('/schedule', {
      state: { bookingData: updatedBookingData },
    });
  };

  return (
    <Box className="modal-box">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Select Schedule(s) and Stylist</Typography>
      </Box>

      <Select multiple value={selectedSchedules} onChange={(e) => setSelectedSchedules(e.target.value)} fullWidth>
        {schedules.map((schedule) => (
          <MenuItem key={schedule.scheduleId} value={schedule.scheduleId}>
            {`From ${formatDate(schedule.startDate)} - ${schedule.startTime} to ${schedule.endTime}`}
          </MenuItem>
        ))}
      </Select>

      <Select
        value={selectedStylist}
        onChange={(e) => setSelectedStylist(e.target.value)}
        fullWidth
        displayEmpty
        sx={{ marginTop: 2 }}
      >
        <MenuItem value="">
          <em>No Stylist Selected</em>
        </MenuItem>
        {stylists.map((stylist) => (
          <MenuItem key={stylist.stylistId} value={stylist}>
            {stylist.stylistName}
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
  );
};

export default CartModal;
