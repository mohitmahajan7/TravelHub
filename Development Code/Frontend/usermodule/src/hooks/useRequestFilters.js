import { useState, useMemo } from 'react';

export const useRequestFilters = (requests) => {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  // Filter and search requests
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(request => request.status === filter);
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        request.travelRequestId?.toLowerCase().includes(term) ||
        request.purpose?.toLowerCase().includes(term) ||
        request.projectId?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [requests, filter, searchTerm, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const clearFilters = () => {
    setFilter("all");
    setSearchTerm("");
  };

  const filterOptions = [
    { value: "all", label: "All Requests", count: requests.length },
    { value: "approved", label: "Approved", count: requests.length } // All are approved for now
  ];

  return {
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
    sortConfig,
    handleSort,
    filteredRequests,
    clearFilters,
    filterOptions
  };
};