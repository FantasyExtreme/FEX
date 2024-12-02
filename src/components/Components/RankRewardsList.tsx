import React from 'react';
import { Form } from 'react-bootstrap';
import CenteredSpinner from './CenteredSpinner';
import { fromE8S } from '@/lib/ledger';
import PaginatedList from './Pagination';

export default function RankRewardsList({
  rewardsMap,
  handleSearch,
  loading,
  pageClicked,
  offset,
  pageCount,
  limit,
  isContestInfoModle,
}: {
  rewardsMap: any;
  handleSearch: any;
  loading: boolean;
  pageClicked: any;
  offset: number;
  pageCount: number;
  limit: number;
  isContestInfoModle?: boolean;
}) {
  return (
    <div className={`rank-rewards ${isContestInfoModle && 'scrollbar'}`}>
      <Form.Group>
        <Form.Control
          type='number'
          placeholder='Search Rank'
          onChange={handleSearch}
          className='RankSearchInput'
        />
        <ul className='rank-list'>
          {loading ? (
            <CenteredSpinner minHeight={260} />
          ) : rewardsMap?.length == 0 ? (
            <p className='m-4 text-center'>Rank Not Found</p>
          ) : (
            rewardsMap?.map(([rank, amount]: [number, number]) => {
              return (
                <li key={Number(rank)}>
                  <span className='rank'>Rank {Number(rank)}</span>
                  <span className='amount'>{fromE8S(amount, true)} ICP</span>
                </li>
              );
            })
          )}
        </ul>
        <div className='mobile-view-pagination'>
        <PaginatedList
          itemsPerPage={limit}
          count={pageCount}
          offset={offset}
          pageChange={pageClicked}
          first={false}
        />
        </div>
      </Form.Group>
    </div>
  );
}
