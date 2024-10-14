import { MatchStatuses } from '@/constant/variables';
import { MatchesCountType } from '@/types/fantasy';
import React, { useEffect, useState } from 'react';
import Pagination from 'react-bootstrap/Pagination';

const PaginatedList = ({
  itemsPerPage,
  count,
  offset,
  pageChange,
  status,
  first,
}: {
  itemsPerPage: number;
  count: number;
  offset: number;
  pageChange: any;
  status?: string;
  first?: boolean;
}) => {
  const [currentPage, setCurrentPage] = useState(offset + 1);
  const totalPages = Math.ceil(count / itemsPerPage);
  const maxPageNumbersToShow = 4;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);

    // setOffset(pageNumber - 1);
    pageChange(pageNumber - 1);
  };

  const renderPaginationItems = () => {
    let paginationItems = [];
    paginationItems.push(
      <Pagination.First
        key='first'
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      >
        ‹‹
      </Pagination.First>,
    );
    if (first) {
      paginationItems.push(
        <Pagination.First
          key='first-conditional'
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        >
          ‹‹
        </Pagination.First>,
      );
    }
    if (!first) {
      // Add First and Previous buttons
      paginationItems.push(
        <Pagination.First
          key='first-previous'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ‹
        </Pagination.First>,
      );
    }

    paginationItems.push(
      <Pagination.Item key={currentPage} active>
        {currentPage}
      </Pagination.Item>,
    );

    if (currentPage < totalPages) {
      paginationItems.push(
        <Pagination.Item
          key={currentPage + 1}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </Pagination.Item>,
      );
    }

    // Add ellipsis and the last page if needed
    if (currentPage < totalPages - 2) {
      paginationItems.push(
        <Pagination.Item key='end-ellipsis' disabled>
          …
        </Pagination.Item>,
      );
    }
    if (currentPage < totalPages - 1) {
      paginationItems.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>,
      );
    }

    // Add Next and Last buttons
    paginationItems.push(
      <Pagination.Next
        key='next'
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        ›
      </Pagination.Next>,
    );
    // paginationItems.push(
    //   <Pagination.Last
    //     key='last'
    //     onClick={() => handlePageChange(totalPages)}
    //     disabled={currentPage === totalPages}
    //   >
    //     »
    //   </Pagination.Last>,
    // );

    return paginationItems;
  };
  useEffect(() => {
    setCurrentPage(offset + 1);
  }, [offset]);

  return (
    <div>
      <Pagination>{renderPaginationItems()}</Pagination>
    </div>
  );
};

export default PaginatedList;
