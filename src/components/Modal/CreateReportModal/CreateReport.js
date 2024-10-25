import React, { useState } from 'react';
import { Button, Modal, TextField, Box, Typography } from '@mui/material';
import './styles.css';
import { createReport } from '@/api/ReportApi';

const CreateReportModal = ({ open, onClose, bookingId, onSuccess = () => {} }) => {
  const [reportName, setReportName] = useState('');
  const [reportLink, setReportLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    onClose();
    setReportName('');
    setReportLink('');
  };

  const handleSubmit = async () => {
    if (!reportName || !reportLink) {
      console.error('Report name and link are required');
      return;
    }

    const reportData = {
      bookingId,
      reportName,
      reportLink,
    };

    try {
      setIsSubmitting(true);
      const response = await createReport(reportData);
      if (response.status === 1) {
        console.log('Report created successfully:', response.data);
        onSuccess(response.data); // Callback sau khi tạo báo cáo thành công
      } else {
        console.error('Failed to create report:', response.message);
      }
    } catch (error) {
      console.error('Error creating report:', error);
    } finally {
      setIsSubmitting(false);
      handleClose(); // Đóng modal sau khi xử lý
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
      BackdropProps={{
        style: { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
      }}
    >
      <Box className="modal-box">
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Create a Report
        </Typography>

        <TextField
          label="Report Name"
          value={reportName}
          onChange={(e) => setReportName(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <TextField
          label="Report Link"
          value={reportLink}
          onChange={(e) => setReportLink(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2 }}
        />

        <Button
          variant="contained"
          color="primary"
          className="full-width"
          onClick={handleSubmit}
          disabled={isSubmitting || !reportName || !reportLink}
          sx={{ marginTop: 2 }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </Box>
    </Modal>
  );
};

export default CreateReportModal;
