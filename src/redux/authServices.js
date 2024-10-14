import instance from './axiosCustom';

export const setUserAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete instance.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}
export default truncateText;
