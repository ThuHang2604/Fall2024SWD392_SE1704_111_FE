import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Avatar,
  Modal,
} from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createBooking } from '@/redux/slice/userBooking';
import { addToCart } from '@/redux/slice/cartSlice';
import dayjs from 'dayjs';
import { getVoucherList } from '@/redux/slice/voucherSlice';
import { toast, ToastContainer } from 'react-toastify';
import Confirmed from '@/lottie/Confirmed';
import { Player } from '@lottiefiles/react-lottie-player';
const DetailPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { bookingData } = state || {};
  const { vouchers = [] } = useSelector((state) => state.voucher);
  const { user } = useSelector((state) => state.userProfile);
  const { isAuthenticated } = useSelector((state) => state.auth);
  console.log('user:', user);
  const [selectedVoucher, setSelectedVoucher] = useState('');
  const [totalPrice, setTotalPrice] = useState(bookingData.reduce((total, item) => total + (item.price || 0), 0));
  const [confirmBookingModalOpen, setConfirmBookingModalOpen] = useState(false);
  const [confirmAddToCartModalOpen, setConfirmAddToCartModalOpen] = useState(false);

  const [userName, setUserName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
  useEffect(() => {
    dispatch(getVoucherList());
  }, [dispatch]);
  useEffect(() => {
    if (!isAuthenticated) {
      setUserName('');
      setPhone('');
    } else {
      setUserName(user?.fullName || '');
      setPhone(user?.phone || '');
    }
  }, [isAuthenticated, user]);

  const calculateEndTime = (services) => {
    return services.map((service) => {
      const [hours, minutes] = service.estimateTime.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes;
      const formattedStartTime = dayjs(`${service.startDate}T${service.startTime}`).format('HH:mm:ss');
      const endDateTime = dayjs(`${service.startDate}T${formattedStartTime}`).add(totalMinutes, 'minute');
      return {
        ...service,
        startTime: formattedStartTime,
        endTime: endDateTime.format('HH:mm:ss'),
      };
    });
  };

  const [updatedBookingData, setUpdatedBookingData] = useState(calculateEndTime(bookingData));

  const handleVoucherChange = (voucherId) => {
    setSelectedVoucher(voucherId);
    const updatedData = updatedBookingData.map((service) => ({
      ...service,
      voucherId: voucherId,
    }));
    const selected = vouchers.find((voucher) => voucher.voucherId === voucherId);
    const discount = selected ? selected.discountAmount : 0;
    const originalPrice = bookingData.reduce((total, item) => total + (item.price || 0), 0);
    setTotalPrice(Math.max(originalPrice - discount, 0));
    setUpdatedBookingData(updatedData);
  };

  const handleAddToCart = () => {
    const cartItem = {
      services: updatedBookingData,
      voucherId: selectedVoucher,
      totalPrice,
    };
    dispatch(addToCart(cartItem));
    setConfirmAddToCartModalOpen(false);
    navigate('/service-page');
  };

  const handleConfirmBooking = () => {
    if (!userName || !phone) {
      toast.error('Please enter your name and phone number.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number must be 10 digits.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const requestBody = {
      userName,
      phone,
      voucherId: selectedVoucher || null,
      schedule: updatedBookingData.map((item) => ({
        startTime: item.startTime,
        startDate: item.startDate,
      })),
      serviceId: updatedBookingData.map((item) => item.serviceId),
      stylistId: updatedBookingData.some((item) => item.stylistId)
        ? updatedBookingData.map((item) => item.stylistId)
        : [],
    };

    dispatch(createBooking(requestBody))
      .unwrap()
      .then(() => {
        toast.success('Booking confirmed successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });

        setConfirmBookingModalOpen(false);

        // Open the animation modal
        setConfirmedModalOpen(true);

        // Delay navigation until after the animation
        setTimeout(() => {
          setConfirmedModalOpen(false); // Close the animation modal
          if (!isAuthenticated) {
            navigate('/service-page');
          } else {
            navigate('/user/booking');
          }
        }, 3000); // Delay for 3 seconds
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to create booking.', {
          position: 'top-right',
          autoClose: 3000,
        });
      });
  };

  return (
    <>
      <ToastContainer />
      <Grid container spacing={2} sx={{ backgroundColor: '#f9f9f9', minHeight: '100vh', padding: '20px' }}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ padding: '20px', borderRadius: '12px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <Typography variant="h6" sx={{ marginBottom: '20px' }}>
              Summary
            </Typography>
            {!isAuthenticated ? (
              <Box sx={{ display: 'flex', gap: 2, marginBottom: '20px' }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  variant="outlined"
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px',
                  borderRadius: '8px',
                  backgroundColor: '#f5f5f5',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  marginBottom: '20px',
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      color: '#3f51b5',
                      marginBottom: '8px',
                    }}
                  >
                    User Information
                  </Typography>
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 500,
                      color: '#555',
                      fontSize: '1rem',
                    }}
                  >
                    <strong>Name:</strong> {user?.fullName || 'N/A'}
                  </Typography>
                  <Typography
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 500,
                      color: '#555',
                      fontSize: '1rem',
                    }}
                  >
                    <strong>Phone:</strong> {user?.phone || 'N/A'}
                  </Typography>
                </Box>
                <Avatar
                  alt={user?.fullName || 'User Avatar'}
                  src={user?.imageLink || ''}
                  sx={{
                    width: 60,
                    height: 60,
                    border: '2px solid #3f51b5',
                    backgroundColor: '#e3f2fd',
                  }}
                />
              </Box>
            )}
            <Typography>
              <strong>Total Price:</strong> ${totalPrice}
            </Typography>
            {isAuthenticated && (
              <FormControl fullWidth sx={{ marginTop: '20px' }}>
                <InputLabel>Voucher</InputLabel>
                <Select value={selectedVoucher} onChange={(e) => handleVoucherChange(e.target.value)} label="Voucher">
                  {vouchers.map((voucher) => (
                    <MenuItem key={voucher.voucherId} value={voucher.voucherId}>
                      Discount: ${voucher.discountAmount}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <Box sx={{ marginTop: '20px' }}>
              <Button fullWidth variant="outlined" onClick={() => navigate(-1)} sx={{ marginBottom: '10px' }}>
                Back
              </Button>
              {isAuthenticated && (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => setConfirmAddToCartModalOpen(true)}
                  sx={{ marginBottom: '10px' }}
                >
                  Add to Cart
                </Button>
              )}
              <Button fullWidth variant="contained" color="primary" onClick={() => setConfirmBookingModalOpen(true)}>
                Confirm Booking
              </Button>
            </Box>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          {/* <Typography
            variant="h3"
            sx={{ marginLeft: '10px', marginBottom: '20px', fontSize: 40, fontFamily: 'fantasy' }}
          >
            Customer's Information
          </Typography>
          {!isAuthenticated ? (
            <Box sx={{ display: 'flex', gap: 2, marginBottom: '20px' }}>
              <TextField
                fullWidth
                label="Your Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                variant="outlined"
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    color: '#3f51b5',
                    marginBottom: '8px',
                  }}
                >
                  User Information
                </Typography>
                <Typography
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500,
                    color: '#555',
                    fontSize: '1rem',
                  }}
                >
                  <strong>Name:</strong> {user?.fullName || 'N/A'}
                </Typography>
                <Typography
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 500,
                    color: '#555',
                    fontSize: '1rem',
                  }}
                >
                  <strong>Phone:</strong> {user?.phone || 'N/A'}
                </Typography>
              </Box>
              <Avatar
                alt={user?.fullName || 'User Avatar'}
                src={user?.imageLink || ''}
                sx={{
                  width: 60,
                  height: 60,
                  border: '2px solid #3f51b5',
                  backgroundColor: '#e3f2fd',
                }}
              />
            </Box>
          )} */}
          <Typography
            variant="h3"
            sx={{ marginLeft: '10px', marginBottom: '20px', fontSize: 40, fontFamily: 'fantasy' }}
          >
            Service Details
          </Typography>
          {updatedBookingData.map((service, index) => (
            <Card
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                marginBottom: '20px',
              }}
            >
              <Avatar
                src={service.imageLink}
                alt={service.serviceName}
                sx={{ width: 80, height: 80, marginRight: '16px', borderRadius: '8px' }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {service.serviceName}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '8px' }}>
                  {service.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Time
                    </Typography>
                    <Typography>
                      {service.startTime} - {service.endTime}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Date
                    </Typography>
                    <Typography>{service.startDate}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      Price
                    </Typography>
                    <Typography>${service.price}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Grid>

        {/* Confirmation Modals */}
        <Dialog open={confirmAddToCartModalOpen} onClose={() => setConfirmAddToCartModalOpen(false)}>
          <DialogTitle>Confirm Add to Cart</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to add these services to your cart?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmAddToCartModalOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddToCart} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmBookingModalOpen} onClose={() => setConfirmBookingModalOpen(false)}>
          <DialogTitle>Confirm Booking</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to confirm the booking?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmBookingModalOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking} color="primary">
              Confirm Booking
            </Button>
          </DialogActions>
        </Dialog>

        <Modal open={confirmedModalOpen} onClose={() => setConfirmedModalOpen(false)}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Player
              autoplay
              loop={false} // Stop after one loop
              src={Confirmed}
              style={{ height: '300px', width: '300px' }}
            />
            <Typography variant="h4" sx={{ color: '#fff', marginTop: 2 }}>
              Booking Confirmed!
            </Typography>
          </Box>
        </Modal>
      </Grid>
    </>
  );
};

export default DetailPage;
