import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Backdrop,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { loginUser } from '../redux/slice/authSlice';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, error, token } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);

  const INITIAL_FORM_STATE = {
    username: '',
    password: '',
  };

  const handleClick = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmitLogin = async (values, { setSubmitting }) => {
    const { username, password } = values;

    // Validate fields manually
    if (!username) {
      toast.error('Username is required');
      setSubmitting(false);
      return;
    }

    if (!password) {
      toast.error('Password is required');
      setSubmitting(false);
      return;
    }

    setLoadingDelay(true); // Start loading indicator with delay
    const result = await dispatch(loginUser(values));
    setSubmitting(false);
    setLoadingDelay(false); // Stop the delayed loading indicator

    // If login fails, show a toast notification
    if (result.error) {
      toast.error('Login failed. Please check your username and password.');
    }
  };

  // Additional loading state with delay for a minimum of 1 second
  const [loadingDelay, setLoadingDelay] = useState(false);
  useEffect(() => {
    if (loadingDelay) {
      const timer = setTimeout(() => {
        setLoadingDelay(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loadingDelay]);

  useEffect(() => {
    if (isAuthenticated && token) {
      const decoded = jwtDecode(token);
      setDecodedToken(decoded);

      if (decoded.role === 'Customer') {
        navigate('/', { replace: true });
      }
      if (decoded.role === 'Manager') {
        navigate('/dashboard');
      } else if (decoded.role === 'Stylist') {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, token, navigate]);

  return (
    <Container maxWidth={false} disableGutters>
      {/* Loading Backdrop */}
      <Backdrop open={loadingDelay} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>

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
                onSubmit={handleSubmitLogin}
                validateOnChange={true}
                validateOnBlur={true}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <Field name="username">
                      {({ field }) => <TextField fullWidth margin="normal" label="Username" {...field} />}
                    </Field>

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
                  </Form>
                )}
              </Formik>
            ) : null}
          </CardContent>
        </Card>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}

export default LoginPage;
