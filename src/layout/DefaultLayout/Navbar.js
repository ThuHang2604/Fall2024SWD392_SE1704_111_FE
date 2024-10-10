import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slice/authSlice';
import useRole from '../../hooks/useRole';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const role = user?.role;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
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
              {/* Admin, Staff, Stylist, Manager: Show Dashboard */}
              {(role === 5 || role === 4 || role === 3 || role === 2) && <></>}

              {/* Customer: Show Account & Cart */}
              {role === 1 && (
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
                </>
              )}

              {/* Log Out Button for All Roles */}
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
            <div>
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
              <Button
                component={Link}
                to="/register"
                sx={{
                  color: 'black',
                  fontSize: '16px',
                  letterSpacing: '1.5px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
