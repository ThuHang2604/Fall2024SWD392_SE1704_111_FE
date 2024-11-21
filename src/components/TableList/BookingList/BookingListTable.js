import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
  TablePagination,
  Chip,
  Box,
  Avatar,
  TableSortLabel,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import ConfirmUpdateDialog from '@/components/Modal/DialogConfirm/ConfirmUpdate';
import CreateReportModal from '@/components/Modal/ReportModal/CreateReport';
import { tableCellClasses } from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.common.white,
    fontSize: 18,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 16,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const statusMapping = {
  0: 'None',
  1: 'InQueue',
  2: 'Accepted',
  3: 'InProgress',
  4: 'Delay',
  5: 'Complete',
  6: 'Cancel',
};

const getChipColor = (status) => {
  switch (status) {
    case 1:
      return 'primary';
    case 2:
      return 'info';
    case 3:
      return 'warning';
    case 4:
      return 'error';
    case 5:
      return 'success';
    case 6:
      return 'default';
    default:
      return 'secondary';
  }
};

function BookingListTable({ bookingList = [], fetchBookings }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('bookingId');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [searchServiceName, setSearchServiceName] = useState('');
  const [searchCreatedBy, setSearchCreatedBy] = useState('');
  const [loading, setLoading] = useState(false);
  console.log('bookingList:', bookingList);
  useEffect(() => {
    // Delay the filtering when search terms change
    const delayDebounceFn = setTimeout(() => {
      setLoading(false); // Stop loading after the delay
    }, 500); // 500ms delay

    setLoading(true); // Start loading when search terms change

    return () => clearTimeout(delayDebounceFn); // Cleanup the timeout on unmount
  }, [searchServiceName, searchCreatedBy]);

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const filteredBookings = bookingList
    .filter((booking) => booking.services?.serviceName?.toLowerCase().includes(searchServiceName.toLowerCase()))
    .filter((booking) => booking.createBy?.toLowerCase().includes(searchCreatedBy.toLowerCase()));

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (orderBy === 'bookingId') {
      return order === 'asc' ? a.bookingId - b.bookingId : b.bookingId - a.bookingId;
    } else if (orderBy === 'status') {
      return order === 'asc' ? a.status - b.status : b.status - a.status;
    }
    return 0;
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (bookingId) => {
    setSelectedBookingId(bookingId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBookingId(null);
  };

  const handleCheckIn = async () => {
    toast.success('Check-in booking successfully!');
    handleCloseDialog();
    fetchBookings();
  };

  const handleOpenReportModal = (bookingId) => {
    setSelectedBookingId(bookingId);
    setOpenReportModal(true);
  };

  const handleCloseReportModal = () => {
    setOpenReportModal(false);
    setSelectedBookingId(null);
  };

  const handleSuccessCreateReport = () => {
    setOpenReportModal(false);
    fetchBookings();
  };

  const handleErrorCreateReport = (errorMessage) => {
    toast.error(errorMessage);
  };

  return (
    <Box sx={{ padding: 2 }}>
      {/* Search Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, border: '2px solid #ccc', borderRadius: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: '700' }}>
            Service Name
          </Typography>
          <TextField
            label="Search by Service Name"
            variant="outlined"
            value={searchServiceName}
            onChange={(e) => setSearchServiceName(e.target.value)}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: '700' }}>
            Created By
          </Typography>
          <TextField
            label="Search by Created By"
            variant="outlined"
            value={searchCreatedBy}
            onChange={(e) => setSearchCreatedBy(e.target.value)}
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ border: '2px solid #ccc', borderRadius: 2 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <StyledTableCell sortDirection={orderBy === 'bookingId' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'bookingId'}
                      direction={orderBy === 'bookingId' ? order : 'asc'}
                      onClick={() => handleRequestSort('bookingId')}
                    >
                      Booking ID
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>Service</StyledTableCell>
                  <StyledTableCell>Estimate Time</StyledTableCell>
                  <StyledTableCell>Date</StyledTableCell>
                  <StyledTableCell>Created By</StyledTableCell>
                  <StyledTableCell sortDirection={orderBy === 'status' ? order : false}>
                    <TableSortLabel
                      active={orderBy === 'status'}
                      direction={orderBy === 'status' ? order : 'asc'}
                      onClick={() => handleRequestSort('status')}
                    >
                      Status
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedBookings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((booking) => (
                  <StyledTableRow key={booking.bookingId}>
                    <StyledTableCell>{booking.bookingId}</StyledTableCell>
                    <StyledTableCell>{booking.services?.serviceName}</StyledTableCell>
                    <StyledTableCell>{booking.services?.estimateTime}</StyledTableCell>
                    <StyledTableCell>{new Date(booking.schedules?.startDate).toLocaleDateString()}</StyledTableCell>
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                          {booking.createBy.charAt(0).toUpperCase()}
                        </Avatar>
                        {booking.createBy}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Chip label={statusMapping[booking.status]} color={getChipColor(booking.status)} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleOpenReportModal(booking.bookingId)}
                      >
                        Create Report
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={8}
                    count={filteredBookings.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                      '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows, & .MuiTablePagination-select, & .MuiTablePagination-menuItem':
                        {
                          fontSize: '16px',
                        },
                      '& .MuiTablePagination-actions': {
                        fontSize: '16px',
                      },
                    }}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      )}

      <CreateReportModal
        open={openReportModal}
        onClose={handleCloseReportModal}
        bookingId={selectedBookingId}
        onSuccess={handleSuccessCreateReport}
        onError={handleErrorCreateReport}
      />

      <ConfirmUpdateDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleCheckIn}
        title="Confirm Check In"
        content="Are you sure you want to check in this booking?"
      />
    </Box>
  );
}

export default BookingListTable;
