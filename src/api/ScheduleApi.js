import axios from './axios';

const getScheduleList = async () => {
  try {
    const response = await axios.get('api/v1/schedule/scheduleList');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getScheduleList };
