import React, { useEffect, useState } from 'react';
import ServiceList from '@/components/TableList/ServiceList/ServiceList';
import { getAllServices } from '@/api/ServiceApi';

function ServiceListPage() {
  const [serviceList, setServiceList] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getAllServices();
        const data = response?.data || [];
        setServiceList(data);
      } catch (error) {
        setError('Failed to fetch services. Please try again later.');
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
    <ServiceList
      serviceList={serviceList}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      error={error}
    />
  );
}

export default ServiceListPage;
