import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress, Box } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserList from '@/components/TableList/UserList/UserList';
import { fetchUserList } from '@/redux/slice/userSlice';
import { getBookingsNoStylist } from '@/redux/slice/userBooking'; // Import the thunk for No Stylist bookings

const AssignSchedulePage = () => {
  const dispatch = useDispatch();

  // Correctly access state values
  const { users: userList, status, error } = useSelector((state) => state.users);
  const { bookingsNoStylist, isLoading: bookingsLoading, error: bookingsError } = useSelector((state) => state.booking);
  console.log('haha:', bookingsNoStylist);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([dispatch(fetchUserList()), dispatch(getBookingsNoStylist())]).finally(() => setLoading(false));
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (status === 'failed' && error) {
      toast.error(error); // Display user list error
    }
    if (bookingsError) {
      toast.error(bookingsError); // Display bookings error
    }
  }, [status, error, bookingsError]);

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading || status === 'loading' || bookingsLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ padding: 3 }}>
        <UserList
          userList={userList}
          error={status === 'failed' ? error : null}
          bookingsNoStylist={bookingsNoStylist}
        />{' '}
        {/* Pass user list and bookings */}
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AssignSchedulePage;
