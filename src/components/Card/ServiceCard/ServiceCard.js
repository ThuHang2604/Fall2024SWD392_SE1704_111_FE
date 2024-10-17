import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import { Grid } from '@mui/material';
import BookingModal from '@/components/Modal/BookingModal/BookingModal';

function ServiceCard({ serviceCard }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null); // Lưu id của service được chọn

  const handleOpenModal = (serviceId) => {
    setSelectedServiceId(serviceId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedServiceId(null);
  };

  return (
    <Container>
      <Grid container spacing={3}>
        {serviceCard.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.serviceName}>
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
                <div>
                  <Button onClick={() => handleOpenModal(service.serviceId)}>Book Now</Button>
                  <BookingModal open={modalOpen} onClose={handleCloseModal} serviceId={selectedServiceId} />
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ServiceCard;
