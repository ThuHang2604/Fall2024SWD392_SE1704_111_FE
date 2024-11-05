import axios from './axios';

const forgetPass = async (userData) => {
  try {
    const response = await axios.post('api/v1/users/resetPassword', userData, {
      headers: {
        'Content-Type': 'application/json-patch+json',
      },
    });
    return response.data;
  } catch (error) {
    // Kiểm tra nếu lỗi là 404 và không ghi log stack trace
    if (error.response && error.response.status === 404) {
      return {
        status: -1,
        message: 'User not found.',
      };
    }
    // Ghi log các lỗi khác
    console.error('Error creating report:', error);
    throw error;
  }
};

export { forgetPass };
