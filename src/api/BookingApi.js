import axios from './axios';

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

const getBookingList = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`api/v1/booking?page=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { createBooking, getBookingList };
