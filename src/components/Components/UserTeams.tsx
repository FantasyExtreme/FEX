'use client';
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/Components/NavBar';
import Footer from '@/components/Components/Footer';
import dollarbottle from '../../assets/images/dollar.png';
import infinite from '../../assets/images/infinte.png';
import Profilepic from '../../assets/images/profileplaceholder.png';
import tethericon from '@/assets/images/icons/tether-icon.png';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useAuthStore } from '@/store/useStore';
import { Row, Col, Table, Spinner, Form, Button } from 'react-bootstrap';
import {
  DEAFULT_PROPS,
  MATCHES_ITEMSPERPAGE,
  MatchStatusKeyValue,
  TRANSACTIONS_ITEMSPERPAGE,
} from '@/constant/variables';
import PaginatedList from './Pagination';
import { makeFantasyTransactionsActor } from '@/dfx/service/actor-locator';
import {
  getDashboardMatches,
  getUserTransactions,
  isConnected,
} from '../utils/fantasy';
import logger from '@/lib/logger';
import UserTransactionTableRow from './UserTransactionTableRow';
import { DetailedMatchContest } from '@/types/fantasy';
import DetailedMatchTable from './DetailedMatchTable';
import { MATCHES_ROUTE } from '@/constant/routes';
import DetailedMatchTableMobile from './DetailedMatchTableMobile';
export default function UserTeams({
  handleGetAssets,
  dashboard,
}: {
  handleGetAssets: any;
  dashboard: boolean;
}) {
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  const [offset, setOffset] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(1);
  const [transaction, setTransaction] = useState<any[]>([]);
  const [matches, setMatches] = useState<DetailedMatchContest[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [matchProps, setMatchProps] = useState({
    ...DEAFULT_PROPS,
    status: '3',
  });
  const tempActor = makeFantasyTransactionsActor({
    agentOptions: {
      identity: auth.identity,
    },
  });
  const pageClicked = (pageNumber: number) => {
    if (!auth.actor) return;
    handleGetMatches({ page: pageNumber });
  };
  let handleGetMatches = async ({
    page,
    status,
  }: {
    page: number;
    status?: string;
  }) => {
    try {
      getDashboardMatches(
        auth.actor,
        setMatches,
        { ...matchProps, page, status: status ?? matchProps.status },
        setLoading,
        setPageCount,
      );
    } catch (error) {
      setLoading(false);
    }
  };
  function selectStatus(status: string) {
    setMatchProps((prev) => ({ ...prev, status: status }));
    handleGetMatches({ page: 0, status });
  }

  useEffect(() => {
    if (isConnected(auth.state)) {
      handleGetMatches({ page: 0 });
    }
  }, [auth.state]);

  return (
    <>
      <Row className='mb-5'>
        <Col xl='12' lg='12' md='12'>
          <div className='gray-panel'>
            <div className='dashboard-table-header'>
              <h4 className='whitecolor Nasalization mb-0'>
                My <span>Teams</span>
              </h4>
              <div className='right'>
                <Form.Select
                  size='sm'
                  className='mySelectBtn '
                  defaultValue='default'
                  onChange={(e) => {
                    selectStatus(e.target.value);
                  }}
                >
                  {MatchStatusKeyValue.map(({ key, value }) => (
                    <option
                      key={key}
                      value={key}
                      selected={key == matchProps.status}
                    >
                      {value}
                    </option>
                  ))}
                </Form.Select>
                <Link href={`${MATCHES_ROUTE}`} className='reg-btn'>
                  Create
                </Link>
              </div>
            </div>
            <div className='spacer-20' />
            <div className='table-container web-view-table'>
              <div className='table-inner-container'>
                <DetailedMatchTable
                  loading={loading}
                  matches={matches}
                  handleGetAssets={handleGetAssets}
                  dashboard={dashboard}
                />
                {!(pageCount == 0) && (
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

            <div>
              <div className=' table-container hide-on-web'>
                <div className='table-inner-container'>
                  <DetailedMatchTableMobile
                    loading={loading}
                    matches={matches}
                    handleGetAssets={handleGetAssets}
                    dashboard={dashboard}
                  />
                  {!(pageCount == 0) && (
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

              {/* <div className='mobile-match-post'>
                <div className='match-post-header'>
                  <div className='flex-div'>
                    <h6>
                      <Image src={tethericon} alt='Icon paris' />
                      Paris Saint-Germain
                    </h6>
                    <h6 className='color'>10h : 28m : 13s</h6>
                    <h6>
                      <Image src={tethericon} alt='Icon paris' />
                      Borussia Dortmund
                    </h6>
                  </div>
                  <p>
                    Created Teams: 12{' '}
                    <span className='mx-4'>Joined Teams: 10</span>
                  </p>
                </div>
                <div className='match-post-footer'>
                  <div>
                    <Link
                      href='#'
                      className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
                    >
                      Contest
                    </Link>

                    <Link
                      href='#'
                      className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
                    >
                      Create Another Team
                    </Link>
                    <Button className='arrow-down-btn'>
                      <i className='fa fa-angle-down'></i>
                    </Button>
                  </div>
                  <div className='match-post-footer-detail'>
                    <div className='spacer-20' />
                    <Table>
                      <thead>
                        <tr>
                          <th>Team Name</th>
                          <th>Points</th>
                          <th>Rank</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>My Team_01</td>
                          <td>00</td>
                          <td>00</td>
                          <td className='text-center'>
                            <Link
                              className='simple-link green w-100 underline'
                              href='#'
                            >
                              Joined
                            </Link>
                            <Link className='simple-link underline' href='#'>
                              Edit
                            </Link>
                            <Link className='simple-link underline' href='#'>
                              View
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div> */}

              {/* <div className='mobile-match-post auto'>
                <div className='match-post-header'>
                  <div className='flex-div'>
                    <h6>
                      <Image src={tethericon} alt='Icon paris' />
                      Paris Saint-Germain
                    </h6>
                    <h6 className='color'>10h : 28m : 13s</h6>
                    <h6>
                      <Image src={tethericon} alt='Icon paris' />
                      Borussia Dortmund
                    </h6>
                  </div>
                  <p>
                    Created Teams: 12{' '}
                    <span className='mx-4'>Joined Teams: 10</span>
                  </p>
                </div>
                <div className='match-post-footer'>
                  <div>
                    <Link
                      href='#'
                      className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
                    >
                      Contest
                    </Link>

                    <Link
                      href='#'
                      className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
                    >
                      Create Another Team
                    </Link>
                    <Button className='arrow-down-btn'>
                      <i className='fa fa-angle-down'></i>
                    </Button>
                  </div>
                  <div className='match-post-footer-detail'>
                    <div className='spacer-20' />
                    <Table>
                      <thead>
                        <tr>
                          <th>Team Name</th>
                          <th>Points</th>
                          <th>Rank</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>My Team_01</td>
                          <td>00</td>
                          <td>00</td>
                          <td className='text-center'>
                            <Link
                              className='simple-link green w-100 underline'
                              href='#'
                            >
                              Joined
                            </Link>
                            <Link className='simple-link underline' href='#'>
                              Edit
                            </Link>
                            <Link className='simple-link underline' href='#'>
                              View
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>    */}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
