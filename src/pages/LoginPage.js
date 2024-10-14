import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import { loginUser } from '../redux/slice/authSlice';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const { isLoading, isAuthenticated, error, token } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null); // State để lưu trữ JWT đã decode

  const INITIAL_FORM_STATE = {
    username: '',
    password: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleClick = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmitLogin = (values) => {
    dispatch(loginUser(values));
  };

  // Decode token và lưu trữ thông tin sau khi đăng nhập thành công
  useEffect(() => {
    if (isAuthenticated && token) {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded); // Lưu trữ token đã decode

      // Điều hướng tới trang khác sau khi đăng nhập thành công dựa trên vai trò
      if (decoded.role === 'Customer') {
        navigate('/', { replace: true });
      } else if (decoded.role === 'Staff' || decoded.role === 'Stylist') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, token, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F26E3F',
          padding: 0,
        }}
      >
        <Card
          sx={{
            padding: '3rem',
            maxWidth: '500px',
            width: '100%',
            background: 'white',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent>
            <Typography variant="h4" mb={5} fontWeight="bold" align="center">
              Log In
            </Typography>

            {!isAuthenticated ? (
              <Formik
                initialValues={INITIAL_FORM_STATE}
                validationSchema={FORM_VALIDATION}
                onSubmit={handleSubmitLogin}
                validateOnChange={true}
                validateOnBlur={true}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Field name="username">
                      {({ field }) => <TextField fullWidth margin="normal" label="Username" {...field} />}
                    </Field>
                    <ErrorMessage name="username" component="div" className="text-danger" />

                    <Field name="password">
                      {({ field }) => (
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Password"
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                        />
                      )}
                    </Field>
                    <ErrorMessage name="password" component="div" className="text-danger" />

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Link to="/forgot-password">Forgot password?</Link>
                      <Typography onClick={handleClick} sx={{ cursor: 'pointer' }} color="primary">
                        {showPassword ? 'Hide Password' : 'Show Password'}
                      </Typography>
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={isLoading || isSubmitting}
                      sx={{ mt: 3 }}
                    >
                      {isLoading ? 'Loading...' : 'Log In'}
                    </Button>

                    <Box textAlign="center" mt={3}>
                      <Typography>
                        Not a member? <Link to="/register">Sign Up</Link>
                      </Typography>
                    </Box>

                    <ToastContainer position="top-right" autoClose={3000} />
                  </Form>
                )}
              </Formik>
            ) : null}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default LoginPage;
