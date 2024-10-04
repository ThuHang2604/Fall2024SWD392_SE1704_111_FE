import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../redux/slice/authSlice';

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isAuthenticated, error, user } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmitLogin = async (values) => {
    dispatch(loginUser(values));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      const role = user.role;

      if (role === 1) {
        navigate('/', { replace: true });
      } else if (role >= 2 && role <= 5) {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3}>
        <Typography variant="h4" mb={5} fontWeight="bold">
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
            {({ values, handleChange, isSubmitting }) => (
              <Form>
                <Field name="username">
                  {({ field }) => (
                    <TextField fullWidth margin="normal" label="Username" variant="outlined" {...field} />
                  )}
                </Field>
                <ErrorMessage name="username" component="div" className="text-danger" />

                <Field name="password">
                  {({ field }) => (
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Password"
                      variant="outlined"
                      type={showPassword ? 'text' : 'password'}
                      {...field}
                    />
                  )}
                </Field>
                <ErrorMessage name="password" component="div" className="text-danger" />

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
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
        ) : null}{' '}
        {/* No logout or welcome message */}
      </Box>
    </Container>
  );
}

export default LoginPage;
