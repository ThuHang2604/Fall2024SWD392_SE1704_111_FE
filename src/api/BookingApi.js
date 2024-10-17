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

export { createBooking };
