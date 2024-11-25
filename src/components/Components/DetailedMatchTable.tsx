import { Directions, MATCHES_ICON_SIZES } from '@/constant/fantasticonst';
import {
  ADMIN_CONTESTS_ROUTE,
  CONTESTS_ROUTE,
  PLAYERS_ROUTE,
  TEAMS_ROUTE,
  TEAM_CREATION_ROUTE,
} from '@/constant/routes';
import { MatchStatuses, QURIES, QueryParamType } from '@/constant/variables';
import logger from '@/lib/logger';
import { DetailedMatchContest, Match } from '@/types/fantasy';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Spinner, Table } from 'react-bootstrap';
import Arrow from '../Icons/Arrow';
import MatchWithTeams from './MatchWithTeams';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { toast } from 'react-toastify';

export default function DetailedMatchTable({
  matches,
  loading,
  admin,
  handleGetAssets,
  dashboard,
}: {
  matches: null | DetailedMatchContest[];
  loading: boolean;
  admin?: boolean;
  handleGetAssets?: any;
  dashboard?: boolean;
}) {
  const router = useRouter();
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));

  return (
    <div className='table-container'>
      <div className='table-inner-container med-table-height'>
        <Table className='dashboard-table'>
          <thead>
            <tr>
              <th className='text-center'>MATCHES</th>
              <th>Created Teams</th>
              <th>Joined Teams</th>
              {dashboard && <th>Date</th>}
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          {loading && (
            <tbody className=''>
              <tr>
                <td colSpan={5}>
                  <div className='d-flex justify-content-center'>
                    <Spinner animation='border' />
                  </div>
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (matches?.length == 0 || !matches) ? (
            <tbody className=''>
              <tr>
                <td colSpan={6}>
                  <div className='d-flex justify-content-center'>
                    <p>No Teams Found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ):
          
            <tbody>
              <tr>
                {' '}
                <div className='spacer-20'></div>
              </tr>
              {matches?.map((match, index) => (
                <MatchWithTeams
                  key={index}
                  identity={auth.identity}
                  match={match}
                  actor={auth.actor}
                  handleGetAssets={handleGetAssets}
                  dashboard={dashboard}
                />
              ))}
            </tbody>
          }
        </Table>
      </div>
    </div>
  );
}
