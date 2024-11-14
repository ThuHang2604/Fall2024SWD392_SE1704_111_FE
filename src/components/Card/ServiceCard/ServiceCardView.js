import React from 'react';
import { Box, Typography } from '@mui/material';
import ServiceCard from './ServiceCard';
import W2 from '@/pages/home/img/woman7.png';
import W3 from '@/pages/home/img/woman6.png';
import W4 from '@/pages/home/img/woman8.png';

function ServiceCardView({ serviceCard, error }) {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#FFF3E0',
        height: '100%',
      }}
    >
      {/* Left side image (woman7) */}
      <Box
        component="img"
        src={W2}
        alt="Left Decoration"
        sx={{
          position: 'absolute',
          left: '0px',
          top: '100px',
          width: '300px',
          height: 'auto',
          display: { xs: 'none', md: 'block' },
        }}
      />

      {/* Main Content */}
      <Box sx={{ maxWidth: '1200px', width: '100%', padding: '0 50px', zIndex: 2 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            marginBottom: '20px',
            marginTop: '15px',
            fontFamily: 'fantasy',
          }}
        >
          Our Services
        </Typography>

        {error ? (
          <Box sx={{ textAlign: 'center', color: 'red', marginBottom: '10px' }}>
            <Typography variant="body1">{error.message || 'An error occurred'}</Typography>
          </Box>
        ) : (
          <ServiceCard serviceCard={serviceCard} />
        )}
      </Box>

      {/* Right side image */}
      <Box
        component="img"
        src={W3}
        alt="Right Decoration"
        sx={{
          position: 'absolute',
          right: '0px',
          top: '200px',
          width: '400px',
          height: 'auto',
          display: { xs: 'none', md: 'block' },
        }}
      />

      {/* Lower image (woman8) positioned beneath cards */}
      <Box
        component="img"
        src={W4}
        alt="Bottom Decoration"
        sx={{
          position: 'absolute',
          left: '100px',
          top: '450px', // Adjust this value to control vertical positioning
          width: '400px',
          height: 'auto',
          zIndex: 1, // Lower than the main content
          display: { xs: 'none', md: 'block' },
        }}
      />
    </Box>
  );
}

export default ServiceCardView;
