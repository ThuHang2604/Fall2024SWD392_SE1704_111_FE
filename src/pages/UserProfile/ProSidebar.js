import React from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slice/authSlice';
import { NavLink, useNavigate } from 'react-router-dom';

const ProfileSidebar = ({ user, previewImage, role }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        width: { xs: '100%', md: '30%' },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        maxWidth: '360px',
        minWidth: '360px',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Avatar
          src={previewImage || user?.imageLink || ''}
          alt={user?.fullName || 'Avatar'}
          sx={{
            width: 100,
            height: 100,
            backgroundColor: '#000',
            border: '3px solid black',
            borderRadius: '50%',
            mb: 2,
          }}
        >
          {!previewImage && !user?.imageLink && (user?.fullName?.charAt(0) || '')}
        </Avatar>

        <Typography variant="h6" mt={2}>
          {user?.fullName} ({role})
        </Typography>
      </Box>

      <Button variant="outlined" fullWidth sx={{ mt: 4 }} onClick={handleLogout}>
        Logout
      </Button>

      <Box sx={{ mt: 4 }}>
        <NavLink
          to="/profile"
          style={({ isActive }) => ({
            display: 'block',
            marginBottom: '16px',
            color: isActive ? 'red' : 'inherit',
            cursor: 'pointer',
            textDecoration: 'none',
          })}
        >
          My Account
        </NavLink>

        <NavLink
          to="/subscriptions"
          style={({ isActive }) => ({
            display: 'block',
            marginBottom: '16px',
            color: isActive ? 'red' : 'inherit',
            cursor: 'pointer',
            textDecoration: 'none',
          })}
        >
          My Subscriptions
        </NavLink>

        <NavLink
          to="/booking"
          style={({ isActive }) => ({
            display: 'block',
            marginBottom: '16px',
            color: isActive ? 'red' : 'inherit',
            cursor: 'pointer',
            textDecoration: 'none',
          })}
        >
          My Bookings
        </NavLink>
      </Box>
    </Box>
  );
};

export default ProfileSidebar;
