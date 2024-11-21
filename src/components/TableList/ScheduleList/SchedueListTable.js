import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Typography, Card, CardContent, Avatar, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getBookingsOfStylist } from '@/redux/slice/userBooking';
import { fetchServiceByName } from '@/redux/slice/hairServiceSlice';
import './styles.scss';
function ScheduleListTable({ bookingList = [] }) {
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [selectedDetails, setSelectedDetails] = useState(null);
  // console.log('selectedDetails', selectedDetails);
  // Normalize date for comparison
  const normalizeDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDetails(null); // Reset service details when date changes
  };

  useEffect(() => {
    // Filter bookings for the selected date
    const formattedDate = normalizeDate(selectedDate);
    const bookingsForDate = bookingList.filter(
      (booking) => normalizeDate(booking?.schedules?.startDate) === formattedDate,
    );
    setFilteredBookings(bookingsForDate);
  }, [selectedDate, bookingList]);

  const handleTimeSlotClick = async (booking) => {
    const serviceName = booking.services.serviceName;

    // Set base selectedDetails
    setSelectedDetails({
      serviceName,
      createBy: booking.createBy,
      startTime: booking.schedules.startTime,
      endTime: booking.schedules.endTime,
      startDate: booking.schedules.startDate,
    });

    try {
      // Fetch service details using serviceName
      const response = await dispatch(fetchServiceByName(serviceName)).unwrap();

      if (response?.data?.length > 0) {
        const service = response.data[0]; // Extract the first service
        setSelectedDetails((prev) => ({
          ...prev,
          imageLink: service.imageLink,
          description: service.description,
          price: service.price,
        }));
      }
    } catch (error) {
      // console.error('Error fetching service details:', error);
      setSelectedDetails((prev) => ({
        ...prev,
        imageLink: null,
        description: 'Service details unavailable',
        price: 'N/A',
      }));
    }
  };

  const tileDisabled = ({ date }) => {
    const formattedDate = normalizeDate(date);
    return !bookingList.some((booking) => normalizeDate(booking?.schedules?.startDate) === formattedDate);
  };

  const tileClassName = ({ date }) => {
    const formattedDate = normalizeDate(date);
    return bookingList.some((booking) => normalizeDate(booking?.schedules?.startDate) === formattedDate)
      ? 'highlight'
      : '';
  };

  return (
    <Box sx={{ padding: 3 }}>
      {/* Calendar Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
        <Box>
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileDisabled={tileDisabled}
            tileClassName={tileClassName}
          />
        </Box>

        {/* Time Slots Section */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Available Time Slots for {selectedDate.toDateString()}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <Button
                  key={booking.bookingId}
                  variant="outlined"
                  color={selectedDetails?.startTime === booking.schedules.startTime ? 'primary' : 'inherit'}
                  onClick={() => handleTimeSlotClick(booking)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: 1,
                    textTransform: 'none',
                  }}
                >
                  <Typography>{booking.schedules.startTime}</Typography>
                  <Typography>{booking.schedules.endTime}</Typography>
                </Button>
              ))
            ) : (
              <Typography variant="body1">No schedules available for this date.</Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Service Details Section */}
      <Typography variant="h6" sx={{ marginBottom: 2, textAlign: 'center', width: '100%', marginTop: 4 }}>
        Service Details
      </Typography>
      <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'center' }}>
        {selectedDetails ? (
          <Card
            sx={{
              padding: 2,
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)',
              borderRadius: 4,
              width: '600px',
            }}
          >
            {/* Display Service Image */}
            {selectedDetails.imageLink ? (
              <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 3 }}>
                <Avatar
                  src={selectedDetails.imageLink}
                  alt={selectedDetails.serviceName}
                  sx={{
                    width: 100,
                    height: 100,
                    border: '2px solid #e0e0e0',
                  }}
                />
              </Box>
            ) : (
              <Typography variant="body1">Loading service details...</Typography>
            )}

            {/* Display Service Details */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#333' }}>
                {selectedDetails.serviceName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#757575', marginBottom: 2 }}>
                {selectedDetails.description || 'No description available'}
              </Typography>

              {/* Additional Details */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#555' }}>
                    Customer
                  </Typography>
                  <Typography>{selectedDetails.createBy}</Typography>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#555' }}>
                    Time
                  </Typography>
                  <Typography>
                    {selectedDetails.startTime} - {selectedDetails.endTime}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#555' }}>
                    Price
                  </Typography>
                  <Typography>{selectedDetails.price ? `${selectedDetails.price} $` : 'N/A'}</Typography>
                </Box>
              </Box>
            </Box>
          </Card>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#757575' }}>
            Select a time slot to view service details
          </Typography>
        )}
      </Box>
    </Box>
  );
}

export default ScheduleListTable;
