import React, { useEffect, useState } from 'react';
import ReportList from '@/components/TableList/ReportList/ReportList';
import { getAllReport } from '@/api/ReportApi';

function ReportListPage() {
  const [reportList, setReportList] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchReports = async () => {
    try {
      const response = await getAllReport();
      const data = response?.data || [];
      setReportList(data);
    } catch (error) {
      setError('Failed to fetch reports. Please try again later.');
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ReportList
      reportList={reportList}
      page={page}
      rowsPerPage={rowsPerPage}
      handleChangePage={handleChangePage}
      handleChangeRowsPerPage={handleChangeRowsPerPage}
      error={error}
      onRefresh={fetchReports} // Truyền fetchReports xuống để dùng làm onRefresh
    />
  );
}

export default ReportListPage;
