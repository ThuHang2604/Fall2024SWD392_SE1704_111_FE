// ServiceCard.js
import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Button, Grid } from '@mui/material';
import CartModal from '@/components/Modal/CartModal/CartModal';
import AppointmentSummaryModal from '@/components/Modal/CartModal/AppointmentSummaryModal';
import { useNavigate } from 'react-router-dom';

function ServiceCard({ serviceCard }) {
  const navigate = useNavigate();
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);
  const [bookingData, setBookingData] = useState([]);

  const handleSelectService = (service) => {
    console.log('Service selected:', service);
    setBookingData([...bookingData, { ...service, stylist: null }]); // Add service with default "any stylist"
    setSummaryModalOpen(true);
  };

  const handleAddService = () => {
    console.log('Adding another service...');
    setSummaryModalOpen(false);
  };

  const handleProceedToCart = () => {
    setSummaryModalOpen(false);
    // Navigate to SchedulePage with bookingData
    navigate('/schedule', { state: { bookingData } });
  };

  const handleEditStylist = (service, stylist) => {
    setBookingData((prevData) =>
      prevData.map((item) => (item.serviceId === service.serviceId ? { ...item, stylist } : item)),
    );
  };
  const handleDeleteService = (index) => {
    setBookingData((prev) => prev.filter((_, i) => i !== index));
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

      <AppointmentSummaryModal
        open={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
        bookingData={bookingData}
        onEditStylist={handleEditStylist} // Pass handleEditStylist here
        onAddService={handleAddService}
        onProceed={handleProceedToCart}
        onDeleteService={handleDeleteService}
      />
    </Container>
  );
}

export default ServiceCard;
