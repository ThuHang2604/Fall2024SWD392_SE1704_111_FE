import axios from './axios';

const getAllServices = async (pageNumber = 1, pageSize = 10) => {
  try {
    const response = await axios.get(`api/v1/hairservice/list`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getAllServices };
