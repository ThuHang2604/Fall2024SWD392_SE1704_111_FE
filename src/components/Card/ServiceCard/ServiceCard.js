import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import BookingModal from '@/components/Modal/BookingModal/BookingModal2';
import CartModal from '@/components/Modal/CartModal/CartModal';
import FinalScheduleModal from '@/components/Card/ServiceCard/FinalScheduleModal';
import { Hair } from '@/pages/home/img/hair.jpg';
function ServiceCard({ serviceCard }) {
  const [modalOpen, setModalOpen] = useState(false); // Booking Modal
  const [cartModalOpen, setCartModalOpen] = useState(false); // Appointment Summary Modal
  const [finalModalOpen, setFinalModalOpen] = useState(false); // Final Schedule Modal
  const [selectedService, setSelectedService] = useState(null); // Currently selected service
  const [bookingData, setBookingData] = useState([]); // List of all booked services

  // Handle selecting a service
  const handleSelectService = (service) => {
    setSelectedService(service);
    setModalOpen(true); // Open Booking Modal
  };

  // Handle adding a service after stylist selection
  const handleNext = (data) => {
    setBookingData((prev) => [...prev, data]);
    setModalOpen(false); // Close Booking Modal
    setCartModalOpen(true); // Open Cart Modal (Appointment Summary)
  };

  // Remove a service from the booking list
  const handleRemoveService = (index) => {
    const updatedBookingData = bookingData.filter((_, i) => i !== index);
    setBookingData(updatedBookingData);
  };

  // Handle opening the Final Schedule Modal
  const handleOpenFinalModal = () => {
    setCartModalOpen(false); // Close Cart Modal
    setFinalModalOpen(true); // Open Final Schedule Modal
  };

  // Handle going back to the Appointment Summary from Final Schedule Modal
  const handleBackToSummary = () => {
    setFinalModalOpen(false); // Close Final Schedule Modal
    setCartModalOpen(true); // Re-open Cart Modal (Appointment Summary)
  };

  return (
    <Container>
      <Grid container spacing={3}>
        {serviceCard.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.serviceId}>
            <Card>
              <CardMedia component="img" height="140" image={service.imageLink} alt={service.serviceName} />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {service.serviceName}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {service.description}
                </Typography>
                <Typography variant="body2">
                  {service.estimateTime} min | ${service.price}
                </Typography>
                <Button onClick={() => handleSelectService(service)}>Book Now</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Booking Modal */}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        service={selectedService}
        onNext={handleNext}
      />

      {/* Appointment Summary (CartModal) */}
      <CartModal
        open={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        bookingData={bookingData}
        onRemoveService={handleRemoveService}
        onScheduleAppointment={handleOpenFinalModal} // Open Final Modal
      />

      {/* Final Schedule Modal */}
      <FinalScheduleModal
        open={finalModalOpen}
        onClose={() => setFinalModalOpen(false)}
        bookingData={bookingData}
        onBack={handleBackToSummary} // Handle Back button
      />
    </Container>
  );
}

export default ServiceCard;
