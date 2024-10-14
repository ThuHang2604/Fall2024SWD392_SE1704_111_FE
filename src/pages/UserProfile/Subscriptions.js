import React, { useState } from 'react';
import { Box, Typography, Container } from '@mui/material';
import ProfileSidebar from './ProSidebar'; // Import the sidebar component
import { useSelector } from 'react-redux';
const SubscriptionPage = () => {
  const [selectedTab, setSelectedTab] = useState('subscriptions');
  const { user } = useSelector((state) => state.auth);

  //   const renderContent = () => {
  //     switch (selectedTab) {
  //       case 'bookings':
  //         return <Typography variant="h5">This is the bookings page.</Typography>;
  //       case 'subscriptions':
  //         return (
  //           <Container maxWidth={false} sx={{ maxWidth: '1400px' }}>
  //             <Box
  //               sx={{
  //                 border: '3px solid black',
  //                 borderRadius: 2,

  //                 width: '728px',
  //                 textAlign: 'center',
  //               }}
  //             >
  //               <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Monoton, Fantasy' }}>
  //                 SUBSCRIPTIONS
  //               </Typography>
  //               <Typography variant="body1" gutterBottom>
  //                 View and manage the subscriptions you've purchased.
  //               </Typography>

  //               <Box sx={{ mt: 4, borderTop: '1px solid black', paddingTop: 2 }}>
  //                 <Box sx={{ borderBottom: '1px solid black', mb: 2, pb: 2 }}>
  //                   <Typography variant="h6">Beginner</Typography>
  //                   <Typography variant="body2">Payments completed: 3 of 6</Typography>
  //                   <Typography variant="body2">Expires: Oct 14, 2024</Typography>
  //                 </Box>

  //                 <Box sx={{ borderBottom: '1px solid black', mb: 2, pb: 2 }}>
  //                   <Typography variant="h6">Pro</Typography>
  //                   <Typography variant="body2">Expires: Oct 14, 2024</Typography>
  //                 </Box>

  //                 <Box>
  //                   <Typography variant="h6">VIP</Typography>
  //                   <Typography variant="body2">Expired: Oct 14, 2024</Typography>
  //                 </Box>
  //               </Box>
  //             </Box>
  //           </Container>
  //         );
  //       case 'account':
  //         return <Typography variant="h5">This is the account page.</Typography>;
  //       default:
  //         return null;
  //     }
  //   };

  return (
    <Container maxWidth={false} sx={{ mt: 4, maxWidth: '1400px' }}>
      {/* Pass selectedTab and setSelectedTab to ProfileSidebar */}
      <Box
        sx={{
          display: 'flex',
          gap: '30px',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <ProfileSidebar setSelectedTab={setSelectedTab} user={user} />

        {/* Main Content */}
        <Box
          sx={{
            border: '3px solid black',
            borderRadius: 2,
            padding: 3,
            width: '728px',
            textAlign: 'left',
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ fontFamily: 'Monoton, Fantasy' }}>
            SUBSCRIPTIONS
          </Typography>
          <Typography variant="body1" gutterBottom>
            View and manage the subscriptions you've purchased.
          </Typography>

          <Box sx={{ mt: 4, borderTop: '1px solid black', paddingTop: 2 }}>
            <Box sx={{ borderBottom: '1px solid black', mb: 2, pb: 2 }}>
              <Typography variant="h6">Beginner</Typography>
              <Typography variant="body2">Payments completed: 3 of 6</Typography>
              <Typography variant="body2">Expires: Oct 14, 2024</Typography>
            </Box>

            <Box sx={{ borderBottom: '1px solid black', mb: 2, pb: 2 }}>
              <Typography variant="h6">Pro</Typography>
              <Typography variant="body2">Expires: Oct 14, 2024</Typography>
            </Box>

            <Box>
              <Typography variant="h6">VIP</Typography>
              <Typography variant="body2">Expired: Oct 14, 2024</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default SubscriptionPage;
