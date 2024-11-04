
import { DetailedMatchContest } from '@/types/fantasy';
import { useRouter } from 'next/navigation';
import {  Spinner } from 'react-bootstrap';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
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
   
  );
}
