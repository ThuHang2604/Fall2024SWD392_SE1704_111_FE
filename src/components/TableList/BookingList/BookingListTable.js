import React from 'react';
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bookingList.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} sx={{ margin: '20px', maxWidth: '100%', overflow: 'auto' }}>
      <Table sx={{ minWidth: 700 }} aria-label="booking table">
        <TableHead>
          <TableRow>
            {['Booking ID', 'Customer Name', 'Service', 'Date', 'Status', 'Actions'].map((header) => (
              <StyledTableCell key={header}>{header}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {bookingList.length > 0 ? (
            (rowsPerPage > 0
              ? bookingList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : bookingList
            ).map((booking, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell>{booking.bookingId}</StyledTableCell>
                <StyledTableCell>{booking.customerName}</StyledTableCell>
                <StyledTableCell>{booking.serviceName}</StyledTableCell>
                <StyledTableCell>{new Date(booking.date).toLocaleDateString()}</StyledTableCell>
                <StyledTableCell>{booking.status}</StyledTableCell>
                <StyledTableCell>
                  <Button variant="contained" color="primary" size="small" style={{ marginRight: 10 }}>
                    Update
                  </Button>
                  <Button variant="contained" color="error" size="small">
                    Remove
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={6} align="center">
                No bookings found.
              </StyledTableCell>
            </TableRow>
          )}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <StyledTableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={6}
              count={bookingList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default BookingListTable;
