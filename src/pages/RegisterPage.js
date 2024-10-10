import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slice/authSlice';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const INITIAL_FORM_STATE = {
    username: '',
    phone: '',
    password: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    phone: Yup.string().required('Phone number is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmitRegister = async (values) => {
    const resultAction = await dispatch(
      registerUser({
        username: values.username,
        phone: values.phone,
        password: values.password,
      }),
    );

    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Your account has been successfully registered. Please log in to continue.');
      navigate('/login');
    } else {
      if (resultAction.payload) {
        toast.error(resultAction.payload);
      } else {
        toast.error('Account registration failed. Please check your information and try again.');
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
          Sign Up Now
        </Typography>

        <Formik
          initialValues={INITIAL_FORM_STATE}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleSubmitRegister}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="username">
                {({ field }) => <TextField fullWidth margin="normal" label="Username" {...field} />}
              </Field>
              <ErrorMessage name="username" component="div" className="text-danger" />

              <Field name="phone">
                {({ field }) => <TextField fullWidth margin="normal" label="Phone number" {...field} />}
              </Field>
              <ErrorMessage name="phone" component="div" className="text-danger" />

              <Field name="password">
                {({ field }) => <TextField fullWidth margin="normal" label="Password" type="password" {...field} />}
              </Field>
              <ErrorMessage name="password" component="div" className="text-danger" />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={isLoading || isSubmitting}
                sx={{ mt: 3 }}
              >
                {isLoading ? 'Loading...' : 'Sign Up'}
              </Button>

              <ToastContainer position="top-right" autoClose={3000} />
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}

export default RegisterPage;
