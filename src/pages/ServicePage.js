import React, { useEffect, useState } from 'react';
import { Pagination, Box, Backdrop, CircularProgress, Typography } from '@mui/material';
import { getAllServices } from '@/api/ServiceApi';
import ServiceCardView from '@/components/Card/ServiceCard/ServiceCardView';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ServicePage() {
  const [serviceCard, setServiceCard] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [paginatedServices, setPaginatedServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a loading delay
      const response = await getAllServices();
      const data = response?.data || [];
      console.log('service list :', data);

      // Filter services to only include those with status = 1
      const filteredData = data.filter((service) => service.status === 1);
      if (filteredData.length === 0) {
        setError('No active services available at the moment.');
      } else {
        setServiceCard(filteredData);
        paginateServices(filteredData, page, pageSize);
      }
    } catch (error) {
      setError('Failed to fetch services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [page, pageSize]);

  useEffect(() => {
    if (serviceCard.length > 0) {
      paginateServices(serviceCard, page, pageSize);
    }
  }, [page, serviceCard, pageSize]);

  const paginateServices = (services, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = services.slice(startIndex, endIndex);
    setPaginatedServices(paginatedItems);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {error ? (
        <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 4 }}>
          {error}
        </Typography>
      ) : (
        <>
          <ServiceCardView serviceCard={paginatedServices} />
          <Box display="flex" justifyContent="center" sx={{ paddingTop: '40px', backgroundColor: '#FFF3E0' }}>
            <Pagination
              count={Math.ceil(serviceCard.length / pageSize)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default ServicePage;
