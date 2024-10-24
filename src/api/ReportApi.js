import axios from './axios';

// Hàm lấy danh sách tất cả báo cáo
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

// Hàm tạo báo cáo mới
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

// Hàm cập nhật báo cáo theo reportId
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
