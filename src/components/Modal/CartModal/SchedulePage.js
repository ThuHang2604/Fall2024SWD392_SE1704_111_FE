import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Modal,
  List,
  ListItem,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';
import { getStylistByDate } from '@/redux/slice/scheUserSlice';
import { toast } from 'react-toastify'; // For toast notifications
import { Player } from '@lottiefiles/react-lottie-player';
import DateAni from '@/lottie/dateAnimation'; // Lottie animation
import StylistAni from '@/lottie/stylistAni';

const generateTimeSlots = (start = '10:00:00', end = '20:00:00') => {
  const timeSlots = [];
  let current = dayjs(`2000-01-01T${start}`);
  const endTime = dayjs(`2000-01-01T${end}`);
  while (current.isBefore(endTime)) {
    timeSlots.push(current.format('HH:mm:ss'));
    current = current.add(30, 'minute');
  }
  return timeSlots;
};

const SchedulePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { bookingData = [] } = location.state || { bookingData: [] };
  console.log('bookingData:', bookingData);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedStylist, setSelectedStylist] = useState('');
  const [availableStylists, setAvailableStylists] = useState([]);
  const [timeModalOpen, setTimeModalOpen] = useState(false);
  const [animationModalOpen, setAnimationModalOpen] = useState(false); // Animation modal state
  const [selectedTimes, setSelectedTimes] = useState({});
  const timeSlots = generateTimeSlots();

  useEffect(() => {
    if (selectedDate && selectedTime) {
      dispatch(getStylistByDate({ startDate: selectedDate, startTime: selectedTime }))
        .unwrap()
        .then((response) => setAvailableStylists(response || []))
        .catch(() => console.error('Failed to fetch stylists'));
    }
  }, [selectedDate, selectedTime, dispatch]);

  const handleDateChange = (date) => {
    if (date && dayjs(date).isValid()) {
      setSelectedDate(dayjs(date).format('YYYY-MM-DD'));
    }
  };

  const handleTimeSelect = (time) => {
    if (!selectedDate) {
      toast.warning('Please select a date before choosing a time.');
      setAnimationModalOpen(true);
      return;
    }

    // Kiểm tra trùng lặp thời gian
    const alreadySelected = Object.values(selectedTimes).some(
      (selected) => selected.date === selectedDate && selected.time === time,
    );

    if (alreadySelected) {
      toast.error('Time slot is already selected for another service. Please choose a different time.');
      return;
    }

    setSelectedTime(time);
    setTimeModalOpen(false);
  };

  const handleStylistSelect = (stylistId) => {
    setSelectedStylist(stylistId || '');
  };
  const handleNextService = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both a date and time before proceeding.');
      return;
    }

    const currentService = bookingData[currentServiceIndex];
    const currentDuration = parseInt(currentService.estimateTime, 10);
    const endTime = dayjs(`${selectedDate}T${selectedTime}`).add(currentDuration, 'minute').format('HH:mm:ss');

    // Lưu thời gian đã chọn cho dịch vụ hiện tại
    setSelectedTimes((prev) => ({
      ...prev,
      [currentServiceIndex]: { date: selectedDate, time: selectedTime, endTime },
    }));

    bookingData[currentServiceIndex] = {
      ...currentService,
      startDate: selectedDate,
      endDate: selectedDate,
      startTime: selectedTime,
      endTime,
      stylistId: selectedStylist || null,
      voucherId: null,
    };

    if (currentServiceIndex < bookingData.length - 1) {
      setCurrentServiceIndex(currentServiceIndex + 1);
      setSelectedDate(null);
      setSelectedTime('');
      setSelectedStylist('');
    } else {
      navigate('/booking-detail', {
        state: {
          bookingData,
        },
      });
    }
  };

  return (
    <Box sx={{ padding: '20px', minHeight: '100vh' }}>
      <Grid container spacing={4}>
        {/* Date & Time Selection Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Schedule Your Appointment
              </Typography>
              <Typography>Select a Date:</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={selectedDate ? dayjs(selectedDate) : null}
                  onChange={handleDateChange}
                  shouldDisableDate={(date) => dayjs(date).isBefore(dayjs(), 'day')}
                />
              </LocalizationProvider>

              <Typography sx={{ mt: 2 }}>Select a Time:</Typography>
              <Button
                onClick={() => {
                  if (!selectedDate) {
                    toast.warning('Please select a date before choosing a time.');
                    setAnimationModalOpen(true);
                  } else {
                    setTimeModalOpen(true);
                  }
                }}
              >
                Choose Time
              </Button>

              {/* Time Modal */}
              <Modal open={timeModalOpen} onClose={() => setTimeModalOpen(false)}>
                <Box
                  sx={{
                    maxWidth: 400,
                    mx: 'auto',
                    mt: '20vh',
                    p: 3,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 3,
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    Select a Time
                  </Typography>
                  <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
                    {timeSlots.map((time, index) => (
                      <ListItem
                        button
                        key={index}
                        onClick={() => handleTimeSelect(time)}
                        sx={{
                          padding: '10px 0',
                          textAlign: 'center',
                          backgroundColor: selectedTime === time ? '#f0f0f0' : 'transparent',
                        }}
                      >
                        {time}
                      </ListItem>
                    ))}
                  </List>
                  <Button variant="outlined" fullWidth onClick={() => setTimeModalOpen(false)} sx={{ mt: 2 }}>
                    Close
                  </Button>
                </Box>
              </Modal>
            </CardContent>
          </Card>
        </Grid>

        {/* Stylist Selection Card */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              boxShadow: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #fce4ec, #f3e5f5)',
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                Select a Stylist
              </Typography>
              {availableStylists.length > 0 ? (
                <Grid container spacing={2} sx={{ textAlign: 'center' }}>
                  {/* Add "Any Stylist" option */}
                  <Grid item xs={12}>
                    <Button
                      sx={{
                        backgroundColor: selectedStylist === '' ? '#4caf50' : 'white',
                        color: selectedStylist === '' ? 'white' : '#4caf50',
                        border: '1px solid #4caf50',
                        '&:hover': { backgroundColor: '#66bb6a', color: 'white' },
                      }}
                      onClick={() => handleStylistSelect(null)} // Pass null for "Any Stylist"
                    >
                      Any Stylist
                    </Button>
                  </Grid>
                  {availableStylists.map((stylist) => (
                    <Grid item xs={6} key={stylist.stylistId}>
                      <Button
                        sx={{
                          backgroundColor: selectedStylist === stylist.stylistId ? '#2196f3' : 'white',
                          color: selectedStylist === stylist.stylistId ? 'white' : '#2196f3',
                          border: '1px solid #2196f3',
                          '&:hover': { backgroundColor: '#64b5f6', color: 'white' },
                        }}
                        onClick={() => handleStylistSelect(stylist.stylistId)}
                      >
                        {stylist.stylistName}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <>
                  <Typography variant="h6" sx={{ textAlign: 'center', mt: 2 }}>
                    Please select a Time to see stylist's schedule
                  </Typography>
                  <Player
                    autoplay
                    loop
                    src={StylistAni}
                    style={{ height: '200px', width: '200px', margin: '20px auto' }}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Details Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: '#e3f2fd' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Booking Details
              </Typography>
              <Typography>
                <strong>Service:</strong> {bookingData[currentServiceIndex]?.serviceName}
              </Typography>
              <Typography>
                <strong>Date:</strong> {selectedDate || 'Not selected'}
              </Typography>
              <Typography>
                <strong>Time:</strong> {selectedTime || 'Not selected'}
              </Typography>
              <Typography>
                <strong>Stylist:</strong>{' '}
                {selectedStylist
                  ? availableStylists.find((stylist) => stylist.stylistId === selectedStylist)?.stylistName || 'Unknown'
                  : 'Any Stylist'}
              </Typography>
              <Button sx={{ mt: 4 }} variant="contained" fullWidth onClick={handleNextService} color="warning">
                {currentServiceIndex < bookingData.length - 1 ? 'Next Service' : 'View Booking Details'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Animation Modal */}
      <Modal open={animationModalOpen} onClose={() => setAnimationModalOpen(false)}>
        <Box
          sx={{
            maxWidth: 400,
            mx: 'auto',
            mt: '20vh',
            p: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          <Player autoplay loop src={DateAni} style={{ height: '200px', width: '200px', margin: '0 auto' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Please select a date first!
          </Typography>
          <Button variant="contained" onClick={() => setAnimationModalOpen(false)} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>

      <Modal open={animationModalOpen} onClose={() => setAnimationModalOpen(false)}>
        <Box
          sx={{
            maxWidth: 400,
            mx: 'auto',
            mt: '20vh',
            p: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            textAlign: 'center',
          }}
        >
          <Player autoplay loop src={DateAni} style={{ height: '200px', width: '200px', margin: '0 auto' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Please select a date first!
          </Typography>
          <Button variant="contained" onClick={() => setAnimationModalOpen(false)} sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default SchedulePage;
