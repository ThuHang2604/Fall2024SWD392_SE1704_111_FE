import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
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
  Button,
  TextField,
  Box,
  TableSortLabel,
  Typography,
  CircularProgress,
} from '@mui/material';
import { removeReport } from '@/api/ReportApi';
import ConfirmRemoveDialog from '@/components/Modal/DialogConfirm/ComfirmRemove';
import UpdateReportModal from '@/components/Modal/ReportModal/UpdateReport';
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

function ReportListTable({ reportList = [], onRefresh }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportNameFilter, setReportNameFilter] = useState('');
  const [updateByFilter, setUpdateByFilter] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setLoading(false);
    }, 500);
    setLoading(true);

    return () => clearTimeout(delayDebounceFn);
  }, [reportNameFilter, updateByFilter]);

  const handleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const sortedAndFilteredReports = reportList
    .filter(
      (report) =>
        report.reportName.toLowerCase().includes(reportNameFilter.toLowerCase()) &&
        report.updateBy.toLowerCase().includes(updateByFilter.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortDirection === 'asc') {
        return a.reportId - b.reportId;
      }
      return b.reportId - a.reportId;
    });

  const emptyRows = Math.max(0, (1 + page) * rowsPerPage - sortedAndFilteredReports.length);

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

  const handleOpenUpdateModal = (report) => {
    setSelectedReport(report);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => {
    setOpenUpdateModal(false);
    setSelectedReport(null);
  };

  const handleUpdateSuccess = () => {
    onRefresh();
    handleCloseUpdateModal();
  };

  return (
    <>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, border: '2px solid #ccc', borderRadius: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: '700' }}>
              Report Name
            </Typography>
            <TextField
              label="Search by Report Name"
              variant="outlined"
              value={reportNameFilter}
              onChange={(e) => setReportNameFilter(e.target.value)}
            />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: '700' }}>
              Update By
            </Typography>
            <TextField
              label="Search by Updated By"
              variant="outlined"
              value={updateByFilter}
              onChange={(e) => setUpdateByFilter(e.target.value)}
            />
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
            <Table sx={{ minWidth: 700 }} aria-label="report table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>
                    <TableSortLabel active direction={sortDirection} onClick={handleSort}>
                      Report ID
                    </TableSortLabel>
                  </StyledTableCell>
                  <StyledTableCell>Report Name</StyledTableCell>
                  <StyledTableCell>Report Link</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Create By</StyledTableCell>
                  <StyledTableCell>Update By</StyledTableCell>
                  <StyledTableCell>Actions</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedAndFilteredReports.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((report) => (
                  <StyledTableRow key={report.reportId}>
                    <StyledTableCell>{report.reportId}</StyledTableCell>
                    <StyledTableCell>{report.reportName}</StyledTableCell>
                    <StyledTableCell>
                      <Link to={report.reportLink} target="_blank" rel="noopener noreferrer">
                        {report.reportLink}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell>{report.status}</StyledTableCell>
                    <StyledTableCell>{report.createBy}</StyledTableCell>
                    <StyledTableCell>{report.updateBy}</StyledTableCell>
                    <StyledTableCell>
                      <Button variant="contained" color="primary" onClick={() => handleOpenUpdateModal(report)}>
                        Update
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleOpenDialog(report.reportId)}>
                        Remove
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {emptyRows > 0 && (
                  <StyledTableRow style={{ height: 53 * emptyRows }}>
                    <StyledTableCell colSpan={7} />
                  </StyledTableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    count={sortedAndFilteredReports.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        )}
      </Box>
      <ConfirmRemoveDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onConfirm={handleRemoveReport}
        title="Confirm Remove"
        content="Are you sure you want to remove this report?"
      />
      {selectedReport && (
        <UpdateReportModal
          open={openUpdateModal}
          onClose={handleCloseUpdateModal}
          reportId={selectedReport.reportId}
          initialReportData={selectedReport}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </>
  );
}

export default ReportListTable;
