import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slice/authSlice';

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

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

  const FORM_VALIDATION = Yup.object().shape({
    userName: Yup.string().required('Username is required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
      .required('Phone number is required'),
    password: Yup.string().required('Password is required'),
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, 'Email must be a valid Gmail address ( abc@gmail.com)')
      .required('Email is required'),
    gender: Yup.string().oneOf(['0', '1'], 'Gender is required').required('Gender is required'),
    address: Yup.string().required('Address is required'),
    dateOfBirth: Yup.date()
      .required('Date of birth is required')
      .test('age', 'You must be at least 18 years old', function (value) {
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
          return age - 1 >= 18;
        }
        return age >= 18;
      }),
  });

  const handleSubmitRegister = async (values) => {
    console.log('Register Data:', values); // Add this line

    const resultAction = await dispatch(
      registerUser({
        ...values,
        gender: parseInt(values.gender, 10), // Convert gender to an integer
        userName: values.userName, // Sửa lại đúng tên trường 'userName'
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
          validationSchema={FORM_VALIDATION}
          onSubmit={handleSubmitRegister}
          validateOnChange={true}
          validateOnBlur={true}
        >
          {({ isSubmitting }) => (
            <Form>
              <Field name="userName">
                {({ field }) => <TextField fullWidth margin="normal" label="UserName" {...field} />}
              </Field>
              <ErrorMessage name="userName" component="div" className="text-danger" />

              <Field name="phone">
                {({ field }) => <TextField fullWidth margin="normal" label="Phone number" {...field} />}
              </Field>
              <ErrorMessage name="phone" component="div" className="text-danger" />

              <Field name="password">
                {({ field }) => <TextField fullWidth margin="normal" label="Password" type="password" {...field} />}
              </Field>
              <ErrorMessage name="password" component="div" className="text-danger" />

              <Field name="fullName">
                {({ field }) => <TextField fullWidth margin="normal" label="Full Name" {...field} />}
              </Field>
              <ErrorMessage name="fullName" component="div" className="text-danger" />

              <Field name="email">
                {({ field }) => <TextField fullWidth margin="normal" label="Email" {...field} />}
              </Field>
              <ErrorMessage name="email" component="div" className="text-danger" />

              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Field name="gender" as={Select} label="Gender">
                  <MenuItem value="0">Male</MenuItem>
                  <MenuItem value="1">Female</MenuItem>
                </Field>
                <ErrorMessage name="gender" component="div" className="text-danger" />
              </FormControl>

              <Field name="address">
                {({ field }) => <TextField fullWidth margin="normal" label="Address" {...field} />}
              </Field>
              <ErrorMessage name="address" component="div" className="text-danger" />

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
              <ErrorMessage name="dateOfBirth" component="div" className="text-danger" />

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
