import { MATCHES_ITEMSPERPAGE, MatchStatuses } from '@/constant/variables';
import React from 'react';
import PaginatedList from './Pagination';
import { MatchesCountType } from '@/types/fantasy';

export default function ContestsPagination({
  matchTab,
  pageCount,
  offset: defaultOffset,
  pageClicked,
}: {
  matchTab: string;
  pageCount: MatchesCountType;
  offset: MatchesCountType;
  pageClicked: any;
}) {
  const matchStatusProps: {
    [status: string]: {
      count: number;
      offset: number;
    };
  } = {
    [MatchStatuses.upcoming]: {
      count: pageCount.upcoming,
      offset: defaultOffset.upcoming,
    },
    [MatchStatuses.ongoing]: {
      count: pageCount.ongoing,
      offset: defaultOffset.ongoing,
    },
    [MatchStatuses.finished]: {
      count: pageCount.finished,
      offset: defaultOffset.finished,
    },
  };

  const { count, offset } = matchStatusProps[matchTab] || {};
  return (
    <>
      {count > 0 && (
        <div className='text-right paginationstyle'>
          {count !== undefined && offset !== undefined && (
            <PaginatedList
              itemsPerPage={MATCHES_ITEMSPERPAGE}
              count={count}
              offset={offset}
              pageChange={pageClicked}
              status={matchTab}
            />
          )}
        </div>
      )}
    </>
  );
}
