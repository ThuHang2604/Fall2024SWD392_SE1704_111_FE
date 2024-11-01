import axios from './axios';
import Cookies from 'js-cookie';

const createBooking = async (bookingData) => {
  try {
    const response = await axios.post('api/v1/booking/createBooking', bookingData, {
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBookingList = async () => {
  try {
    const response = await axios.get(`api/v1/booking/bookingList`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const checkIn = async (bookingId, status) => {
  try {
    const token = Cookies.get('authToken');
    console.log('token', token);

    const response = await axios.post(
      `api/v1/booking/changeBookingStatus/${bookingId}`,
      { status },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json-patch+json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { createBooking, getBookingList, checkIn };
