import React, { useState, useEffect } from 'react';
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
  IconButton,
  CircularProgress,
  styled,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { fetchServiceById } from '@/redux/slice/hairServiceSlice'; // API action
import { useDispatch, useSelector } from 'react-redux';

// Enum for booking statuses
const BookingStatus = {
  0: 'None',
  1: 'InQueue',
  2: 'Accepted',
  3: 'InProgress',
  4: 'Delay',
  5: 'Complete',
  6: 'Cancel',
};

// Status label and chip color functions
const getStatusLabel = (status) => BookingStatus[status] || 'Unknown Status';
const getChipColor = (status) => {
  switch (status) {
    case 1:
      return 'primary'; // InQueue - Blue
    case 2:
      return 'info'; // Accepted - Light Blue
    case 3:
      return 'warning'; // InProgress - Orange
    case 4:
      return 'error'; // Delay - Red
    case 5:
      return 'success'; // Complete - Green
    case 6:
      return 'default'; // Cancel - Gray
    default:
      return 'secondary'; // None - Default gray
  }
};

// Styled Accordion for better appearance
const StyledAccordion = styled(Accordion)(() => ({
  boxShadow: 'none',
  borderRadius: '8px',
  '&:before': { display: 'none' },
  '& .MuiAccordionSummary-root': { padding: '8px 16px' },
  '& .MuiAccordionDetails-root': { padding: '16px' },
}));

const BookingCardView = ({ bookings }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false); // Track expanded accordion
  const [serviceDetails, setServiceDetails] = useState({}); // Cache service details

  // Fetch service details when a service ID is provided
  const loadServiceDetails = async (serviceId) => {
    if (!serviceDetails[serviceId]) {
      try {
        const result = await dispatch(fetchServiceById(serviceId));
        setServiceDetails((prev) => ({
          ...prev,
          [serviceId]: result.payload, // Cache the service details
        }));
      } catch (error) {
        console.error('Failed to load service details:', error);
      }
    }
  };

  // Handle accordion toggle and fetch service details when expanded
  const handleAccordionToggle = (bookingId, services) => (event, isExpanded) => {
    setExpanded(isExpanded ? bookingId : false); // Expand or collapse

    if (isExpanded) {
      services?.forEach((service) => loadServiceDetails(service.serviceId)); // Fetch service details
    }
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
              onChange={handleAccordionToggle(booking.bookingId, booking.services)}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2">View Services and Stylists</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {booking?.services?.map((service) => {
                  const details = serviceDetails[service.serviceId];

                  return (
                    <Box
                      key={service.serviceId}
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
                      {details ? (
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="body2">Price: ${details.price}</Typography>
                          <Typography variant="body2">Estimate Time: {details.estimateTime}</Typography>
                        </Box>
                      ) : (
                        <CircularProgress size={20} />
                      )}
                    </Box>
                  );
                })}
              </AccordionDetails>
            </StyledAccordion>

            <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
              Total Price: ${booking.totalPrice}
            </Typography>
          </CardContent>

          <CardActions sx={{ justifyContent: 'space-between' }}>
            <Button size="small" variant="contained" color="primary">
              Rebook
            </Button>
            <IconButton size="small" color="inherit">
              <MoreVertIcon />
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default BookingCardView;
