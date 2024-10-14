import {
  MATCHES_ITEMS_LIMIT,
  MATCHES_ITEMSPERPAGE,
  MatchStatuses,
} from '@/constant/variables';
import React, { useEffect, useState } from 'react';
import PaginatedList from './Pagination';
import { MatchesCountType } from '@/types/fantasy';
import logger from '@/lib/logger';

export default function MatchesPagination({
  matchTab,
  pageCount,
  offset: defaultOffset,
  pageClicked,
  LimitParam,
}: {
  matchTab: string;
  pageCount: MatchesCountType;
  offset: MatchesCountType;
  pageClicked: any;
  LimitParam?: any;
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
  const itemsPerPage =
    LimitParam !== undefined ? LimitParam : MATCHES_ITEMSPERPAGE;

  return (
    <>
      {count > 0 && (
        <div className='text-right paginationstyle'>
          {count !== undefined && offset !== undefined && (
            <PaginatedList
              itemsPerPage={itemsPerPage}
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
