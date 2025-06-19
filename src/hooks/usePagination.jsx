import { useState } from 'react';

const usePagination = (items, pageSize = 20) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / pageSize);

  const currentItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  return { currentItems, currentPage, totalPages, handlePageChange };
};

export default usePagination;
