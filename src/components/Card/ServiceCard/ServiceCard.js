import React, { useState } from 'react';
import { Container, Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import { Grid } from '@mui/material';
import BookingModal from '@/components/Modal/BookingModal/BookingModal';

function ServiceCard({ serviceCard }) {
  //BookingModalHandle
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Container>
      <Grid container spacing={3}>
        {serviceCard.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.serviceName}>
            {' '}
            {/* Use service.serviceName as the key */}
            <Card>
              <CardMedia component="img" height="140" image={service.imageLink} alt={service.serviceName} />{' '}
              {/* Corrected to service.serviceName */}
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {service.serviceName} {/* Corrected to service.serviceName */}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {service.description}
                </Typography>
                <Typography variant="body2">
                  {service.estimateTime} | ${service.price}
                </Typography>
                <div>
                  <Button onClick={handleOpenModal}>Book Now</Button>
                  <BookingModal open={modalOpen} onClose={handleCloseModal} />
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
