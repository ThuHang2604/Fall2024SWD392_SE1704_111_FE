import React, { useEffect, useState } from 'react';
import ServiceList from '@/components/TableList/ServiceList/ServiceList';
import { getAllServices } from '@/api/ServiceApi';

function ServiceListPage() {
  const [serviceList, setServiceList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices();
        console.log('Data from API:', data);
        setServiceList(data.items);
      } catch (error) {
        setError(error);
      }
    };

    fetchServices();
  }, []);

  return <ServiceList serviceList={serviceList} error={error} />;
}

export default ServiceListPage;
