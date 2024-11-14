import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedbackList, createFeedback } from '@/redux/slice/feedbackSlice';
import { Box, Typography, Button, Modal, TextField, Card, CardContent, Container } from '@mui/material';

const FeedbackList = () => {
  const dispatch = useDispatch();
  const feedbackState = useSelector((state) => state.feedBack);
  const loggedInUserId = useSelector((state) => state.auth.user?.userId); // Assumes user ID is in auth state
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(getFeedbackList());
  }, [dispatch]);

  if (!feedbackState) {
    return <Typography>Redux state not available</Typography>;
  }

  // console.log('feedbackState:', feedbackState);
  const { feedbacks, isLoading, error } = feedbackState;

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setDescription(''); // Reset description when closing modal
  };

  const handleSubmit = async () => {
    if (description.trim()) {
      try {
        await dispatch(createFeedback({ description }));
        await dispatch(getFeedbackList()); // Fetch the list again after creating a feedback
        handleClose(); // Close the modal on success
      } catch (error) {
        console.error('Error creating feedback:', error);
      }
    } else {
      alert('Description cannot be empty');
    }
  };

  // Array of gradient background colors
  const gradients = [
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    'linear-gradient(135deg, #fdcbf1 0%, #e6dee9 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
  ];

  return (
    <Container maxWidth={false} sx={{ mt: 4, maxWidth: '1400px' }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Monoton, Fantasy' }}>
          Feedback
        </Typography>

        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <Box
            sx={{
              border: '3px solid black',
              borderRadius: 2,
              padding: 4,
              width: '728px',
              textAlign: 'center',
            }}
          >
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
              {feedbacks.map((feedback, index) => (
                <Card
                  key={feedback.feedbackId}
                  sx={{
                    maxWidth: 300,
                    m: 1,
                    boxShadow:
                      feedback.userId === loggedInUserId
                        ? '0 4px 12px rgba(255, 0, 0, 0.3)'
                        : '0 4px 8px rgba(0, 0, 0, 0.2)',
                    border: feedback.userId === loggedInUserId ? '2px solid red' : '1px solid transparent',
                    background: gradients[index % gradients.length], // Apply gradient background
                    color: '#ffffff', // Text color for contrast
                    borderRadius: 2,
                    transition: 'transform 0.2s ease-in-out',
                    transform: feedback.userId === loggedInUserId ? 'scale(1.05)' : 'scale(1)', // Slightly larger for own feedbacks
                  }}
                >
                  <CardContent style={{ color: 'black' }}>
                    <Typography variant="body1" color="inherit" gutterBottom>
                      {feedback.description || 'No Description'}
                    </Typography>
                    {/* <Typography variant="caption" color="inherit">
                      Created by: {feedback.createBy || 'N/A'} on{' '}
                      {feedback.createDate ? new Date(feedback.createDate).toLocaleDateString() : 'N/A'}
                    </Typography> */}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button onClick={handleOpen} variant="contained" color="primary">
            Create Feedback
          </Button>
        </Box>

        {/* Modal for entering feedback description */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Create Feedback
            </Typography>
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Submit
              </Button>
              <Button onClick={handleClose} variant="text" color="secondary">
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default FeedbackList;
