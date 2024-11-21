import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import dayjs from 'dayjs';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeServiceFromCart } from '@/redux/slice/cartSlice';
import { getVoucherById } from '@/redux/slice/voucherSlice';
import { Player } from '@lottiefiles/react-lottie-player';
import Confirmed from '@/lottie/Confirmed';
import { useNavigate } from 'react-router-dom';
import { createBooking } from '@/redux/slice/userBooking';
import { getBookingHistory } from '@/redux/slice/userProfileSlice';
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const CartSummaryModal = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const [cartDetails, setCartDetails] = useState([]);
  const [overallTotalPrice, setOverallTotalPrice] = useState(0);
  const [confirmClearCartOpen, setConfirmClearCartOpen] = useState(false);
  const [confirmCreateBookingOpen, setConfirmCreateBookingOpen] = useState(false);

  const [confirmedModalOpen, setConfirmedModalOpen] = useState(false);
  useEffect(() => {
    const fetchCartDetails = async () => {
      const updatedCartDetails = await Promise.all(
        cartItems.map(async (cart) => {
          let discountAmount = 0;
          let voucherStatus = 'N/A';

          if (cart.voucherId) {
            try {
              const response = await dispatch(getVoucherById(cart.voucherId)).unwrap();
              discountAmount = response.data.discountAmount || 0;
              voucherStatus = response.data.status === 1 ? 'Active' : 'Inactive';
            } catch (error) {
              console.error('Failed to fetch voucher:', error);
            }
          }

          const cartTotal = cart.services.reduce((acc, service) => acc + (service.price || 0), 0);
          const finalTotal = Math.max(cartTotal - discountAmount, 0);

          return {
            ...cart,
            cartTotal,
            discountAmount,
            voucherStatus,
            finalTotal,
          };
        }),
      );

      setCartDetails(updatedCartDetails);

      const totalAcrossCarts = updatedCartDetails.reduce((acc, cart) => acc + cart.finalTotal, 0);
      setOverallTotalPrice(totalAcrossCarts);
    };

    fetchCartDetails();
  }, [cartItems, dispatch]);

  const handleRemoveFromCart = (cartIndex) => {
    dispatch(removeServiceFromCart(cartIndex));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setConfirmClearCartOpen(false);
  };

  const handleBooking = () => {
    navigate('/service-page');
    onClose();
  };
  const handleCreateBooking = async () => {
    try {
      // Update cart details with service times
      const updatedCartDetails = cartDetails.map((cart) => {
        const updatedServices = cart.services.map((service) => {
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

        return {
          ...cart,
          services: updatedServices,
        };
      });

      // Prepare request body for the API
      const bookingData = updatedCartDetails.map((cart) => ({
        voucherId: cart.voucherId || null,
        schedule: cart.services.map((service) => ({
          startTime: service.startTime,
          endTime: service.endTime,
          startDate: service.startDate,
          endDate: service.endDate,
        })),
        serviceId: cart.services.map((service) => service.serviceId),
        stylistId: cart.services.some((service) => service.stylistId)
          ? cart.services.map((service) => service.stylistId)
          : [],
      }));

      // Send each booking to the backend
      await Promise.all(bookingData.map((data) => dispatch(createBooking(data)).unwrap()));
      dispatch(clearCart());

      // Show animation modal
      setConfirmedModalOpen(true);

      // Delay navigation until animation completes
      setTimeout(() => {
        setConfirmedModalOpen(false); // Close animation modal
        navigate('/user/booking', { replace: true });
        dispatch(getBookingHistory()); // Refetch booking history
      }, 3000); // 3-second delay for animation
    } catch (error) {
      console.error('Failed to create booking:', error);
      alert(error.response?.data?.message || 'Failed to create booking. Please try again.');
    } finally {
      setConfirmCreateBookingOpen(false);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            width: '90%',
            maxWidth: 600,
            margin: 'auto',
            mt: '10vh',
            p: 3,
            backgroundColor: 'white',
            borderRadius: 2,
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderTop: '4px solid #1976d2',
            borderBottom: '4px solid #1976d2', // Border under the header
          }}
        >
          {cartItems.length === 0 ? (
            <>
              <Player
                autoplay
                loop
                src="https://assets9.lottiefiles.com/packages/lf20_ttvteyvs.json"
                style={{ height: '200px', width: '200px' }}
              />
              <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Your Cart is Empty!
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', mt: 1, mb: 2 }}>
                Add services to your cart and start booking your favorite beauty treatments now!
              </Typography>
              <Button variant="contained" color="primary" onClick={handleBooking}>
                Booking Services
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="h4"
                gutterBottom
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  background: 'linear-gradient(to right, #6a11cb, #2575fc)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 4,
                }}
              >
                🛒 Cart Summary
              </Typography>

              <Box
                sx={{
                  maxHeight: '55vh',
                  overflowY: 'auto',
                  padding: '0 15px',
                  backgroundColor: '#f7f9fc',
                  borderRadius: '8px',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                  paddingTop: 3,
                }}
              >
                {cartDetails.map((cart, cartIndex) => (
                  <Card
                    key={cartIndex}
                    sx={{
                      mb: 3,
                      backgroundColor: '#ffffff',
                      borderRadius: 3,
                      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                      padding: 2,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: '#495057',
                        }}
                      >
                        🎁 Cart {cartIndex + 1}
                      </Typography>
                      {cart.services.map((service, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            borderBottom: '1px solid #e9ecef',
                            paddingBottom: 2,
                            marginBottom: 2,
                            transition: 'background-color 0.3s',
                            ':hover': { backgroundColor: '#f1f3f5' },
                          }}
                        >
                          <img
                            src={service.imageLink}
                            alt={service.serviceName}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '12px',
                            }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 'bold',
                                color: '#212529',
                                mb: 1,
                              }}
                            >
                              {index + 1}. {service.serviceName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Description:</strong> {service.description}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Price:</strong> ${service.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Date:</strong> {service.startDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Time:</strong> {service.startTime} - {service.endTime}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#495057' }}>
                        Voucher Discount: {cart.voucherId ? `$${cart.discountAmount}` : 'No Voucher'}
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#495057' }}>
                        Final Total: ${cart.finalTotal.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>

              <Box
                sx={{
                  textAlign: 'center',
                  mt: 3,
                  padding: '10px',
                  borderRadius: '8px',
                  backgroundColor: '#e9ecef',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#212529',
                  }}
                >
                  🏆 Total Price: ${overallTotalPrice.toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                <Button onClick={onClose} variant="outlined" sx={{ ':hover': { background: '#f1f3f5' } }}>
                  Close
                </Button>
                <Button
                  onClick={() => setConfirmCreateBookingOpen(true)}
                  variant="contained"
                  sx={{ backgroundColor: '#51cf66', color: '#fff' }}
                >
                  Book Now 🚀
                </Button>
                <Button
                  onClick={() => setConfirmClearCartOpen(true)}
                  variant="contained"
                  sx={{ backgroundColor: '#ff6b6b', color: '#fff' }}
                >
                  Clear Cart 🗑️
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      <Dialog open={confirmClearCartOpen} onClose={() => setConfirmClearCartOpen(false)}>
        <DialogTitle>Confirm Clear Cart</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to clear all items from the cart? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClearCartOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClearCart} color="error" autoFocus>
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmCreateBookingOpen} onClose={() => setConfirmCreateBookingOpen(false)}>
        <DialogTitle>Confirm Create Booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to create bookings for all items in the cart? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmCreateBookingOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateBooking} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* Animation Modal */}
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
            loop={false} // Stop animation after one play
            src={Confirmed}
            style={{ height: '300px', width: '300px' }}
          />
          <Typography variant="h4" sx={{ color: '#fff', marginTop: 2 }}>
            Booking Confirmed!
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default CartSummaryModal;
