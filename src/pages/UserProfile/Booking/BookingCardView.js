import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

const BookingStatus = {
  0: 'None',
  1: 'InQueue',
  2: 'Accepted',
  3: 'InProgress',
  4: 'Delay',
  5: 'Complete',
  6: 'Cancel',
};

const getStatusLabel = (status) => BookingStatus[status] || 'Unknown Status';
const getChipColor = (status) => {
  switch (status) {
    case 1:
      return 'primary';
    case 2:
      return 'info';
    case 3:
      return 'warning';
    case 4:
      return 'error';
    case 5:
      return 'success';
    case 6:
      return 'default';
    default:
      return 'secondary';
  }
};

const StyledAccordion = styled(Accordion)(() => ({
  boxShadow: 'none',
  borderRadius: '8px',
  '&:before': { display: 'none' },
  '& .MuiAccordionSummary-root': { padding: '8px 16px' },
  '& .MuiAccordionDetails-root': { padding: '16px' },
}));

const BookingCardView = ({ bookings }) => {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionToggle = (bookingId) => (event, isExpanded) => {
    setExpanded(isExpanded ? bookingId : false);
  };

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return (
      <Typography align="center" sx={{ mt: 3 }}>
        No bookings found.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
      {bookings.map((booking) => (
        <Card
          key={booking.bookingId}
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease-in-out',
            '&:hover': { boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' },
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <EventAvailableIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Booking ID: {booking.bookingId}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(booking.startDate).toLocaleDateString()} -{' '}
                    {new Date(booking.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={getStatusLabel(booking.status)}
                color={getChipColor(booking.status)}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            <StyledAccordion
              expanded={expanded === booking.bookingId}
              onChange={handleAccordionToggle(booking.bookingId)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">View Services and Stylists</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {booking?.services?.map((service, index) => (
                  <Box
                    key={`${service.serviceId}-${index}`} // Use index to differentiate duplicate services
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: 'background.paper',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {service.serviceName}
                      </Typography>
                      <Typography variant="body2">with {service.stylistName}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2">Price: ${service.price}</Typography>
                      {/* Display the corresponding schedule for each service */}
                      {booking?.schedules?.[index] && (
                        <Typography variant="body2">
                          Schedule: {booking.schedules[index].startTime} - {booking.schedules[index].endTime}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </AccordionDetails>
            </StyledAccordion>

            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              Total Price: ${booking.totalPrice}
            </Typography>
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between' }}>
            {/* <Button size="small" variant="contained" color="primary">
              Rebook
            </Button> */}
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default BookingCardView;
