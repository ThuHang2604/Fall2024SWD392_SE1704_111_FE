import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import ProfileSidebar from '@/pages/UserProfile/ProSidebar'; // Import sidebar
import Navbar from '../DefaultLayout/Navbar';
import Footer from '@/pages/home/Footer';

const ProfileLayout = () => {
  return (
    <>
      {/* Navbar */}
      <Navbar />

      <Container maxWidth={false} sx={{ mt: 4, maxWidth: '1400px' }}>
        <Box
          sx={{
            display: 'flex',
            gap: '30px',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Sidebar */}
          <ProfileSidebar />

          {/* Main content area */}
          <Box
            sx={{
              border: '3px solid black',
              borderRadius: 2,
              padding: 3,
              width: '728px',
              textAlign: 'left',
              flexGrow: 1,
              // backgroundColor: '#f26e3f',
            }}
          >
            <Outlet /> {/* Render the selected route content */}
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      {/* <Footer /> */}
    </>
  );
};

export default ProfileLayout;
