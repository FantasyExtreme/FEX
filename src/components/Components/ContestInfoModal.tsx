import { GAS_FEE, GAS_FEE_ICP, LoginEnum } from '@/constant/fantasticonst';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import NFIDLogo from '@/assets/tempImages/NFID.png';
import ConnectII from '@/assets/tempImages/ConnectII.png';
import ConnectNFID from '@/assets/tempImages/ConnectNFID.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import authMethods from '@/lib/auth';
import {
  ContestInfoType,
  DefaultContestParticipants,
} from '@/constant/variables';
import logger from '@/lib/logger';
import CenteredSpinner from './CenteredSpinner';
import { fromE8S } from '@/lib/ledger';
import { GetProps } from '@/types/fantasy';
import { getRewardsTable } from '../utils/fantasy';
import { debounce as lDebounce } from 'lodash';
import PaginatedList from './Pagination';
import RankRewardsList from './RankRewardsList';

interface Props {
  show: boolean;
  hide: () => void;
  text: string[];
  type: ContestInfoType;
  entryFee: number;
  totalParticipants: number;
  auth: any;
}

function ContestInfoModal({
  show,
  hide,
  type,
  text,
  entryFee,
  auth,
  totalParticipants,
}: Props) {
  const [loading, setLoading] = useState(false);
  const navigation = useRouter();
  const [offset, setOffset] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [rewardsMap, setRewardsMap] = useState<null | [bigint, bigint][]>(null);
  const [pageCount, setPageCount] = useState<number>(0);

  const [calculatorData, setCalculatorData] = useState({
    totalParticipants: DefaultContestParticipants,
    entryFee: fromE8S(entryFee),
    prizePool: 0,
    prizePoolInUSD: '0',
  });

  const defaultProps = {
    status: '0',
    search: '',
    page: 0,
    limit: 10,
  };

  function pageClicked(pageNumber: number) {
    setOffset(pageNumber);
    handleGetRewards({ ...defaultProps, page: pageNumber });
  }
  function handleGetRewards(
    props?: GetProps,
    data?: { entryFee: number; totalParticipants: number },
  ) {
    const currentPage = props?.page ?? 0;
    setOffset(currentPage);
    const search = props?.search ?? '';
    const _props = props ?? defaultProps;
    setSearchString(search);
    getRewardsTable({
      actor: auth.actor,
      props: { ..._props, search },
      entryFee: data ? data.entryFee : Number(calculatorData.entryFee),
      slotsUsed: data
        ? Number(data.totalParticipants)
        : Number(calculatorData.totalParticipants),
      set: setRewardsMap,
      setPageCount,
      setLoading,
    });
  }
  const debouncedSearch = lDebounce(async (value: string) => {
    setOffset(0);
    if (value) {
      handleGetRewards({ ...defaultProps, search: value, page: 0 });
    } else {
      handleGetRewards({ ...defaultProps, page: 0 });
    }
  }, 1000);
  const handleSearch = (e: any) => {
    e.persist(); // Persist the event for debounce to work correctly with React synthetic events
    debouncedSearch(e.target.value);
    setSearchString(e.target.value.trim());
  };
  useEffect(() => {
    if (ContestInfoType.rewardDistribution == type) {
      handleGetRewards(defaultProps, {
        entryFee: entryFee,
        totalParticipants: totalParticipants,
      });
    }
  }, [entryFee, totalParticipants, type]);

  return (
    <Modal
      //   backdrop={isLoading ? 'static' : true}
      show={show}
      centered
      onHide={hide}
    >
      <Modal.Body>
        <h5 className='text-center'>
          {type == ContestInfoType.rules ? (
            <>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/icon-book.png'
                alt='Ion Book'
              />
              Rules
            </>
          ) : (
            'Reward Distribution'
          )}
        </h5>
        {type == ContestInfoType.rules ? (
          <div className=' my-4'>
            {text?.map((item, index) => (
              <span className='d-flex justify-content-between'>
                {item.split(':').map((splitedItem) => (
                  <p>{splitedItem}</p>
                ))}
              </span>
            ))}
          </div>
        ) : (
          <RankRewardsList
            handleSearch={handleSearch}
            rewardsMap={rewardsMap}
            loading={loading}
            pageClicked={pageClicked}
            offset={offset}
            pageCount={pageCount}
            limit={defaultProps.limit}
            isContestInfoModle={true}
          />
        )}
        <div className='d-flex justify-content-center'>
          <Button
            id='cancelBtn'
            className='reg-btn trans-white mid text-capitalize mx-auto mt-5'
            onClick={hide}
          >
            Close
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ContestInfoModal;
