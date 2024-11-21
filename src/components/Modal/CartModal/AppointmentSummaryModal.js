import React, { useState } from 'react';
import './test.scss'; // Import the new styles
import { Modal, Box, Typography, Button, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AppointmentSummaryModal = ({ open, onClose, bookingData, onAddService, onProceed, onDeleteService }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="appointment-summary" sx={{ mx: 'auto', mt: '10vh' }}>
        <Typography className="header">Appointment Summary</Typography>

        <List className="services">
          {bookingData.map((service, index) => (
            <ListItem key={index} className="service-item">
              {/* Image Section */}
              <div className="service-image">
                <img src={service.imageLink} alt={service.serviceName} />
              </div>

              {/* Content Section */}
              <div className="service-content">
                <div className="service-name">{service.serviceName}</div>
                <div className="service-details">
                  Duration: {service.estimateTime} | Price: ${service.price} | Stylist:{' '}
                  {service.stylist ? service.stylist.stylistName : 'Any stylist'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="icon-button delete" onClick={() => onDeleteService(index)}>
                  <DeleteIcon />
                </button>
              </div>
            </ListItem>
          ))}
        </List>

        <button className="add-service" onClick={onAddService}>
          + Add Another Service
        </button>

        <button className="proceed-button" onClick={onProceed}>
          Proceed to Schedule and Stylist Selection
        </button>
      </Box>
    </Modal>
  );
};

export default AppointmentSummaryModal;
