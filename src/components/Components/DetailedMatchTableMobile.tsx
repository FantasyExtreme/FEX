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
import MatchWithTeamsMobile from './MatchWithTeamsMobile';

export default function DetailedMatchTableMobile({
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
    <>
      <div className=''>
        <div className='table-inner-container med-table-height'>
          {loading && (
            <div className='d-flex justify-content-center'>
              <Spinner animation='border' />
            </div>
          )}
              {!loading && (matches?.length == 0 || !matches) ?(
            <div className='d-flex justify-content-center'>
              {' '}
              <p className='text-white'>No Teams Found</p>
            </div>
              ):
          
            matches?.map((match, index) => (
              <MatchWithTeamsMobile
                key={index}
                identity={auth.identity}
                match={match}
                actor={auth.actor}
                handleGetAssets={handleGetAssets}
                dashboard={dashboard}
              />
            ))}
        </div>
      </div>
    </>
  );
}
