import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReportListTable from '@/components/TableList/ReportList/ReportListTable';
import { getAllReport } from '@/api/ReportApi';
import { Backdrop, CircularProgress } from '@mui/material';

function ReportListPage() {
  const [reportList, setReportList] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
    try {
      const response = await getAllReport();
      const data = response?.data || [];
      // Filter reports with status = 1
      const filteredData = data.filter((report) => report.status === 1);
      setReportList(filteredData);
    } catch (error) {
      setError('Failed to fetch reports. Please try again later.');
      toast.error('Failed to fetch reports. Please try again later.');
    } finally {
      setLoading(false);
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
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <ReportListTable
        reportList={reportList}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        error={error}
        onRefresh={fetchReports}
      />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default ReportListPage;
