import React, { useEffect, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import ServiceList from '@/components/TableList/ServiceList/ServiceList';
import { getAllServices } from '@/api/ServiceApi';

function ServiceListPage() {
  const [serviceList, setServiceList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  console.log('serviceList:', serviceList);
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true); // Start loading indicator
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      try {
        const response = await getAllServices();
        const data = response?.data || [];
        setServiceList(data);
      } catch (error) {
        setError('Failed to fetch services. Please try again later.');
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchServices();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ServiceList
        serviceList={serviceList}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        error={error}
      />
    </>
  );
}

export default ServiceListPage;
