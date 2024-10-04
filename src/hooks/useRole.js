export default function useRole() {
  const auth = JSON.parse(sessionStorage.getItem('auth')) || '';
  return auth.role || '';
}
