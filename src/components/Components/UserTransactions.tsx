'use client';
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/Components/NavBar';
import Footer from '@/components/Components/Footer';
import dollarbottle from '../../assets/images/dollar.png';
import infinite from '../../assets/images/infinte.png';
import Profilepic from '../../assets/images/profileplaceholder.png';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useAuthStore } from '@/store/useStore';
import { Row, Col, Table, Spinner } from 'react-bootstrap';
import {
  MATCHES_ITEMSPERPAGE,
  TRANSACTIONS_ITEMSPERPAGE,
} from '@/constant/variables';
import PaginatedList from './Pagination';
import { makeFantasyTransactionsActor } from '@/dfx/service/actor-locator';
import { getUserTransactions, isConnected } from '../utils/fantasy';
import logger from '@/lib/logger';
import UserTransactionTableRow from './UserTransactionTableRow';
export default function UserTransactions() {
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  const [offset, setOffset] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [transaction, setTransaction] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const tempActor = makeFantasyTransactionsActor({
    agentOptions: {
      identity: auth.identity,
    },
  });
  let pageClicked = (pageNumber: number) => {
    handleGetTransection({ page: pageNumber, contestId: [] });
  };
  let handleGetTransection = async ({
    page,
    contestId,
  }: {
    page: number;
    contestId: string[];
  }) => {
    try {
      setLoading(true);

      let data = await getUserTransactions({
        actor: auth.actor,
        fantasyTransactionActor: tempActor,
        limit: TRANSACTIONS_ITEMSPERPAGE,
        page,
        contestId,
      });
      setPageCount(data.total);
      setTransaction(data.transactions);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (isConnected(auth.state)) {
      handleGetTransection({ page: 0, contestId: [] });
    }
  }, [auth.state]);

  return (
    <>
      <Row>
        <Col xl='12' lg='12' md='12'>
          <div className='gray-panel'>
            <h4 className='whitecolor Nasalization'>
              Transaction <span>History</span>
            </h4>
            <div className='spacer-20' />

            <div className='table-container'>
              <div className='table-inner-container'>
                <Table className='br-rad-0'>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Amount</th>
                      <th>type</th>
                      <th>date</th>
                      <th>Time</th>
                      <th>Contest</th>
                    </tr>
                  </thead>
                  {loading && (
                    <tbody className=''>
                      <tr>
                        <td colSpan={6}>
                          <div className='d-flex justify-content-center'>
                            <Spinner animation='border' />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}{' '}
                  {!loading && transaction?.length == 0 && (
                    <tbody className=''>
                      <tr>
                        <td colSpan={6}>
                          <div className='d-flex justify-content-center'>
                            <p>No Transactions Found</p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )}
                  {!loading && (
                    <tbody>
                      {transaction &&
                        transaction.map((trans: any, index: number) => {
                          return (
                            <UserTransactionTableRow
                              trans={trans}
                              key={index}
                            />
                          );
                        })}
                    </tbody>
                  )}
                </Table>
                {!(
                  pageCount == 0 || pageCount <= TRANSACTIONS_ITEMSPERPAGE
                ) && (
                  <div className='text-right'>
                    <PaginatedList
                      itemsPerPage={TRANSACTIONS_ITEMSPERPAGE}
                      count={pageCount}
                      offset={offset}
                      pageChange={pageClicked}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
