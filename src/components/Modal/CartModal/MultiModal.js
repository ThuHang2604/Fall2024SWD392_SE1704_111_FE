import React, { useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import SelectServiceStep from '../../Card/ServiceCard/SelectServiceStep';
import SelectStylistStep from '../../Card/ServiceCard/SelectStylistStep';
import BookingSummary from '../BookingModal/BookingSummary';

const MultiStepModal = ({ open, onClose, onAddService, selectedServices }) => {
  const [step, setStep] = useState(1);
  const [currentService, setCurrentService] = useState(null);

  const handleNextService = (service) => {
    setCurrentService(service);
    setStep(2);
  };

  const handleNextStylist = (stylist) => {
    const serviceWithStylist = { ...currentService, stylist };
    onAddService(serviceWithStylist);
    setStep(3);
  };

  const handleAddMoreService = () => {
    setStep(1);
  };

  const handleFinish = () => {
    console.log('Final Booking:', selectedServices);
    onClose();
  };

  return (
    <Box>
      {step === 1 && <SelectServiceStep onNext={handleNextService} />}
      {step === 2 && <SelectStylistStep service={currentService} onNext={handleNextStylist} />}
      {step === 3 && (
        <BookingSummary selectedServices={selectedServices} onAddMore={handleAddMoreService} onFinish={handleFinish} />
      )}
    </Box>
  );
};

export default MultiStepModal;
