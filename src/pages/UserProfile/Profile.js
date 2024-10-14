import React from 'react';
import { Box, Container, Typography, TextField, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import ProfileSidebar from './ProSidebar';
import Footer from '../home/Footer';

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Container maxWidth={false} sx={{ mt: 4, maxWidth: '1400px' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '30px',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        {/* Sidebar */}
        <ProfileSidebar user={user} />

        {/* Main Content */}
        <Box
          sx={{
            border: '3px solid black',
            borderRadius: 2,
            padding: 3,
            width: { xs: '100%', md: '70%' },
            textAlign: 'left',
          }}
        >
          {/* Account Title */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#f26e3f',
              fontFamily: 'Monoton, Fantasy',
            }}
          >
            ACCOUNT
          </Typography>
          <Typography variant="body2" mb={2}>
            View and edit your personal info below.
          </Typography>

          {/* Personal Info Section */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            PERSONAL INFO
          </Typography>
          <Typography variant="body2" mb={2}>
            Update your personal information.
          </Typography>

          <Box sx={{ display: 'flex', gap: '20px', flexDirection: { xs: 'column', sm: 'row' }, mb: 2 }}>
            <TextField fullWidth label="First name" defaultValue={user?.firstName || ''} />
            <TextField fullWidth label="Last name" defaultValue={user?.lastName || ''} />
          </Box>
          <TextField fullWidth label="Phone" defaultValue={user?.phone || ''} sx={{ mt: 2 }} />

          {/* Personal Info Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" sx={{ color: '#f26e3f', borderColor: '#f26e3f' }}>
              Discard
            </Button>
            <Button variant="contained" sx={{ backgroundColor: '#000', color: '#fff' }}>
              Update Info
            </Button>
          </Box>

          {/* Login Info Section */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 4 }}>
            LOGIN INFO
          </Typography>
          <Typography variant="body2" mb={2}>
            View and update your login email and password.
          </Typography>

          <Typography variant="body1" mt={2}>
            Login email: {user?.email}
          </Typography>

          <Typography variant="body1" mt={2}>
            Password: ••••••••
          </Typography>

          {/* Login Info Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" sx={{ color: '#f26e3f', borderColor: '#f26e3f' }}>
              Discard
            </Button>
            <Button variant="contained" sx={{ backgroundColor: '#000', color: '#fff' }}>
              Update Info
            </Button>
          </Box>
        </Box>
      </Box>
      {/* <Footer /> */}
    </Container>
  );
};

export default ProfilePage;
