import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import BookingModal from '@/components/Modal/BookingModal/BookingModal2';
import FinalScheduleModal from '@/components/Card/ServiceCard/FinalScheduleModal';
import CartModal from '@/components/Modal/CartModal/CartModal';

function ServiceCard({ serviceCard }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [bookingData, setBookingData] = useState([]);

  const handleSelectService = (service) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const handleStylistNext = (data) => {
    setBookingData((prev) => [...prev, data]);
    setModalOpen(false);
    setScheduleModalOpen(true);
  };

  const handleScheduleNext = (updatedBookingData) => {
    setBookingData(updatedBookingData);
    setScheduleModalOpen(false);
    setCartModalOpen(true);
  };

  const handleProceedToFinal = () => {
    setCartModalOpen(false);
    setScheduleModalOpen(true);
  };

  const handleClearBookingData = () => {
    setBookingData([]);
  };

  const handleRemoveService = (index) => {
    const updatedBookingData = bookingData.filter((_, i) => i !== index);
    setBookingData(updatedBookingData);
  };

  // Add a function to handle back action from FinalScheduleModal to CartModal
  const handleBackToCart = () => {
    setCartModalOpen(true); // Reopen CartModal
    setCartModalOpen(false); // Close FinalScheduleModal
  };
  const handleBackToStylist = () => {
    setScheduleModalOpen(false);
    setModalOpen(true);
  };
  return (
    <Container>
      <Grid container spacing={3}>
        {serviceCard.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.serviceId}>
            <Card sx={{ borderRadius: 2, boxShadow: 3, '&:hover': { transform: 'scale(1.02)', boxShadow: 6 } }}>
              <CardMedia
                component="img"
                height="180"
                image={service.imageLink}
                alt={service.serviceName}
                sx={{ borderRadius: '8px 8px 0 0' }}
              />
              <CardContent>
                <Typography variant="h5" component="h2" fontWeight="bold">
                  {service.serviceName}
                </Typography>
                <Typography variant="body2" color="textSecondary" mt={1} mb={1}>
                  {service.description}
                </Typography>
                <Typography variant="body2">
                  ⏱ {service.estimateTime} min | 💲{service.price}
                </Typography>
                <Button onClick={() => handleSelectService(service)} sx={{ mt: 2, borderRadius: 2 }}>
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        service={selectedService}
        onNext={handleStylistNext}
      />

      <CartModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        bookingData={bookingData}
        setBookingData={setBookingData}
        onNext={handleScheduleNext}
        onProceedToFinal={handleProceedToFinal}
        onBack={handleBackToStylist}
      />

      <FinalScheduleModal
        open={cartModalOpen}
        onClose={() => {
          setCartModalOpen(false);
        }}
        bookingData={bookingData}
        onRemoveService={handleRemoveService}
        onClearBookingData={handleClearBookingData}
        onBack={handleBackToCart} // Pass the back handler to FinalScheduleModal
      />
    </Container>
  );
}

export default ServiceCard;
