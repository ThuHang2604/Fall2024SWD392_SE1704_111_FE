import React, { useState } from 'react';
import { Button, Modal, TextField, Box, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateReport } from '@/api/ReportApi';
import ConfirmUpdateDialog from '../DialogConfirm/ConfirmUpdate';

const UpdateReportModal = ({ open, onClose, reportId, initialReportData, onSuccess = () => {} }) => {
  const [reportName, setReportName] = useState(initialReportData?.reportName || '');
  const [reportLink, setReportLink] = useState(initialReportData?.reportLink || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleClose = () => {
    onClose();
    setReportName('');
    setReportLink('');
  };

  const handleSubmit = async () => {
    if (!reportName || !reportLink) {
      toast.error('Report name and link are required');
      return;
    }

    const reportData = {
      reportName,
      reportLink,
    };

    try {
      setIsSubmitting(true);
      const response = await updateReport(reportId, reportData);
      if (response.status === 1) {
        toast.success('Report updated successfully');
        onSuccess(response.data);
      } else {
        toast.error(`Failed to update report: ${response.message}`);
      }
    } catch (error) {
      toast.error('Error updating report');
      console.error('Error updating report:', error);
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };

  const handleOpenConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
  };

  const handleConfirmUpdate = () => {
    setConfirmDialogOpen(false);
    handleSubmit();
  };

  return (
    <>
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
            Update Report
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
            onClick={handleOpenConfirmDialog}
            disabled={isSubmitting || !reportName || !reportLink}
            sx={{ marginTop: 2 }}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </Box>
      </Modal>

      {/* Dialog  */}
      <ConfirmUpdateDialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmUpdate}
        title="Confirm Update"
        content="Are you sure you want to update this report?"
      />
    </>
  );
};

export default UpdateReportModal;
