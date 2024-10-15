import React, { useEffect, useState } from 'react';
import ServiceCardView from '@/components/Card/ServiceCard/ServiceCardView';
import { getAllServices } from '@/api/ServiceApi';
import { Pagination, Box } from '@mui/material';

function ServicePage() {
  const [serviceCard, setServiceCard] = useState([]); // All services
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Current page
  const [pageSize] = useState(6); // Number of items per page
  const [paginatedServices, setPaginatedServices] = useState([]); // Services to display on the current page

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices(); // Fetch all services at once
        const data = response?.data || []; // Ensure response.data is defined
        setServiceCard(data); // Save all services to state
        paginateServices(data, page, pageSize); // Paginate on first load
      } catch (error) {
        setError('Failed to fetch services. Please try again later.');
      }
    };

    fetchServices();
  }, [page, pageSize]);

  useEffect(() => {
    // Paginate whenever the page or serviceCard changes
    if (serviceCard.length > 0) {
      paginateServices(serviceCard, page, pageSize);
    }
  }, [page, serviceCard, pageSize]);

  const paginateServices = (services, page, pageSize) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = services.slice(startIndex, endIndex); // Get services for the current page
    setPaginatedServices(paginatedItems);
  };

  const handlePageChange = (event, value) => {
    setPage(value); // Update page number
  };

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : (
        <>
          <ServiceCardView serviceCard={paginatedServices} error={error} />
          <Box display="flex" justifyContent="center" sx={{ marginTop: '20px' }}>
            <Pagination
              count={Math.ceil(serviceCard.length / pageSize)} // Calculate total pages
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </div>
  );
}

export default ServicePage;
