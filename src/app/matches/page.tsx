'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Button,
  Form,
} from 'react-bootstrap';
import Image from 'next/image';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useRouter } from 'next/navigation';
import {
  getMatches,
  getTournaments,
} from '@/components/utils/fantasy';
import {
  LoadingState,
  MatchesCountType,
  MatchesType,
  TournamentType,
} from '@/types/fantasy';
import {
  DEFAULT_MATCH_STATUS,
  MatchStatuses,
  QURIES
  
} from '@/constant/variables';

import MatchTable from '@/components/Components/MatchTable';
import CarouselSlider from '@/components/Components/CalenderSlider';
import MatchesPagination from '@/components/Components/MatchesPagination';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import calander from '@/assets/images/calender.png';
import DatePicker from 'react-date-picker';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function Matches() {
  const urlparama = useSearchParamsHook();
  const searchParams = new URLSearchParams(urlparama);
  const [matchTab, setMatchTab] = useState<string>(DEFAULT_MATCH_STATUS);
  const [selectedTime, setSelectedTime] = useState<null | number>(null);
  const [tournamnets, setTournaments] = useState<TournamentType | null>(null);
  const [value, onChange] = useState<Value>(new Date());
  const childRef = useRef<any>(null);

  // const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const tournamentId = searchParams.get(QURIES.tournamentId);
  const [loading, setLoading] = useState<LoadingState>({
    upcoming: true,
    ongoing: true,
    finished: true,
  });
  const [matches, setMatches] = useState<MatchesType>({
    upcoming: null,
    ongoing: null,
    finished: null,
  });
  const [offset, setOffset] = useState<MatchesCountType>({
    upcoming: 0,
    ongoing: 0,
    finished: 0,
  });

  const [pageCount, setPageCount] = useState<MatchesCountType>({
    upcoming: 0,
    ongoing: 0,
    finished: 0,
  });

  const matchProps = {
    status: DEFAULT_MATCH_STATUS,
    search: '',
    page: 0,
    limit: 10,
  };
  // const [tournamentId, selectTournamentId] = useState<string | null>(null);
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const router = useRouter();
  /**
   * Get matches according to status
   * @param {MATCH_STATUS_TYPE} status The status of match
   */
  async function getStatusMatches(status: string, Id: string | null) {
    getMatches(
      auth.actor,
      setMatches,
      { ...matchProps, status, page: 0 },
      setLoading,
      setPageCount,
      [],
      Id ? Id : null,
    );
  }
  const callChildMethod = () => {
    if (childRef.current) {
      childRef.current.updateActiveIndex(); // Call the child method
    } 
  };
  /**
   * Select the tab and get matches according to status
   * @param tab The status of match (which is being used as the keys of tabs)
   * @returns
   */
  function changeTab(tab: string | null) {
    if (!tab) return;
    // if (selectedTime !== prevSelectedTime) {
      callChildMethod(); 
      // setPrevSelectedTime(selectedTime);
    // }
    setSelectedTime(null);
    const params = new URLSearchParams(searchParams.toString());
    params.set(QURIES.matchTab, tab);
    window.history.pushState(null, '', `?${params.toString()}`);

    if (tab == MatchStatuses.upcoming && !matches.upcoming) {
      getStatusMatches(MatchStatuses.upcoming, tournamentId);
    } else if (tab == MatchStatuses.ongoing && !matches.ongoing) {
      getStatusMatches(MatchStatuses.ongoing, tournamentId);
    } else if (tab == MatchStatuses.finished && !matches.finished) {
      getStatusMatches(MatchStatuses.finished, tournamentId);
    }
    setMatchTab(tab);
  }
  /**
   * changeOffset use for change offset
   * @param pageNumber
   */
  function changeOffset(pageNumber: number) {
    switch (matchTab) {
      case MatchStatuses.upcoming:
        setOffset((prev: MatchesCountType) => ({
          ...prev,
          upcoming: pageNumber,
        }));
        break;
      case MatchStatuses.ongoing:
        setOffset((prev: MatchesCountType) => ({
          ...prev,
          ongoing: pageNumber,
        }));
        break;
      case MatchStatuses.finished:
        setOffset((prev: MatchesCountType) => ({
          ...prev,
          finished: pageNumber,
        }));
        break;
      default:
        setOffset((prev: MatchesCountType) => ({
          ...prev,
          upcoming: pageNumber,
        }));
        break;
    }
  }
  /**
   * pageClicked use to get items of selected page
   * @param pageNumber
   * @returns
   */
  function pageClicked(pageNumber: number) {
    if (!auth.actor) return;
    changeOffset(pageNumber);
    getMatches(
      auth.actor,
      setMatches,
      {
        ...matchProps,
        status: matchTab,
        page: pageNumber,
      },
      setLoading,
      setPageCount,
      selectedTime ? [selectedTime] : [],
      tournamentId ? tournamentId : null,
    );
  }

  let getMatchOfSelectedDate = (time: number) => {
 
    if (!auth.actor) return;
    setSelectedTime(time);
    getMatches(
      auth.actor,
      setMatches,
      {
        ...matchProps,
        status: matchTab,
        page: 0,
      },
      setLoading,
      setPageCount,
      [time],
      tournamentId ? tournamentId : null,
    );
    setOffset({
      upcoming: 0,
      ongoing: 0,
      finished: 0,
    });
    setPageCount({
      upcoming: 0,
      ongoing: 0,
      finished: 0,
    });
  };

  /**
   * Fetches and sets the matches for the selected tournament.
   *
   * @param {string} tournamentId - The ID of the tournament to fetch matches for.
   */
  function selectTournament(Id: string) {
    changeOffset(0);
    const currentUrl = new URL(window.location.href);
    const currentParams = new URLSearchParams(currentUrl.search);
    currentParams.set(QURIES.tournamentId, Id);
    const newUrl = `${currentUrl.pathname}?${currentParams.toString()}`;
    router.push(newUrl);
    getMatches(
      auth.actor,
      setMatches,
      {
        ...matchProps,
        status: matchTab,
        page: 0,
      },
      setLoading,
      setPageCount,
      selectedTime ? [selectedTime] : [],
      Id ? Id : null,
    );
  }

  const handleDateChange = (date: Value) => {
    if (Array.isArray(date)) {
      const [startDate, endDate] = date;
      const startMilliseconds = startDate ? startDate.getTime() : null;
      if(startMilliseconds)  getMatchOfSelectedDate(startMilliseconds)
    } else if (date) {
      const utcMilliseconds = date.getTime();    
      getMatchOfSelectedDate(utcMilliseconds)
    }
    onChange(date);
  };
  let tempTab = searchParams.get(QURIES.matchTab);
  useEffect(() => {
    let tempTab = searchParams.get(QURIES.matchTab);
    if (tempTab) setMatchTab(tempTab);
    changeTab(tempTab)
  }, [tempTab]);
  useEffect(() => {
    
    if (auth.actor) {
      let tempTab = searchParams.get(QURIES.matchTab);
      if (tempTab) setMatchTab(tempTab);
      getMatches(
        auth.actor,
        setMatches,
        {
          ...matchProps,
          status: tempTab ?? DEFAULT_MATCH_STATUS,
        },
        setLoading,
        setPageCount,
         [],
        tournamentId ? tournamentId : null,
      );
      getTournaments(auth.actor, matchProps, setTournaments);
    }
  }, [auth.actor]);

  return (
    <>
      <Container fluid className='inner-page'>
        <Row>
          <Container>
            <Row>

              <Col xl='12' lg='12' md='12'>
                <div className='calender-details-continer'>
                  <h2 className='animedown tablet-view-none'>
                    <span>MATCHES</span>
                  </h2>
                  <div className='select-white-icon tablet-w-100 animedown'>
                    <Form.Select
                      aria-label='Default select example'
                      size='lg'
                      className='mySelectBtn'
                      // defaultValue='default'
                      value={tournamentId ?? ''}
                      onChange={(e) => {
                        //   selectTournament(e.target.value);
                        //   // selectTournamentId(e.target.value);
                        //   router.push(
                        //     `${MATCHES_ROUTE}?tournament=${e.target.value}`,
                        //   );
                        // }}
                        const selectedValue = e.target.value;
                        selectTournament(selectedValue);
                     
                        // router.push(
                        //   `${MATCHES_ROUTE}?tournament=${selectedValue}`,
                        // );
                      }}
                    >
                      <option value=''>Leagues</option>
                      {tournamnets?.map(([id, tournament], i) => (
                        <option
                          key={id}
                          value={id}
                          // selected={id == tournamentId}
                        >
                          {tournament.name}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                  <div className='mobile-view'>
                    {MatchStatuses.ongoing !=
                      (tempTab ?? DEFAULT_MATCH_STATUS) && (
                      <Button className='trans '>
                        <DatePicker
                          onChange={handleDateChange}
                          value={value}
                          clearIcon={null}
                          calendarAriaLabel={undefined}
                          calendarIcon={<Image src={calander} alt='calender' />}
                        />
                      </Button>
                    )}
                  </div>
                </div>

                <div className='spacer-30' />
                <div className='gray-panel web-view-trans'>
                  <div className='calender-tabs-panel'>
                    <div
                      className={`Calender-chart ${
                        MatchStatuses.ongoing ==
                        (tempTab ?? DEFAULT_MATCH_STATUS)
                          ? 'invisible remove-tranisiton'
                          : 'visible'
                      }`}
                    >
                      <CarouselSlider
                        getSelectedDate={getMatchOfSelectedDate}
                        myuseRef={childRef}
                      />
                    </div>

                    <Tabs
                      activeKey={matchTab}
                      onSelect={changeTab}
                      className='mb-5 tabbb'
                    >
                      <Tab eventKey={MatchStatuses.upcoming} title='Upcoming'>
                        <MatchTable
                          loading={loading.upcoming}
                          tab={matchTab}
                          groupMatches={matches?.upcoming}
                          admin={userAuth.userPerms?.admin}
                 
                        />
                      </Tab>
                      <Tab eventKey={MatchStatuses.ongoing} title='In Progress'>
                        <MatchTable
                          loading={loading.ongoing}
                          tab={matchTab}
                          groupMatches={matches?.ongoing}
                          admin={userAuth.userPerms?.admin}
                     
                        />
                      </Tab>
                      <Tab eventKey={MatchStatuses.finished} title='Completed'>
                        <MatchTable
                          loading={loading.finished}
                          tab={matchTab}
                          groupMatches={matches?.finished}
                          admin={userAuth.userPerms?.admin}
                       
                        />
                      </Tab>
                    </Tabs>
                  </div>
                  <MatchesPagination
                    matchTab={matchTab}
                    pageCount={pageCount}
                    offset={offset}
                    pageClicked={pageClicked}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    </>
  );
}
