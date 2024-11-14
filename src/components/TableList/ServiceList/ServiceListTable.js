import React, { useState } from 'react';
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
  TextField,
  TableSortLabel,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from '@mui/material';
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

const getStatusChip = (status) => {
  return status === 1 ? <Chip label="Active" color="success" /> : <Chip label="Inactive" color="default" />;
};

function ServiceListTable({ serviceList = [] }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [serviceNameFilter, setServiceNameFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'serviceId', direction: 'asc' });
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpenModal = (service) => {
    setSelectedService(service);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedService(null);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const filteredAndSortedServices = serviceList
    .filter((service) => service.serviceName.toLowerCase().includes(serviceNameFilter.toLowerCase()))
    .sort((a, b) => {
      if (sortConfig.key === 'serviceId') {
        return sortConfig.direction === 'asc' ? a.serviceId - b.serviceId : b.serviceId - a.serviceId;
      } else if (sortConfig.key === 'price') {
        return sortConfig.direction === 'asc' ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, p: 2, border: '2px solid #ccc', borderRadius: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: '700' }}>
            Service Name
          </Typography>
          <TextField
            label="Search by Service Name"
            variant="outlined"
            value={serviceNameFilter}
            onChange={(e) => setServiceNameFilter(e.target.value)}
          />
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ margin: '20px', maxWidth: 'calc(100% - 40px)' }}>
          <Table sx={{ minWidth: 700 }} aria-label="service table">
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'serviceId'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('serviceId')}
                  >
                    Service ID
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>Image Link</StyledTableCell>
                <StyledTableCell>Service Name</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>
                  <TableSortLabel
                    active={sortConfig.key === 'price'}
                    direction={sortConfig.direction}
                    onClick={() => handleSort('price')}
                  >
                    Price
                  </TableSortLabel>
                </StyledTableCell>
                <StyledTableCell>Estimate Time</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAndSortedServices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((service) => (
                <StyledTableRow
                  key={service.serviceId}
                  onClick={() => handleOpenModal(service)}
                  style={{ cursor: 'pointer' }}
                >
                  <StyledTableCell>{service.serviceId}</StyledTableCell>
                  <StyledTableCell>
                    <Box
                      component="img"
                      src={service.imageLink}
                      alt={service.serviceName}
                      sx={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px' }}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{service.serviceName}</StyledTableCell>
                  <StyledTableCell>{service.description}</StyledTableCell>
                  <StyledTableCell>{service.price}</StyledTableCell>
                  <StyledTableCell>{service.estimateTime}</StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={6}
                  count={filteredAndSortedServices.length}
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

      {/* Service Detail Modal */}
      <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        {selectedService && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Service : {selectedService.serviceName}</Typography>
                {getStatusChip(selectedService.status)}
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ position: 'relative', width: '100%', borderRadius: 4, overflow: 'hidden' }}>
                {/* Image with overlay */}
                <Box
                  component="img"
                  src={selectedService.imageLink}
                  alt={selectedService.serviceName}
                  sx={{ width: '100%', maxHeight: 300, objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    padding: 2,
                  }}
                >
                  <Typography variant="subtitle1">{selectedService.description}</Typography>
                  <Typography variant="body2">Price: {selectedService.price} VND</Typography>
                  <Typography variant="body2">Estimated Time: {selectedService.estimateTime}</Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary" variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default ServiceListTable;
