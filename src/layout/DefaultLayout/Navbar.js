import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Button, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slice/authSlice';
import { Link as ScrollLink } from 'react-scroll'; // Import from react-scroll

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const role = user?.role;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  // State để quản lý menu dropdown của avatar
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#f26e3f', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="https://i.pinimg.com/564x/3d/ac/29/3dac291fd07904156ed2448c7c65dfe6.jpg"
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

          {/* Add Scroll Links for About, Process, and Contact */}
          <Button
            component={ScrollLink}
            to="about-section"
            smooth={true}
            duration={500}
            sx={{ color: 'black', fontSize: '16px', letterSpacing: '1.5px', fontWeight: 'bold', textTransform: 'none' }}
          >
            ABOUT
          </Button>
          <Button
            component={ScrollLink}
            to="process-section"
            smooth={true}
            duration={500}
            sx={{ color: 'black', fontSize: '16px', letterSpacing: '1.5px', fontWeight: 'bold', textTransform: 'none' }}
          >
            PROCESS
          </Button>
          <Button
            component={ScrollLink}
            to="contact-section"
            smooth={true}
            duration={500}
            sx={{ color: 'black', fontSize: '16px', letterSpacing: '1.5px', fontWeight: 'bold', textTransform: 'none' }}
          >
            CONTACT
          </Button>
          <Button
            component={Link}
            to="/service-page"
            sx={{ color: 'black', fontSize: '16px', letterSpacing: '1.5px', fontWeight: 'bold', textTransform: 'none' }}
          >
            SERVICES
          </Button>
          <Button
            onClick={handleLogout}
            sx={{ color: 'black', fontSize: '16px', letterSpacing: '1.5px', fontWeight: 'bold', textTransform: 'none' }}
          >
            Log out
          </Button>
        </Box>

        {/* User Account & Cart */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isAuthenticated ? (
            <>
              {/* Customer: Show Account & Cart */}
              {role === 'Customer' && (
                <>
                  <IconButton sx={{ color: 'black' }} onClick={handleClick}>
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

              {/* Avatar Menu */}
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem component={Link} to="/user" onClick={handleClose}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Log Out</MenuItem>
              </Menu>
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
