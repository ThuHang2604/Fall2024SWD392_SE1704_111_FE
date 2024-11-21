import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { createTheme } from '@mui/material/styles';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReportIcon from '@mui/icons-material/Report';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/slice/authSlice';
import { getUserProfileCurrent } from '@/redux/slice/userProfileSlice';

const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
    onClick: (navigate) => navigate('/dashboard'),
  },
  {
    segment: 'booking-list',
    title: 'Booking List',
    icon: <BookOnlineIcon />,
    onClick: (navigate) => navigate('/booking-list'),
  },
  {
    segment: 'report-list',
    title: 'Report List',
    icon: <ReportIcon />,
    onClick: (navigate) => navigate('/report-list'),
  },
  {
    segment: 'service-list',
    title: 'Service List',
    icon: <DesignServicesIcon />,
    onClick: (navigate) => navigate('/service-list'),
  },
  {
    segment: 'schedule-list',
    title: 'Schedule List',
    icon: <ScheduleIcon />,
    onClick: (navigate) => navigate('/schedule-list'),
  },
  {
    segment: 'assign-list',
    title: 'Schedule No Stylist  List',
    icon: <AssignmentLateIcon />,
    onClick: (navigate) => navigate('/assign-list'),
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ children }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {children}
    </Box>
  );
}

DemoPageContent.propTypes = {
  children: PropTypes.node.isRequired,
};

function DashboardLayoutAccount(props) {
  const { window, children } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const profile = useSelector((state) => state.userProfile.user);

  const role = user?.role; // Get the role of the logged-in user
  // console.log('rolse:', role);
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserProfileCurrent());
    }
  }, [dispatch, isAuthenticated]);

  const router = React.useMemo(() => {
    return {
      navigate,
    };
  }, [navigate]);

  const filteredNavigation = React.useMemo(() => {
    if (role === 'Manager') {
      return NAVIGATION.filter(
        (item) => item.segment === 'dashboard' || item.segment === 'assign-list' || item.segment === 'service-list',
      );
    } else if (role === 'Stylist') {
      return NAVIGATION.filter((item) =>
        ['booking-list', 'report-list', 'service-list', 'schedule-list'].includes(item.segment),
      );
    }
    return []; // Default empty navigation for unknown roles
  }, [role]);

  return (
    <AppProvider
      session={{
        user: {
          name: profile?.fullName || 'Default Name',
          email: profile?.email || 'defaultemail@example.com',
          image: <AccountCircleIcon />,
        },
      }}
      authentication={{
        signOut: handleLogout,
      }}
      navigation={filteredNavigation.map((item) => ({
        ...item,
        onClick: () => item.onClick(navigate),
      }))}
      branding={{
        logo: <img src="https://i.pinimg.com/564x/3d/ac/29/3dac291fd07904156ed2448c7c65dfe6.jpg" alt="Logo" />,
        title: 'Hair Salon System',
      }}
      router={router}
      theme={demoTheme}
      window={window}
    >
      <DashboardLayout>
        <DemoPageContent>{children}</DemoPageContent>
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutAccount.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default DashboardLayoutAccount;
