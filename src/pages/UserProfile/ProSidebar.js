import React, { useState } from 'react';
import { Box, Avatar, Typography, IconButton, Menu, MenuItem, Button } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slice/authSlice';
import { useNavigate } from 'react-router-dom';

const ProfileSidebar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <Box
      sx={{
        border: '3px solid black',
        borderRadius: 2,
        padding: 3,
        textAlign: 'center',
        position: 'relative',
        width: { xs: '100%', md: '30%' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{}}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              backgroundColor: '#000',
              border: '3px solid black',
              borderRadius: '50%',
            }}
          />
          <Typography variant="h6" mt={2}>
            {user?.firstName} {user?.lastName} ({user?.role})
          </Typography>
        </Box>

        {/* Side Menu */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="body1" sx={{ mb: 2, cursor: 'pointer' }}>
            My Bookings
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, cursor: 'pointer' }}>
            My Subscriptions
          </Typography>
          <Typography variant="body1" sx={{ color: 'red', cursor: 'pointer' }}>
            My Account
          </Typography>
        </Box>
      </Box>

      {/* Logout Button placed at the bottom */}
      <Button variant="outlined" fullWidth sx={{ mt: 4 }} onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default ProfileSidebar;
