import React, { useState } from 'react';
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

function BookingListTable({ bookingList = [] }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openReportModal, setOpenReportModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

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
                <StyledTableCell>{booking.status}</StyledTableCell>
                <StyledTableCell>{new Date(booking.createDate).toLocaleString()}</StyledTableCell>
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
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={8} align="center">
                No bookings found.2
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
    </TableContainer>
  );
}

export default BookingListTable;
