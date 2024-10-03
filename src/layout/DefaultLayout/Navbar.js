import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { logoutUser as logoutAction } from '../../redux/slice/authSlice';
import useAuth from '@/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';

const Navbar = () => {
  const { auth, login, logout: handleAuthLogout } = useAuth();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
    handleAuthLogout();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#f26e3f', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://i.pinimg.com/564x/41/ca/ef/41caefab07c2d9dc624d449d11faa458.jpg"
            alt="Logo"
            style={{ width: '50px', height: '50px' }}
          />
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: '20px' }}>
          <Button
            component={Link}
            to="/"
            sx={{ color: 'black', fontSize: '16px', letterSpacing: '1.5px', fontWeight: 'bold', textTransform: 'none' }}
          >
            HOME
          </Button>
          <Button
            component={Link}
            to="/service-page"
            sx={{ color: 'black', fontSize: '16px', letterSpacing: '1.5px', fontWeight: 'bold', textTransform: 'none' }}
          >
            SERVICES
          </Button>
        </Box>

        {/* User Account & Cart */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isAuthenticated ? (
            <>
              <IconButton sx={{ color: 'black' }}>
                <AccountCircleIcon />
              </IconButton>
              <IconButton sx={{ color: 'black', position: 'relative' }}>
                <ShoppingBagIcon />
                <Box
                  sx={{
                    position: 'absolute',
                    top: -5,
                    right: -5,
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '12px',
                  }}
                >
                  0
                </Box>
              </IconButton>
              <Button
                onClick={handleLogout}
                sx={{
                  color: 'black',
                  fontSize: '16px',
                  letterSpacing: '1.5px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
              >
                Log Out
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                color: 'black',
                fontSize: '16px',
                letterSpacing: '1.5px',
                fontWeight: 'bold',
                textTransform: 'none',
              }}
            >
              Log In
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
