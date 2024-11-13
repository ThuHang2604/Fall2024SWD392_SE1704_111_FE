import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import BookingModal from '@/components/Modal/BookingModal/BookingModal2';
import FinalScheduleModal from '@/components/Card/ServiceCard/FinalScheduleModal';
import CartModal from '@/components/Modal/CartModal/CartModal';
import Hair from '@/pages/home/img/hair.jpg';

function ServiceCard({ serviceCard }) {
  const [modalOpen, setModalOpen] = useState(false); // Booking (Stylist) Modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false); // Schedule Modal
  const [cartModalOpen, setCartModalOpen] = useState(false); // Final Summary Modal
  const [selectedService, setSelectedService] = useState(null); // Selected service
  const [bookingData, setBookingData] = useState([]); // List of booked services

  const handleSelectService = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleStylistNext = (data) => {
    setBookingData((prev) => [...prev, data]);
    setModalOpen(false);
    setScheduleModalOpen(true); // Open Schedule Modal next
  };

  const handleScheduleNext = (updatedBookingData) => {
    setBookingData(updatedBookingData); // Update booking data with schedules
    setScheduleModalOpen(false);
    setCartModalOpen(true); // Open Cart (Summary) Modal next
  };

  const handleRemoveService = (index) => {
    const updatedBookingData = bookingData.filter((_, i) => i !== index);
    setBookingData(updatedBookingData);
  };

  return (
    <Container>
      <Grid container spacing={3}>
        {serviceCard.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.serviceId}>
            <Card>
              <CardMedia component="img" height="140" image={Hair} alt={service.serviceName} />
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

      {/* Stylist (Booking) Modal */}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        service={selectedService}
        onNext={handleStylistNext}
      />

      {/* Schedule Modal */}
      <CartModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        bookingData={bookingData}
        setBookingData={setBookingData}
        onNext={handleScheduleNext}
      />

      {/* Final Summary (CartModal) */}
      <FinalScheduleModal
        open={cartModalOpen}
        onClose={() => setCartModalOpen(false)}
        bookingData={bookingData}
        onRemoveService={handleRemoveService}
      />
    </Container>
  );
}

export default ServiceCard;
