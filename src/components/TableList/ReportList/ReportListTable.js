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
import { removeReport } from '@/api/ReportApi';
import ConfirmRemoveDialog from '@/components/Modal/DialogConfirm/ComfirmRemove';

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

function ReportListTable({ reportList = [], onRefresh }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - reportList?.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (reportId) => {
    setSelectedReportId(reportId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReportId(null);
  };

  const handleRemoveReport = () => {
    if (selectedReportId) {
      removeReport(selectedReportId, 0)
        .then((response) => {
          toast.success('Report removed successfully!');
          onRefresh();
          handleCloseDialog();
        })
        .catch((error) => {
          toast.error(`Error removing report: ${error.message}`);
        });
    }
  };

  // const handleRemoveReport = (reportId) => {
  //   if (window.confirm('Are you sure you want to remove this report?')) {
  //     removeReport(reportId, 0)
  //       .then(() => {
  //         toast.success('Report removed successfully!');
  //         onRefresh(); // Gọi lại hàm refresh sau khi xóa
  //       })
  //       .catch((error) => {
  //         toast.error(`Error removing report: ${error.message}`);
  //       });
  //   }
  // };

  return (
    <>
      <ToastContainer />
      <TableContainer component={Paper} sx={{ margin: '20px', maxWidth: '100%', overflow: 'auto' }}>
        <Table sx={{ minWidth: 700 }} aria-label="report table">
          <TableHead>
            <TableRow>
              {['Report ID', 'Report Name', 'Report Link', 'Status', 'Create By', 'Update By', 'Actions'].map(
                (header) => (
                  <StyledTableCell key={header}>{header}</StyledTableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {reportList.length > 0 ? (
              (rowsPerPage > 0
                ? reportList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : reportList
              ).map((report) => (
                <StyledTableRow key={report.reportId}>
                  <StyledTableCell>{report.reportId}</StyledTableCell>
                  <StyledTableCell>{report.reportName}</StyledTableCell>
                  <StyledTableCell>
                    <a href={report.reportLink} target="_blank" rel="noopener noreferrer">
                      {report.reportLink}
                    </a>
                  </StyledTableCell>
                  <StyledTableCell>{report.status}</StyledTableCell>
                  <StyledTableCell>{report.createBy}</StyledTableCell>
                  <StyledTableCell>{report.updateBy}</StyledTableCell>
                  <StyledTableCell>
                    <Button variant="contained" color="primary" size="small" style={{ marginRight: 10 }}>
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDialog(report.reportId)}
                    >
                      Remove
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableCell colSpan={7} align="center">
                  No reports found.
                </StyledTableCell>
              </TableRow>
            )}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <StyledTableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={7}
                count={reportList?.length}
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

      <ConfirmRemoveDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleRemoveReport}
        title="Confirm Remove"
        content="Are you sure you want to remove this report?"
      />
    </>
  );
}

export default ReportListTable;
