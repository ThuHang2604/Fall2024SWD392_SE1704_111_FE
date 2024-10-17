import axios from './axios';

const getStylistByServiceID = async (serviceId) => {
  try {
    const response = await axios.get(`api/v1/servicesStylist/getStylistsByServiceIdAsync/${serviceId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getStylistByServiceID };
