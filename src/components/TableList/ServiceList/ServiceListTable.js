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

function ServiceListTable({ serviceList = [] }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - serviceList?.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper} sx={{ margin: '20px', maxWidth: 'calc(100% - 40px)' }}>
      <Table sx={{ minWidth: 700 }} aria-label="service table">
        <TableHead>
          <TableRow>
            {[
              'Service ID',
              'Service Name',
              'Description',
              'Price',
              'Estimate Time',
              'Image Link',
              'Create By',
              'Create Date',
              'Update By',
              'Update Date',
              'Actions',
            ].map((header) => (
              <StyledTableCell key={header}>{header}</StyledTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {serviceList.length > 0 ? (
            (rowsPerPage > 0
              ? serviceList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : serviceList
            ).map((service) => (
              <StyledTableRow key={service.serviceId}>
                <StyledTableCell component="th" scope="row">
                  {service.serviceId}
                </StyledTableCell>
                <StyledTableCell>{service.serviceName}</StyledTableCell>
                <StyledTableCell>{service.description}</StyledTableCell>
                <StyledTableCell>{service.price}</StyledTableCell>
                <StyledTableCell>{service.estimateTime}</StyledTableCell>
                <StyledTableCell>
                  <a href={service.imageLink} target="_blank" rel="noopener noreferrer">
                    {service.imageLink}
                  </a>
                </StyledTableCell>
                <StyledTableCell>{service.createBy}</StyledTableCell>
                <StyledTableCell>{new Date(service.createDate).toLocaleString()}</StyledTableCell>
                <StyledTableCell>{service.updateBy}</StyledTableCell>
                <StyledTableCell>{new Date(service.updateDate).toLocaleString()}</StyledTableCell>
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
              <StyledTableCell colSpan={11} align="center">
                No services found.
              </StyledTableCell>
            </TableRow>
          )}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <StyledTableCell colSpan={11} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={11}
              count={serviceList?.length}
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
  );
}

export default ServiceListTable;
