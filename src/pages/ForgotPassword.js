import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container, TextField, Button, Typography, Box, Card, CardContent } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { forgetPass } from '@/api/UserApi';

function ForgetPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, error, forgetPassSuccess } = useSelector((state) => state.auth);

  const INITIAL_FORM_STATE = {
    userName: '',
    password: '',
  };

  const FORM_VALIDATION = Yup.object().shape({
    userName: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmitforgetPass = async (values, { setSubmitting }) => {
    await dispatch(forgetPass(values)); // Chờ đợi yêu cầu hoàn tất
    setSubmitting(false); // Đặt lại trạng thái isSubmitting về false
  };

  useEffect(() => {
    if (forgetPassSuccess) {
      toast.success('Password reset successful');
      navigate('/login');
    } else if (error) {
      if (error.response && error.response.status === 404) {
        toast.error('User not found. Please check your email and try again.');
      } else {
        toast.error(`Password reset failed: ${error.message || 'An unexpected error occurred'}`);
      }
    }
  }, [forgetPassSuccess, error, navigate]);

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
              Forgot Password
            </Typography>

            <Formik
              initialValues={INITIAL_FORM_STATE}
              validationSchema={FORM_VALIDATION}
              onSubmit={handleSubmitforgetPass}
              validateOnChange={true}
              validateOnBlur={true}
            >
              {({ isSubmitting, setFieldTouched }) => (
                <Form>
                  <Field name="userName">
                    {({ field }) => (
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setFieldTouched('userName');
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="userName" component="div" className="text-danger" />

                  <Field name="password">
                    {({ field }) => (
                      <TextField
                        fullWidth
                        margin="normal"
                        type="password"
                        label="New Password"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setFieldTouched('password');
                        }}
                      />
                    )}
                  </Field>
                  <ErrorMessage name="password" component="div" className="text-danger" />

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isLoading || isSubmitting} // Chỉ vô hiệu hóa khi đang gửi yêu cầu
                    sx={{ mt: 3 }}
                  >
                    {isLoading ? 'Loading...' : 'Reset Password'}
                  </Button>

                  <Box textAlign="center" mt={3}>
                    <Typography>
                      Remembered your password? <Link to="/login">Log In</Link>
                    </Typography>
                  </Box>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Box>
      <ToastContainer position="top-right" autoClose={3000} />
    </Container>
  );
}

export default ForgetPassword;
