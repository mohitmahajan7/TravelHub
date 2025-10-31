import { useMemo } from 'react';

export const useRequestUtils = () => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate duration in days
  const calculateDuration = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Since backend doesn't provide status, we'll use a default
  const getStatusDisplay = () => {
    return "Approved";
  };

  const getStatusColor = () => {
    return "status approved";
  };

  // Export functionality
  const exportRequests = (requests, format, filterType = 'all') => {
    if (requests.length === 0) {
      alert('No requests to export');
      return;
    }

    const data = requests.map(req => ({
      'Request ID': req.travelRequestId || 'N/A',
      'Purpose': req.purpose || 'N/A',
      'Project ID': req.projectId || 'N/A',
      'Start Date': req.startDate || 'N/A',
      'End Date': req.endDate || 'N/A',
      'Duration': `${calculateDuration(req.startDate, req.endDate)} days`,
      'Created Date': formatDate(req.createdAt)
    }));
    
    if (format === 'pdf') {
      alert(`PDF export for ${requests.length} requests would be generated`);
      // In a real implementation, you would generate PDF here
    } else {
      // CSV export
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `travel-requests-${filterType}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  return {
    formatDate,
    calculateDuration,
    getStatusDisplay,
    getStatusColor,
    exportRequests
  };
};