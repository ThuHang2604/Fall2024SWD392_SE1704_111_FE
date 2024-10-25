import axios from './axios';

const getAllReport = async () => {
  try {
    const response = await axios.get('api/v1/reports/reportList', {
      headers: {
        accept: '*/*',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const createReport = async (reportData) => {
  try {
    const response = await axios.post('api/v1/reports/createReport', reportData, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json-patch+json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateReport = async (reportId, reportData) => {
  try {
    const response = await axios.post(`api/v1/reports/updateReport/${reportId}`, reportData, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json-patch+json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Hàm thay đổi trạng thái báo cáo
const removeReport = async (reportId, status) => {
  try {
    const response = await axios.post(
      `api/v1/reports/changeReportStatus/${reportId}`,
      { status },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json-patch+json',
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { getAllReport, createReport, updateReport, removeReport };
