import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import CreateReportModal from '@/components/Modal/ReportModal/CreateReport';
import { checkIn } from '@/api/BookingApi';
import ConfirmUpdateDialog from '@/components/Modal/DialogConfirm/ConfirmUpdate';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
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

// Status mapping
const statusMapping = {
  0: 'None',
  1: 'InQueue',
  2: 'Accepted',
  3: 'InProgress',
  4: 'Delay',
  5: 'Complete',
  6: 'Cancel',
};

function BookingListTable({ bookingList = [], fetchBookings }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bookingList?.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Create Report Handle
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
  };

  // Handle Check In
  const handleOpenDialog = (bookingId) => {
    setSelectedBookingId(bookingId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBookingId(null);
  };

  const handleCheckIn = async () => {
    if (setSelectedBookingId) {
      checkIn(selectedBookingId, 2)
        .then((response) => {
          toast.success('Check in booking successfully!');
          handleCloseDialog();
          fetchBookings();
        })
        .catch((error) => {
          toast.error(`Error check in: ${error.message}`);
        });
    }
  };

  return (
    <TableContainer component={Paper} sx={{ margin: '20px', maxWidth: '100%', overflow: 'auto' }}>
      <Table sx={{ minWidth: 700 }} aria-label="booking table">
        <TableHead>
          <TableRow>
            {[
              'Booking ID',
              'Total Price',
              'Voucher ID',
              'Customer ID',
              'Staff ID',
              'Schedule ID',
              'Status',
              'Create Date',
              'Actions',
            ].map((header) => (
              <StyledTableCell key={header}>{header}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bookingList.length > 0 ? (
            (rowsPerPage > 0
              ? bookingList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : bookingList
            ).map((booking) => (
              <StyledTableRow key={booking.bookingId}>
                <StyledTableCell>{booking.bookingId}</StyledTableCell>
                <StyledTableCell>{booking.totalPrice}</StyledTableCell>
                <StyledTableCell>{booking.voucherId || 'N/A'}</StyledTableCell>
                <StyledTableCell>{booking.customerId}</StyledTableCell>
                <StyledTableCell>{booking.staffId}</StyledTableCell>
                <StyledTableCell>{booking.scheduleId}</StyledTableCell>
                <StyledTableCell>{statusMapping[booking.status]}</StyledTableCell> {/* Use statusMapping */}
                <StyledTableCell>{new Date(booking.createDate).toLocaleString()}</StyledTableCell>
                <StyledTableCell>
                  {/* Check In Button */}
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleOpenDialog(booking.bookingId)}
                    style={{ marginRight: 10 }}
                  >
                    Check In
                  </Button>
                  {/* Create report button */}
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
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={8} align="center">
                No bookings found.
              </StyledTableCell>
            </TableRow>
          )}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <StyledTableCell colSpan={8} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={8}
              count={bookingList?.length}
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

      {/* Create Report Modal */}
      <CreateReportModal
        open={openReportModal}
        onClose={handleCloseReportModal}
        bookingId={selectedBookingId}
        onSuccess={handleSuccessCreateReport}
      />

      <ConfirmUpdateDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleCheckIn}
        title="Confirm Check In"
        content="Are you sure you want to check in this booking?"
      />
    </TableContainer>
  );
}

export default BookingListTable;
