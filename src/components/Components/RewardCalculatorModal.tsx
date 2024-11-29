import React, { useCallback, useState, useEffect } from 'react';

import { Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import logger from '@/lib/logger';
import {
  debounce,
  getContestTypes,
  getPrizePool,
  getRewardsTable,
} from '../utils/fantasy';
import {
  RContestType,
  RContestTypes,
} from '@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did';
import {
  DefaultContestParticipants,
  DefaultContestType,
} from '@/constant/variables';
import { fromE8S } from '@/lib/ledger';
import { GetProps } from '@/types/fantasy';
import PaginatedList from './Pagination';
import CenteredSpinner from './CenteredSpinner';
import { debounce as lDebounce } from 'lodash';
import { MAX_PARTICIPANTS } from '@/constant/validations';
import { toast } from 'react-toastify';
import RankRewardsList from './RankRewardsList';
// import { AccountIdentifier } from '@dfinity/ledger-icp';

function RewardCalculatorModal({
  show,
  handleClose,
  defaultContest,
  icpRate
}: {
  show: boolean;
  handleClose: () => void;
  icpRate:number,
  defaultContest?: { name: string; entryFee: number; participants: number };
}) {
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState('');
  const [contestTypes, setContestTypes] = useState<null | RContestTypes>(null);
  const [rewardsMap, setRewardsMap] = useState<null | [bigint, bigint][]>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [offset, setOffset] = useState(0);

  const [selectedContest, setSelectedContest] = useState<null | RContestType>(
    null,
  );
  const [calculatorData, setCalculatorData] = useState({
    totalParticipants: DefaultContestParticipants,
    entryFee: fromE8S(selectedContest?.entryFee),
    prizePool: 0,
    prizePoolInUSD: '0',
  });

  const defaultProps = {
    status: '0',
    search: '',
    page: 0,
    limit: 10,
  };
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  /**
   * Converts a prize pool amount to its equivalent value in USD.
   *
   * @param pool - The prize pool amount to be converted.
   *  The prize pool amount in USD, rounded to two decimal places
   */
  const getPrizePoolInUSD = (pool: number) => {
    return (pool * icpRate).toFixed(2);
  };
  /**
   * Get rewards data from Motoko
   * @param props Default props for query
   * @param data entry fee and totalparticipants
   */
  const handleGetRewards = useCallback(
    (
      props?: GetProps,
      data?: { entryFee: number; totalParticipants: number },
    ) => {

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
    },
    [auth.actor, calculatorData], // Assuming the dependencies are stable, ensure this function is stable
  );

  /**
   * Handles the selection of a contest type and updates related data.//+
   *
   * @param id - The unique identifier of the contest type to be selected.//+
   *
   * @returns {Promise<void>} - A promise that resolves when the contest type selection is complete.//+
   */
  async function selectContest(id: string) {
    let contest: undefined | RContestType = contestTypes?.find(
      (contest) => contest.id == id,
    );
    setSelectedContest(contest ?? null);
    let entryFee = fromE8S(contest?.entryFee ?? 0);
    let pool = getPrizePool(
      entryFee,
      userAuth.rewardPercentage,
      calculatorData.totalParticipants,
    );
    let prizePoolInUSD = getPrizePoolInUSD(pool);
    handleGetRewards(undefined, {
      entryFee: entryFee,
      totalParticipants: calculatorData.totalParticipants,
    });
    setCalculatorData((prev) => ({
      ...prev,
      entryFee: entryFee,
      prizePool: pool,
      prizePoolInUSD,
    }));
  }
  function handleGetContestTypes() {
    getContestTypes({ actor: auth.actor, set: setContestTypes, all: false });
  }
  /**
   * Handles the change event for the reward calculator inputs, updating the prize pool and prize pool in USD accordingly.
   * @param e The event object containing the target element's name and value
   * @returns void
   */
  const handleCalculatorChange = lDebounce(async (e: any) => {
    try {
      let pool = calculatorData.prizePool;
      if (e.target.name == 'entryFee') {
        handleGetRewards(undefined, {
          entryFee: e.target.value,
          totalParticipants: calculatorData.totalParticipants,
        });
        pool = getPrizePool(
          e.target.value,
          userAuth.rewardPercentage,
          calculatorData.totalParticipants,
        );
      } else if (e.target.name == 'totalParticipants') {
        handleGetRewards(undefined, {
          entryFee: calculatorData.entryFee,
          totalParticipants: e.target.value,
        });
        pool = getPrizePool(
          calculatorData.entryFee,
          userAuth.rewardPercentage,
          e.target.value,
        );
      }
      let prizePoolInUSD = getPrizePoolInUSD(pool);
      setCalculatorData((prev) => ({
        ...prev,
        prizePoolInUSD,
        [e.target.name]: [e.target.value],
        prizePool: pool,
      }));
    } catch (error) {
      logger(error, 'change calculation error');
    }
  }, 1000);

  // Wrapper function to handle the event
  function handleCalculatorChangeWrapper(e: any) {
    const value = e.target.value;
    if (value === '') {
      toast.warning("You can't check rewards for less than 1 participant");
      setCalculatorData((prev) => ({
        ...prev,
        [e.target.name]: [''], 
      }));
      return; 
    }
    if (value === '0') {    
      toast.warning("You can't check rewards for less than 1 participant");
      setCalculatorData((prev) => ({
        ...prev,
        [e.target.name]: [value],
      }));
      return; 
    }
    if (value > MAX_PARTICIPANTS) {
      return toast.warning(
        "You can't check rewards for more than " +
          MAX_PARTICIPANTS + ' participants');
    }
    if (value < 1) {
      return toast.warning(
        "You can't check rewards for less than 1 participant"
      );
    }
    e.persist(); // Persist the event for debounce to work correctly with React synthetic events
    setCalculatorData((prev) => ({
      ...prev,
      [e.target.name]: [value],
    }));
    handleCalculatorChange(e);
  }
  
  async function setInitialData(contestTypes: RContestTypes) {
    let finder = defaultContest?.name ?? DefaultContestType;
    let totalParticipants =
      defaultContest?.participants ?? DefaultContestParticipants;

    const _contest =contestTypes.find((contest) => contest.name.toLocaleLowerCase() == finder.toLocaleLowerCase()) ?? null;
    if (!_contest) {
      return;
    }
    // contestTypes.find((contest) => contest.name == DefaultContestType) ?? null;
    setSelectedContest(_contest);
    let entryFee = fromE8S(_contest?.entryFee ?? 0);
    handleGetRewards(undefined, {
      entryFee: entryFee,
      totalParticipants,
    });
    let pool = getPrizePool(
      entryFee,
      userAuth.rewardPercentage,
      totalParticipants,
    );

    let prizePoolInUSD = getPrizePoolInUSD(pool);
    setCalculatorData((prev) => ({
      ...prev,
      totalParticipants,
      entryFee: entryFee,
      prizePool: pool,
      prizePoolInUSD,
    }));
  }
  function pageClicked(pageNumber: number) {
    setOffset(pageNumber);
    handleGetRewards({ ...defaultProps, page: pageNumber });
  }
  const debouncedSearch = useCallback(
    lDebounce((value: string) => {
      setOffset(0);
      if (value.trim()) {
        handleGetRewards({ ...defaultProps, search: value.trim(), page: 0 });
      } else {
        handleGetRewards({ ...defaultProps, page: 0 });
      }
    }, 1000),
    [handleGetRewards],
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchString(value);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );
  useEffect(() => {
    if (contestTypes) {
      setInitialData(contestTypes);
    }
  }, [contestTypes]);

  useEffect(() => {
    if (!auth.actor) return;
    handleGetContestTypes();
    handleGetRewards();
  }, [auth]);
  useEffect(() => {
 
    if (show) {   // Reset calculator data to default values when modal opens
      let pool = getPrizePool(
      fromE8S(selectedContest?.entryFee),
        userAuth.rewardPercentage,
         defaultContest?.participants ?? DefaultContestParticipants,
      );
  
      let prizePoolInUSD = getPrizePoolInUSD(pool);
      setCalculatorData({
        totalParticipants: defaultContest?.participants ?? DefaultContestParticipants,
        entryFee: fromE8S(selectedContest?.entryFee),
        prizePool: pool, 
        prizePoolInUSD, 
      });
      handleGetRewards()
    }
  }, [show, defaultContest]);
  return (
    <Modal
      className='max-h-modal'
      centered
      show={show}
      onHide={handleClose}
      onClose={handleClose}
    >
      <Modal.Body>
        <Container>
          <h5 className='Nasalization'>
            Rewards <span>Calculator</span>
          </h5>
          <div className='mt-4'>
            <Row>
              <Col xl="12">
                  <Form.Group className='my-2 mt-4'>
                  <div className='d-flex justify-content-between w-100'>
                    <Form.Label>{'Total Participants'}</Form.Label>
                  </div>
                  <Form.Control
                    type='number'
                    placeholder={'Total Participants'}
                    name='totalParticipants'
                    value={calculatorData.totalParticipants}
                    max={1_000_000}
                    min={0}
                    onChange={handleCalculatorChangeWrapper}
                  />
                </Form.Group>
              </Col>

              <Col xl="6" lg="6" md="6" sm="6">
                <Form.Group className='my-2 mt-4' style={{ flexGrow: 1 }}>
                  <div className='d-flex justify-content-between grow w-100'>
                    <Form.Label>{'Select Contest'}</Form.Label>
                  </div>
                  <Form.Select
                  style={{height: '50px', maxWidth: 'unset'}}
                    className='button-select w-100 disabled-field'
                    aria-label='Default select example'
                    disabled={defaultContest && defaultContest?.entryFee > 0}
                    onChange={(e) => {
                      // setIsSubstituteSelection(false);
                      // setSelectedformation(e.target.value);
                      // handleFormationSelect(e.target.value);
                      // resetPlayers(true);
                      selectContest(e.target.value);
                    }}

                    // style={{ zIndex: '100000000' }}
                  >
                    {contestTypes?.map((contest) => {
                      return (
                        <option
                          key={contest.id}
                          value={contest.id}
                          selected={selectedContest?.id == contest.id}
                        >
                          {/* {`${formation.defender}-${formation.midfielder}-${formation.forward}`} */}
                          {contest.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xl="6" lg="6" md="6" sm="6">
                <Form.Group className='my-2 mt-4'>
                  <div className='d-flex justify-content-between w-100'>
                    <Form.Label>{'Entry Fee'}</Form.Label>
                  </div>
                  <Form.Control
                    type='text'
                    // disabled={defaultContest && defaultContest?.entryFee > 0}
                    disabled={true}
                    placeholder={'Entry Fee'}
                    className='disabled-field'
                    name='entryFee'
                    value={calculatorData.entryFee}
                    onChange={handleCalculatorChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className='d-flex justify-content-between align-items-center'>
              
              {/* </div> */}

              
            </div>

            <div className='divider' />
            <div className='pool-container '>
              <h6>Pool Amount</h6>
              <div className='amount-div'>
                <img
                  src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/infinte.png'
                  alt='Infinte Logo'
                />
                <h5>
                  {calculatorData.prizePool} = ${calculatorData.prizePoolInUSD}
                </h5>
              </div>
            </div>
            {/* <div className='btn-list-div'>
            <Button
              className='reg-btn trans-white'
              disabled={loading}
              onClick={handleClose}
            >
              {'Cancel'}
            </Button>
            <Button className='reg-btn' disabled={loading} type='submit'>
              {loading ? <Spinner size='sm' /> : 'Transfer'}
            </Button>
          </div> */}
          </div>
          <h5 className='Nasalization mt-3'>
            Rewards <span>by Rank</span>
          </h5>
          <RankRewardsList
            handleSearch={handleSearch}
            rewardsMap={rewardsMap}
            loading={loading}
            pageClicked={pageClicked}
            offset={offset}
            pageCount={pageCount}
            limit={defaultProps.limit}
          />
        </Container>
      </Modal.Body>
    </Modal>
  );
}

export default RewardCalculatorModal;
