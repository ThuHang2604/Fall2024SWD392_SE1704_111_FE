import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScheduleList from '@/components/TableList/ScheduleList/ScheduleList';
import { getCurrentStylistSchedules } from '@/redux/slice/scheUserSlice'; // Redux thunk
import { useDispatch, useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material';
import { getBookingsOfStylist } from '@/redux/slice/userBooking';
import ScheduleListTable from '@/components/TableList/ScheduleList/SchedueListTable';

function ScheduleListPage() {
  const dispatch = useDispatch();
  const bookingList = useSelector((state) => state.booking.bookings); // Dữ liệu lấy từ API
  const error = useSelector((state) => state.booking.error);
  const isLoading = useSelector((state) => state.booking.isLoading);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      dispatch(getBookingsOfStylist()).finally(() => setLoading(false));
    };

    fetchSchedules();
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ScheduleListTable
        bookingList={bookingList || []} // Pass bookingList to ScheduleListTable
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default ScheduleListPage;
