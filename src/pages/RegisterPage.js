import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Typography,
  TextField,
  Container,
  Box,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slice/authSlice';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const INITIAL_FORM_STATE = {
    userName: '',
    phone: '',
    password: '',
    fullName: '',
    email: '',
    gender: '',
    address: '',
    dateOfBirth: '',
  };

  const handleSubmitRegister = async (values) => {
    // Custom validation logic with toasts
    if (!values.userName) {
      toast.error('Username is required');
      return;
    }
    if (!values.phone || !/^\d{10}$/.test(values.phone)) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }
    if (!values.password) {
      toast.error('Password is required');
      return;
    }
    if (!values.fullName) {
      toast.error('Full Name is required');
      return;
    }
    if (!values.email || !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(values.email)) {
      toast.error('Email must be a valid Gmail address');
      return;
    }
    if (!values.gender || !['0', '1'].includes(values.gender)) {
      toast.error('Gender is required');
      return;
    }
    if (!values.address) {
      toast.error('Address is required');
      return;
    }
    if (!values.dateOfBirth) {
      toast.error('Date of birth is required');
      return;
    }

    const today = new Date();
    const birthDate = new Date(values.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();
    const adjustedAge = monthDifference < 0 || (monthDifference === 0 && dayDifference < 0) ? age - 1 : age;

    if (adjustedAge < 18) {
      toast.error('You must be at least 18 years old');
      return;
    } else if (adjustedAge > 100) {
      toast.error('Age must be less than or equal to 100 years');
      return;
    }

    // Dispatch registration action
    try {
      const resultAction = await dispatch(
        registerUser({
          ...values,
          gender: parseInt(values.gender, 10),
        }),
      );

      if (registerUser.fulfilled.match(resultAction)) {
        const { status, message } = resultAction.payload;
        if (status === 1) {
          toast.success(message, {
            autoClose: 2000, // 2 seconds
            onClose: () => setTimeout(() => navigate('/login'), 2000),
          });
        } else {
          toast.error(message || 'Account registration failed. Please try again.');
        }
      } else {
        toast.error(
          resultAction.payload || 'Account registration failed. Please check your information and try again.',
        );
      }
    } catch (error) {
      toast.error('An unexpected error occurred. Please try again later.');
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
          padding: 5,
          borderRadius: 2,
          boxShadow: 3,
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <Typography variant="h4" mb={5} fontWeight="bold" align="center">
          Sign Up Now
        </Typography>

        <Formik
          initialValues={INITIAL_FORM_STATE}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmitRegister(values);
            setSubmitting(false);
          }}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="userName">
                {({ field }) => <TextField fullWidth margin="normal" label="Username" {...field} />}
              </Field>

              <Field name="phone">
                {({ field }) => <TextField fullWidth margin="normal" label="Phone number" {...field} />}
              </Field>

              <Field name="password">
                {({ field }) => <TextField fullWidth margin="normal" label="Password" type="password" {...field} />}
              </Field>

              <Field name="fullName">
                {({ field }) => <TextField fullWidth margin="normal" label="Full Name" {...field} />}
              </Field>

              <Field name="email">
                {({ field }) => <TextField fullWidth margin="normal" label="Email" {...field} />}
              </Field>

              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Field name="gender" as={Select} label="Gender">
                  <MenuItem value="0">Male</MenuItem>
                  <MenuItem value="1">Female</MenuItem>
                </Field>
              </FormControl>

              <Field name="address">
                {({ field }) => <TextField fullWidth margin="normal" label="Address" {...field} />}
              </Field>

              <Field name="dateOfBirth">
                {({ field }) => (
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Date of Birth"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    {...field}
                  />
                )}
              </Field>

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
