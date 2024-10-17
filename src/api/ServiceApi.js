import axios from './axios';

const getAllServices = async () => {
  try {
    const response = await axios.get(`api/v1/hairservice/list`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getServiceDetail = async (id) => {
  try {
    const response = await axios.get(`api/v1/hairservice/getServices/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getAllServices, getServiceDetail };
