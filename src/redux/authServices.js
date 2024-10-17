import instance from './axiosCustom';
import Cookies from 'js-cookie';
export const setUserAuthToken = (token) => {
  if (token) {
    Cookies.set('authToken', token, { expires: 1 }); // Lưu token vào Cookies với thời gian hết hạn
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    Cookies.remove('authToken'); // Xóa token nếu không hợp lệ
    delete instance.defaults.headers.common['Authorization'];
  }
};

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}
export default truncateText;
