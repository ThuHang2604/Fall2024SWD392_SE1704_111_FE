import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, TextField, Box, Typography } from '@mui/material';
import { createReport } from '@/api/ReportApi';

const CreateReportModal = ({ open, onClose, bookingId, onSuccess = () => {}, onError = () => {} }) => {
  const [reportName, setReportName] = useState('');
  const [reportLink, setReportLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    setReportName('');
    setReportLink('');
  };

  const handleSubmit = async () => {
    if (!reportName) {
      onError('Report name is required');
      return;
    }

    if (!reportLink) {
      onError('Report link must be a valid URL');
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
        onSuccess(response.data);
        toast.success('Report created successfully');
        setTimeout(() => {
          navigate('/report-list');
        }, 1000);
        handleClose();
      } else {
        onError(`Failed to create report: ${response.message}`);
      }
    } catch (error) {
      console.error('Error creating report:', error);
      onError('Report link must be a valid URL');
    } finally {
      setIsSubmitting(false);
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
