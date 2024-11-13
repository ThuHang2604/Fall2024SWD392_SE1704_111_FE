import React, { useEffect } from 'react';
import { Box, Avatar, Typography, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slice/authSlice';
import { getUserProfileCurrent } from '@/redux/slice/userProfileSlice';

const ProfileSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, previewImage } = useSelector((state) => state.userProfile); // Access previewImage

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
          sx={{ width: 100, height: 100, mb: 2 }}
        >
          {!previewImage && user?.fullName?.charAt(0)}
        </Avatar>

        <Typography variant="h6" mt={2}>
          {user?.fullName || 'User'} ({user?.role || 'Guest'})
        </Typography>
      </Box>

      <div>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 4 }}
          onClick={handleLogout}
          style={{ width: '100px', justifyItems: 'center' }}
        >
          Logout
        </Button>
      </div>

      <Box sx={{ mt: 4 }}>
        <NavLink
          to="/user/profile"
          style={({ isActive }) => ({
            display: 'block',
            marginBottom: '16px',
            color: isActive ? 'red' : 'inherit',
            textDecoration: 'none',
          })}
        >
          My Account
        </NavLink>
        <NavLink
          to="/user/subscriptions"
          style={({ isActive }) => ({
            display: 'block',
            marginBottom: '16px',
            color: isActive ? 'red' : 'inherit',
            textDecoration: 'none',
          })}
        >
          My Subscriptions
        </NavLink>
        <NavLink
          to="/user/booking"
          style={({ isActive }) => ({
            display: 'block',
            marginBottom: '16px',
            color: isActive ? 'red' : 'inherit',
            textDecoration: 'none',
          })}
        >
          My Bookings
        </NavLink>
        <NavLink
          to="/user/feedback"
          style={({ isActive }) => ({
            display: 'block',
            marginBottom: '16px',
            color: isActive ? 'red' : 'inherit',
            textDecoration: 'none',
          })}
        >
          Feed back
        </NavLink>
      </Box>
    </Box>
  );
};

export default ProfileSidebar;
