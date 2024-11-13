import axios from './axios';

const forgetPass = async (userData) => {
  try {
    const response = await axios.post('api/v1/users/resetPassword', userData, {
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    });
    return { status: 1, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { status: -1, message: 'User not found.' };
    }
    return {
      status: 0,
      message: error.response?.data?.message || 'An unexpected error occurred',
    };
  }
};

export { forgetPass };
