import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { loginUser } from '../redux/slice/authSlice';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const INITIAL_FORM_STATE = {
    username: '',
    password: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmitLogin = async (values) => {
    const resultAction = await dispatch(
      loginUser({
        username: values.username,
        password: values.password,
      }),
    );

    if (loginUser.fulfilled.match(resultAction)) {
      toast.success('Logged in successfully');
      navigate('/');
    } else {
      if (resultAction.payload) {
        toast.error(resultAction.payload);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        backgroundColor: '#F26E3F',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 5, // Increase padding for larger form
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: '600px', // Increase maxWidth for larger form
        }}
      >
        <Typography variant="h4" mb={5} fontWeight="bold" align="center">
          Log In
        </Typography>

        <Formik initialValues={INITIAL_FORM_STATE} validationSchema={FORM_VALIDATION} onSubmit={handleSubmitLogin}>
          {({ isSubmitting }) => (
            <Form>
              <Field name="username">
                {({ field }) => <TextField fullWidth margin="normal" label="Username" {...field} />}
              </Field>
              <ErrorMessage name="username" component="div" className="text-danger" />

              <Field name="password">
                {({ field }) => <TextField fullWidth margin="normal" label="Password" type="password" {...field} />}
              </Field>
              <ErrorMessage name="password" component="div" className="text-danger" />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography
                  variant="body2"
                  component="a"
                  href="#"
                  sx={{ textDecoration: 'none', color: 'primary.main' }}
                >
                  Forgot password?
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

              <Box textAlign="center" mt={2}>
                <Typography variant="body2">
                  Not a member?{' '}
                  <Typography
                    variant="body2"
                    component="a"
                    href="/register"
                    sx={{ textDecoration: 'none', color: 'primary.main' }}
                  >
                    Sign Up
                  </Typography>
                </Typography>
              </Box>

              <ToastContainer position="top-right" autoClose={3000} />
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default LoginPage;
