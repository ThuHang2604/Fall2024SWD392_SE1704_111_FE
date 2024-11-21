import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Paper,
  Card,
  CardContent,
  Divider,
  Pagination,
  Modal,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  TableSortLabel,
} from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';
import { getAllBookings } from '@/redux/slice/userBooking'; // Import the thunk
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { assignStylistToSchedule, updateScheduleUserByUserId } from '@/redux/slice/scheUserSlice';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { toast, ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
const localizer = momentLocalizer(moment);

const UserListTable = ({ userList = [], bookingsNoStylist = [] }) => {
  // Filter users with role = 4
  const filteredUsers = userList.filter((user) => user.role === 2);
  const dispatch = useDispatch();
  const { bookings: bookingList, isLoading } = useSelector((state) => state.booking);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  console.log('bookingsNoStylist:', bookingsNoStylist);
  //   console.log('bookingList:', bookingList);
  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Tab state
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  // Pagination state for the Booking List
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 5;

  // Search and sorting state
  const [searchCustomer, setSearchCustomer] = useState('');
  const [sortDirection, setSortDirection] = useState('desc');

  // Modal state
  const [openModal, setOpenModal] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState(null);
  //   console.log('selectedStylist:', selectedStylist);
  const handleOpenModal = (stylist) => {
    setSelectedStylist(stylist);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedStylist(null);
  };
  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setConfirmDialog(true);
  };

  const handleConfirmAssign = async () => {
    if (selectedBooking) {
      setLoading(true);
      const { schedules, bookingId } = selectedBooking;
      const scheduleUserId = schedules[0]?.scheduleId;

      if (scheduleUserId && bookingId && selectedStylist?.userId) {
        try {
          console.log('Sending to API:', { scheduleUserId, stylistId: selectedStylist.userId, bookingId });
          const result = await dispatch(
            updateScheduleUserByUserId({
              scheduleUserId,
              stylistId: selectedStylist.userId,
              bookingId,
            }),
          );

          if (result.payload?.status === 1) {
            toast.success('Stylist assigned successfully!');
            setTimeout(() => {
              navigate('/assign-list');
            }, 1000); // Delay for a smoother user experience
          } else {
            toast.error(result.payload?.message || 'Failed to update schedule user');
          }
        } catch (error) {
          console.error('Error during update:', error);
          toast.error('An error occurred: ' + error.message);
        }
      } else {
        console.error('Invalid scheduleUserId, bookingId, or stylistId:', {
          scheduleUserId,
          bookingId,
          stylistId: selectedStylist?.userId,
        });
        toast.error('Invalid data provided for assigning stylist.');
      }
      setLoading(false);
      setConfirmDialog(false);
      setSelectedBooking(null);
    }
  };
  // Get bookings for selected stylist
  const stylistBookings = selectedStylist
    ? bookingList.filter((booking) =>
        booking.services.some((services) => {
          // Kiểm tra nếu stylistName là null hoặc trùng với selectedStylist.userName
          return services.stylistName == selectedStylist.userName;
        }),
      )
    : [];

  //   console.log('stylistBookings:', stylistBookings);

  // Calculate the index of the first and last booking for the current page

  // Handle page change
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const calendarEvents = Object.values(
    [...stylistBookings, ...bookingsNoStylist].reduce((acc, booking) => {
      const date = new Date(booking.schedules[0]?.startDate).toISOString().split('T')[0]; // YYYY-MM-DD format
      if (!acc[date]) {
        acc[date] = {
          title: `Booking IDs: ${booking.bookingId}`,
          start: new Date(booking.schedules[0]?.startDate),
          end: new Date(booking.schedules[0]?.startDate),
          bookings: [booking], // Group bookings by date
        };
      } else {
        acc[date].title += `, ${booking.bookingId}`; // Add Booking ID to title
        acc[date].bookings.push(booking); // Add booking to the group
      }
      return acc;
    }, {}),
  );

  const handleSortDate = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  // Filter bookings by search term
  const filteredBookings = bookingList.filter((booking) =>
    booking.userName.toLowerCase().includes(searchCustomer.toLowerCase()),
  );

  const handleSelectEvent = (event) => {
    const { bookings } = event;
    const bookingDetails = bookings
      .map(
        (booking) =>
          `Booking ID: ${booking.bookingId}\nCustomer: ${booking.userName}\nService: ${booking.services
            .map((service) => service.serviceName)
            .join(', ')}\nStart Time: ${booking.schedules[0]?.startTime}\nEnd Time: ${
            booking.schedules[0]?.endTime
          }\nDate: ${new Date(booking.schedules[0]?.startDate).toLocaleDateString()}`,
      )
      .join('\n\n');

    alert(`Bookings for the selected date:\n\n${bookingDetails}`);
  };
  // Sort bookings by date
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookingList = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  console.log('currentBookingList:', currentBookingList);
  return (
    <Box sx={{ padding: 4 }}>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Header Section */}
      <Typography
        variant="h3"
        align="center"
        sx={{
          marginBottom: 3,
          fontSize: '2.5rem',
          fontWeight: 'bold',
          fontFamily: 'fantasy',
          color: '#3f51b5',
        }}
      >
        Booking Management
      </Typography>

      {/* Tabs for switching between User List and Booking Tables */}
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        centered
        sx={{
          marginBottom: 3,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: '1.2rem',
            fontWeight: 'bold',
          },
          '& .Mui-selected': {
            color: '#3f51b5',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#3f51b5',
          },
        }}
      >
        <Tab label="Bookings" />
        <Tab label="Stylist List" />
      </Tabs>

      {/* Tab Content */}
      {currentTab === 1 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center', // Căn giữa theo chiều ngang
            alignItems: 'flex-start',
            minHeight: '100vh', // Chiều cao tối thiểu 100% viewport
          }}
        >
          <Card
            sx={{
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: '#f9f9f9',
              width: '1000px',
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ marginBottom: 3, color: '#3f51b5', fontWeight: 'bold' }}>
                Stylist List
              </Typography>
              <Divider sx={{ marginBottom: 3 }} />
              <Table>
                <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Stylist ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow
                      key={user.userId}
                      sx={{
                        '&:hover': { backgroundColor: '#f1f1f1' },
                      }}
                      onClick={() => handleOpenModal(user)} // Open modal on click
                    >
                      <TableCell>{user.userId}</TableCell>
                      <TableCell>{user.userName}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.status === 1 ? 'Available' : 'Not Available'}
                          color={user.status === 1 ? 'success' : 'error'}
                          sx={{
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Box>
      )}

      {currentTab === 0 && (
        <>
          {/* Bookings with No Stylist */}
          <Card
            sx={{
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: 4,
              overflow: 'hidden',
              marginBottom: 4,
              backgroundColor: '#f9f9f9',
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ marginBottom: 3, color: '#3f51b5', fontWeight: 'bold' }}>
                Bookings with No Stylist
              </Typography>
              <Divider sx={{ marginBottom: 3 }} />
              <Table>
                <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Booking ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Service Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Start Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>End Time</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingsNoStylist.map((booking, index) => (
                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                      <TableCell>{booking.bookingId || 'N/A'}</TableCell>
                      <TableCell>
                        {booking.services?.length > 0
                          ? booking.services.map((service) => service.serviceName).join(', ')
                          : 'No Services'}
                      </TableCell>
                      <TableCell>{booking.schedules?.[0]?.startTime || 'Not Available'}</TableCell>
                      <TableCell>{booking.schedules?.[0]?.endTime || 'Not Available'}</TableCell>
                      <TableCell>
                        {booking.schedules?.[0]?.startDate
                          ? new Date(booking.schedules[0].startDate).toLocaleDateString()
                          : 'Not Available'}
                      </TableCell>
                      <TableCell>{booking.userName || 'Unknown'}</TableCell>
                      <TableCell>{booking.totalPrice || '0'}</TableCell>
                      <TableCell>
                        <Typography
                          sx={{
                            backgroundColor: '#3f51b5',
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: 2,
                            textAlign: 'center',
                          }}
                        >
                          Assign
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Booking List with Pagination */}
          <Card
            sx={{
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: '#f9f9f9',
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ marginBottom: 3, color: '#3f51b5', fontWeight: 'bold' }}>
                Booking List
              </Typography>

              <Divider sx={{ marginBottom: 3 }} />
              {/* Search Input */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 3 }}>
                <TextField
                  label="Search by Customer"
                  variant="outlined"
                  value={searchCustomer}
                  onChange={(e) => setSearchCustomer(e.target.value)}
                  sx={{ marginRight: 2 }}
                />
              </Box>
              <Table>
                <TableHead sx={{ backgroundColor: '#e3f2fd' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Booking ID</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Service</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Total Price</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <TableSortLabel active direction={sortDirection} onClick={handleSortDate}>
                        Start Date
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentBookingList.map((booking, index) => (
                    <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f1f1f1' } }}>
                      <TableCell>{booking.bookingId}</TableCell>
                      <TableCell>{booking.userName}</TableCell>
                      <TableCell>{booking.services[0]?.serviceName}</TableCell>
                      <TableCell>{booking.totalPrice}</TableCell>
                      <TableCell>{new Date(booking.startDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                count={Math.ceil(sortedBookings.length / bookingsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
              />
            </CardContent>
          </Card>
        </>
      )}

      {/* Modal for showing stylist's bookings */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            padding: 4,
            width: '80%',
            height: '80%',
            borderRadius: 2,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: '#3f51b5' }}>
            Bookings for {selectedStylist?.userName}
          </Typography>

          {/* Lịch */}
          <Box sx={{ flex: 1, marginBottom: 2 }}>
            <Calendar
              localizer={localizer}
              events={calendarEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '300px' }}
              views={['month']}
              selectable
              tileDisabled={({ date }) => {
                // Disable past dates
                const today = new Date();
                return date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              }}
              onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start.toISOString().split('T')[0])}
              onSelectEvent={(event) => {
                if (event.type === 'noStylist') {
                  const selected = bookingsNoStylist.find(
                    (booking) => `Booking ID: ${booking.bookingId} (No Stylist)` === event.title,
                  );
                  setSelectedBooking(selected);
                  setConfirmDialog(true);
                }
              }}
              eventPropGetter={(event) => {
                let backgroundColor = event.type === 'stylist' ? '#ff5722' : '#ffeb3b'; // Yellow for stylist, Red for no stylist
                return {
                  style: {
                    backgroundColor,
                    color: 'white',
                    borderRadius: '5px',
                    padding: '2px',
                  },
                };
              }}
            />
          </Box>

          {/* Thẻ thông tin */}
          {/* Merge bookings and display */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, overflow: 'auto' }}>
            {[
              ...stylistBookings.map((booking) => ({ ...booking, type: 'stylist' })),
              ...bookingsNoStylist.map((booking) => ({ ...booking, type: 'noStylist' })),
            ]
              .sort((a, b) => new Date(a.schedules[0]?.startDate) - new Date(b.schedules[0]?.startDate)) // Sort by date
              .map((booking, index) => {
                const bookingDate = new Date(booking.schedules[0]?.startDate).toISOString().split('T')[0];
                return (
                  <Card
                    key={index}
                    sx={{
                      flex: '1 1 calc(33% - 10px)',
                      minWidth: '300px',
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      backgroundColor: booking.type === 'stylist' ? '#ffeb3b' : '#ff5722', // Màu theo type
                      cursor: booking.type === 'noStylist' ? 'pointer' : 'default', // Chỉ cho click nếu là noStylist
                    }}
                    onClick={() => booking.type === 'noStylist' && handleBookingClick(booking)}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3f51b5', marginBottom: 1 }}>
                        Booking ID: {booking.bookingId}
                      </Typography>
                      <Divider sx={{ marginBottom: 1 }} />
                      <Typography variant="body1">
                        <strong>Customer:</strong> {booking.userName}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Service:</strong> {booking.services.map((service) => service.serviceName).join(', ')}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Total Price:</strong> ${booking.totalPrice}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Start Time:</strong> {booking.schedules[0]?.startTime}
                      </Typography>
                      <Typography variant="body1">
                        <strong>End Time:</strong> {booking.schedules[0]?.endTime || 'Not Available'}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Date:</strong> {new Date(booking.schedules[0]?.startDate).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                );
              })}
          </Box>

          {/* Nút đóng modal */}
          <Button
            onClick={handleCloseModal}
            sx={{
              marginTop: 2,
              alignSelf: 'center',
              backgroundColor: '#3f51b5',
              color: 'white',
              padding: '10px 20px',
            }}
            variant="contained"
          >
            Close
          </Button>
        </Box>
      </Modal>
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)}>
        <DialogTitle>Confirm Assignment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you want to assign the selected stylist to Booking ID: {selectedBooking?.bookingId}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAssign} color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default UserListTable;
