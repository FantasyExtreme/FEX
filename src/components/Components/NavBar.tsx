'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import Logo from '../../assets/old-images/logo1.png';
// import Logo from 'https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/profile.png';
import Link from 'next/link';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import authMethods from '@/lib/auth';
import RingLoader from 'react-spinners/RingLoader';
import DashboardSvg from '../Icons/DashboardSvg';
import PrincipalSvg from '../Icons/PrincipalSvg';
import LogoutSvg from '../Icons/LogoutSvg';
import icontwitter from '@/assets/images/icons/icon-twitter.png';
import icondiscord from '@/assets/images/icons/icon-discord.png';
import icondiscord1 from '@/assets/images/icons/icon-discord-1.png';
import icontelegram from '@/assets/images/icons/icon-telegram.png';
import iconfb from '@/assets/images/icons/icon-facebook.png';
import iconinstagram from '@/assets/images/icons/icon-instagram.png';
import icontiktok from '@/assets/images/icons/icon-tiktok.png';
import iconlinkedin from '@/assets/images/icons/icon-linkedin.png';
import iconX from '@/assets/images/icons/iconx.png';

// import { date, object, string, number } from 'yup';
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Spinner,
  Modal,
  Dropdown,
  Offcanvas,
} from 'react-bootstrap';
import logger from '@/lib/logger';
import { toast } from 'react-toastify';
import {
  copyAccount,
  copyRefferalLink,
  formatEmail,
  getIcpRate,
  getTournaments,
  isConnected,
} from '../utils/fantasy';
import {
  copyPrincipal,
} from '@/components/utils/fantasy';
import {
  ADMIN_PLAYER_PRICES_ROUTE,
  ADMIN_ROUTE,
  ADMIN_STATS_SYSTEM_ROUTE,
  ADMIN_SYSTEM_SETTINGS_ROUTE,
  ADMIN_UPLOAD_LEAGUE_ROUTE,
  CONTESTS_ROUTE,
  DASHBOARD_ROUTE,
  MY_TEAMS_ROUTE,
  GAMEPLAYRULES_ROUTE,
  MATCHES_ROUTE,
  TEAMS_ROUTE,
  MATCH_CONTEST_ROUTE,
  TEAM_CREATION_ROUTE,
  PLAYER_PRICES_ROUTE,
  STATS_SYSTEM_ROUTE,
  ADMIN_CONTESTS_ROUTE,
  SQUAD_STATS_ROUTE,
  FANTASY_PLAYER_ROUTE,
  CONTACT_US_ROUTE,

} from '@/constant/routes';
import { makeLedgerCanister } from '@/dfx/service/actor-locator';
import { E8S, LoginEnum } from '@/constant/fantasticonst';
import { TournamentType } from '@/types/fantasy';
import { DEFAULT_MATCH_STATUS, QURIES } from '@/constant/variables';
import { usePathname, useRouter } from 'next/navigation';
import { getBalance } from '@/lib/ledger';
import ConnectModal from './ConnectModal';
import useSearchParamsHook from '../utils/searchParamsHook';
import useAuth from '@/lib/auth';
import TransferSvg from '../Icons/Transfer';
import TransferModal from './TransferModal';
import DepositSvg from '../Icons/Deposit';
import connectIcon from '@/assets/images/Alpha.png';
import connectIconBg from '@/assets/images/Rectangle 409.png';

import discordIcon from '@/assets/images/Group (1).png';

import RewardCalculatorModal from './RewardCalculatorModal';
import BottomNav from './BottomNav';
import TransferCKBTCModal from './TransferCKBTCModal';

export default function NavBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const [tournamnets, setTournaments] = useState<TournamentType | null>(null);
  const [expanded, setExpanded] = useState(false);
  const urlparama = useSearchParamsHook();
  const location = usePathname();
  const [show, setShow] = useState(false);

  const searchParams = new URLSearchParams(urlparama);
  const tournament = searchParams.get(QURIES.tournamentId);
  const { auth, userAuth, setUserAuth, setICPRate, icpRate } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
    setICPRate: (state as ConnectPlugWalletSlice).setICPRate,
    icpRate: (state as ConnectPlugWalletSlice).icpRate,


  }));
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showCKBTCTransferModal, setShowCKBTCTransferModal] = useState(false);

  const { login, logout, initAuth } = useAuth();
  const handleClose = () => {
    setIsLoading(false);
  };

  function handleShowConnect() {
    setShowConnect(true);
  }
  function handleHideConnect() {
    setShowConnect(false);
  }
  function handleShowTransferCKBTC() {
    setShowCKBTCTransferModal(true);
  }
  function handleCloseTransferCKBTC() {
    setShowCKBTCTransferModal(false);
  }
  function handleShowROI() {
    setShowROICalculator(true);
  }
  function handleHideROI() {
    setShowROICalculator(false);
  }
  // const [randomUserName, setRandomUserName] = useState<string | null>(null);

  const router = useRouter();
  const matchProps = {
    status: DEFAULT_MATCH_STATUS,
    search: '',
    page: 0,
    limit: 10,
  };

  async function sendDonation() {
    let balance = 10_000_000;
    // approveTokens(balance + GAS_FEE, auth.identity);
    const bb = await getBalance(auth.identity);
    toast.success(`go the balance ${bb}`);
    // let result = await auth.actor.payEntryFee('', balance);
  }
  const handleSelect = (e: any) => {
    setExpanded(false); // Close the navbar
    if (e !== '#calculator') {
      setShowROICalculator(false);
    }
  };

  const handleShowTokenModal = () => {
    setShowTokenModal(true);
  };
  const handleCloseTokenModal = () => {
    setShowTokenModal(false);
  };
  useEffect(() => {
    if (auth.actor) {
      getTournaments(auth.actor, matchProps, setTournaments);
    }
  }, [auth.actor]);

  useEffect(() => {
    if (auth) {
      initAuth();
    }
  }, []);
  useEffect(() => {
    const fetchICPRate = async () => {
      try {
        let icpRate = await getIcpRate();
        setICPRate(icpRate);
      } catch (error) {
      }
    };

    fetchICPRate();
  }, []);
  const handleClose10 = () => setShow(false);
  const handleShow10 = () => setShow(true);
  const toggleShow10 = () => setShow(!show);
  let getTitle = (path: string) => {
    switch (path) {
      case MATCHES_ROUTE:
        return <h1>Matches</h1>;

      case GAMEPLAYRULES_ROUTE:
        return (
          <h1>
            <span>Game</span> Rules
          </h1>
        );
      case MATCH_CONTEST_ROUTE.slice(0, -1):
        return (
          <h1>
            <span>Match</span> Contests
          </h1>
        );
      case TEAM_CREATION_ROUTE:
        return (
          <h1>
            <span>Player</span> Selection
          </h1>
        );
      case TEAMS_ROUTE:
        return <h1>Teams</h1>;
      case CONTESTS_ROUTE:
        return <h1>Contests</h1>;
      case ADMIN_ROUTE:
        return (
          <h1>
            <span>Admin</span> panel
          </h1>
        );
      case DASHBOARD_ROUTE:
        return <h1>Dashboard</h1>;
      case PLAYER_PRICES_ROUTE:
        return (
          <h1>
            <span>Player</span> Price
          </h1>
        );
      
      case ADMIN_STATS_SYSTEM_ROUTE:
        return (
          <h1>
            <span>Stats</span> System
          </h1>
        );
      case MY_TEAMS_ROUTE:
        return (
          <h1>
            <span>My</span> Teams
          </h1>
        );
      case ADMIN_CONTESTS_ROUTE:
        return (
          <h1>
            <span>Admin</span> Contests
          </h1>
        );
      case ADMIN_PLAYER_PRICES_ROUTE:
        return (
          <h1>
            <span>Player</span> Price
          </h1>
        );
      case ADMIN_UPLOAD_LEAGUE_ROUTE:
        return (
          <h1>
            <span>Upload</span> Leagues
          </h1>
        );
      case ADMIN_SYSTEM_SETTINGS_ROUTE:
        return (
          <h1>
            <span>System</span> Setting
          </h1>
        );
      case SQUAD_STATS_ROUTE:
        return (
          <h1>
            <span>Squad</span> Stats
          </h1>
        );
      case FANTASY_PLAYER_ROUTE:
        return (
          <h1>
            <span>Fantasy</span> Players
          </h1>
        );
      case CONTACT_US_ROUTE:
        return (
          <h1>
            <span>Contact</span> Us
          </h1>
        );
      default:
        return <h1>Home</h1>;
    }
  };
  return (
    <>
      <Navbar
        expand='lg'
        expanded={expanded}
        onToggle={() => {
          setExpanded(!expanded);
        }}
        className='bg-body-tertiary position-fixed'
      >
        <Container fluid>
          <div className='nav-flex'>
            <Navbar.Brand href='/' as={Link} onClick={(e) => {
              e.preventDefault()
              setShowROICalculator(false);
              router.push("/")
            }}>
              <img
                src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/logo/logo.png'
                alt='logo'
              />
            </Navbar.Brand>
            {getTitle(location)}
            <div className='d-flex align-items-center'>
              <div className='mobileview-connect-btn'>
                {isConnected(auth.state) ? (
                  <div className='user-button' onClick={toggleShow10}>
                    <img
                      src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/images.jpeg'
                      height={40}
                      width={40}
                      alt='User'
                    />
                  </div>
                ) : (
                  <Button
                    onClick={handleShowConnect}
                    disabled={auth.isLoading}
                    className='reg-btn m-1 w-loader'
                    id='connect_btn_'
                  >
                    {!auth.isLoading && 'Connect'}
                    <RingLoader size={20} loading={auth.isLoading} />
                  </Button>
                )}
                {/* {isConnected(auth.state) ? (
                  <NavDropdown
                    title={
                      <>
                        <div className='user-button'>
                          <div>
                            <h6 className='email_text'>
                              {userAuth?.name?.slice(0, 8)}
                            </h6>
                            <p className='email_text'>
                              {formatEmail(userAuth?.email ?? '')}
                            </p>
                          </div>
                          <img
                            src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/images.jpeg'
                            height={40}
                            width={40}
                            alt='User'
                          />
                        </div>
                      </>
                    }
                    id='navbarScrollingDropdown'
                  >
                    <NavDropdown.Item
                      onClick={() => copyAccount(auth.identity)}
                    >
                      <PrincipalSvg /> &emsp; Copy Wallet Address
                    </NavDropdown.Item>
                    <NavDropdown.Item
                      onClick={() => copyRefferalLink(auth.identity)}
                    >
                      <PrincipalSvg /> &emsp; Copy Refferal Link
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={handleShowTokenModal}>
                      <TransferSvg /> &emsp; Transfer ICP
                    </NavDropdown.Item>
                    <NavDropdown.Item href='#action5' onClick={logout}>
                      <LogoutSvg /> &emsp; Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <Button
                    onClick={handleShowConnect}
                    disabled={auth.isLoading}
                    className='reg-btn m-1 w-loader'
                    id='connect_btn_'
                  >
                    {!auth.isLoading && 'Connect'}
                    <RingLoader size={20} loading={auth.isLoading} />
                  </Button>
                )} */}
              </div>
              {/* <Navbar.Toggle aria-controls='navbarScroll' /> */}
              {/* <Button className='navbar-toggler' onClick={toggleShow10}>
                <img
                  src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/images.jpeg'
                  alt='User Picture'
                />
              </Button> */}
            </div>
          </div>
          <Navbar.Collapse id='navbarScroll'>
            <Nav
              className='my-lg-0 me-auto align-items-center my-2'
              style={{ maxHeight: '100vh' }}
              navbarScroll
              onSelect={handleSelect}
            >
              {isConnected(auth.state) && (
                <>
                  <Nav.Link
                    as={Link}
                    href={DASHBOARD_ROUTE}
                    active={location == DASHBOARD_ROUTE}
                  >
                    DASHBOARD
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    href={MY_TEAMS_ROUTE}
                    active={location == MY_TEAMS_ROUTE}
                  >
                    My Teams
                  </Nav.Link>
                </>
              )}

              <Nav.Link
                as={Link}
                href={MATCHES_ROUTE}
                active={location == MATCHES_ROUTE}
              >
                MATCHES
              </Nav.Link>
            
              <Nav.Link onClick={handleShowROI} href='#calculator' as={Link}>
                Rewards Calculator
              </Nav.Link>
              <div className='select-white-icon '>
                <Dropdown className='leaguesDropDown'>
                  <Dropdown.Toggle id='dropdown-basic'>LEAGUES</Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as={Link}
                      key={'LEAGUES'}
                      href={`${MATCHES_ROUTE}?tournament=`}
                    >
                      All
                    </Dropdown.Item>
                    {tournamnets?.map(([id, tournament], i) => (
                      <Dropdown.Item
                        as={Link}
                        key={id}
                        href={`${MATCHES_ROUTE}?tournament=${id}`}
                      >
                        {tournament.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              {/* {isConnected(auth.state) ? (
                <>
                  <Nav.Link as={Link} href={`${CONTESTS_ROUTE}?type=1`}>
                    My Contests
                  </Nav.Link>
                </>
              ) : null} */}
              {userAuth.userPerms?.admin && (
                <NavDropdown
                  title={
                    <>
                      <div className='user-button pointer'>Admin Panel</div>
                    </>
                  }
                  id='navbarScrollingDropdown'
                >
                  <NavDropdown.Item
                    as={Link}
                    href={ADMIN_ROUTE}
                    active={location == ADMIN_ROUTE}
                  >
                    Matches List
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    href={ADMIN_PLAYER_PRICES_ROUTE}
                    active={location == ADMIN_PLAYER_PRICES_ROUTE}
                  >
                    Player Points
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    href={ADMIN_STATS_SYSTEM_ROUTE}
                    active={location == ADMIN_STATS_SYSTEM_ROUTE}
                  >
                    Stats System
                  </NavDropdown.Item>
               
                  <NavDropdown.Item
                    as={Link}
                    href={ADMIN_UPLOAD_LEAGUE_ROUTE}
                    active={location == ADMIN_UPLOAD_LEAGUE_ROUTE}
                  >
                    Manage Data
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    href={ADMIN_SYSTEM_SETTINGS_ROUTE}
                    active={location == ADMIN_SYSTEM_SETTINGS_ROUTE}
                  >
                    System Settings
                  </NavDropdown.Item>
                </NavDropdown>
              )}
              {/* <Nav.Link
                as={Link}
                href={GAMEPLAYRULES_ROUTE}
                active={location == GAMEPLAYRULES_ROUTE}
              >
                Gameplay Rules
              </Nav.Link> */}
              <Nav.Link
                className='reg-btn discord-btn'
                target='_blank'
                href='https://discord.com/invite/3KGpJyr7Hw '
              >
                <Image src={icondiscord1} alt='Icon Discord' /> Join Discord
              </Nav.Link>
              <div className='webview-connect-btn'>
                {isConnected(auth.state) ? (
                  <div className='d-flex'>
                    {/* <Button
                      target='_blank'
                      href='https://discord.com/invite/3KGpJyr7Hw '
                      disabled={auth.isLoading}
                      className='reg-btn m-2 discord_btn'
                      id='connect_btn_'
                    >
                      <Image
                        src={discordIcon}
                        alt='discord'
                        className='discord_btn me-2'
                        height={25}
                        width={25}
                      />

                      <span>Join Discord</span>
                    </Button> */}
                    <NavDropdown
                      title={
                        <>
                          <div className='user-button'>
                            <div>
                              <h6 className='email_text'>
                                {userAuth?.name?.slice(0, 8)}
                              </h6>
                              <p className='email_text'>
                                {formatEmail(userAuth?.email ?? '')}
                              </p>
                            </div>
                            <img
                              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/images.jpeg'
                              height={40}
                              width={40}
                              alt='User'
                            />
                          </div>
                        </>
                      }
                      id='navbarScrollingDropdown'
                    >
                      <NavDropdown.Item className='big'>
                        <DepositSvg /> Deposit
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        onClick={() => copyAccount(auth.identity)}
                      >
                        <PrincipalSvg /> Copy Wallet Address
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        onClick={() => copyPrincipal(auth)}
                      >
                        <PrincipalSvg /> Copy Principal
                      </NavDropdown.Item>
                      {/* <NavDropdown.Item
                        onClick={() => copyRefferalLink(auth.identity)}
                      >
                        <PrincipalSvg />  Copy Refferal Link
                      </NavDropdown.Item> */}
                      <NavDropdown.Item className='big' onClick={handleShowTokenModal}>
                        <TransferSvg /> Transfer ICP
                      </NavDropdown.Item>{' '}
                      <NavDropdown.Item className='big' onClick={handleShowTransferCKBTC}>
                        <TransferSvg /> Transfer CKBTC
                      </NavDropdown.Item>
                      <NavDropdown.Item className='big' href='#action5' onClick={logout}>
                        <LogoutSvg /> Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </div>
                ) : (
                  <Button
                    onClick={handleShowConnect}
                    disabled={auth.isLoading}
                    className='reg-btn m-1 w-loader'
                    id='connect_btn_'
                  >
                    {/* <Image
                      src={connectIcon}
                      alt='fantasy connect'
                      className='ribben'
                      height={30}
                      width={100}
                    /> */}
                    {/* Connect */}
                    {!auth.isLoading && 'Connect'}
                    <RingLoader size={20} loading={auth.isLoading} />
                  </Button>
                )}
              </div>
              <ul className='nav-social-list'>
                <li>
                  <Link target='_blank' href='https://x.com/FExtremesports'>
                    <Image src={iconX} alt='Icon X' />
                  </Link>
                </li>
                <li>
                  <Link
                    className='rol'
                    target='_blank'
                    href='https://www.youtube.com/channel/UCXXr-1HXeZfBKc5WM3lF8YQ '
                  >
                    <i className='fa fa-youtube-play'></i>
                  </Link>
                </li>
                <li>
                  <Link
                    target='_blank'
                    href='https://www.facebook.com/FantasyExtremeSports '
                  >
                    <Image src={iconfb} alt='Icon Facebook' />
                  </Link>
                </li>
                <li>
                  <Link
                    target='_blank'
                    href='https://www.linkedin.com/company/fantasyextremesports '
                  >
                    <Image src={iconlinkedin} alt='Icon Linkedin' />
                  </Link>
                </li>
                <li>
                  <Link
                    target='_blank'
                    href='https://www.tiktok.com/@fexofficials '
                  >
                    <Image src={icontiktok} alt='Icon Tiktok' />
                  </Link>
                </li>
              </ul>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Mobile canvas menu */}
      <Offcanvas show={show} onHide={handleClose10} scroll={true}>
        <Offcanvas.Body className='overflow-hidden'>
          <Button className='custome-close-btn ' onClick={handleClose10}>
            <i className='fa fa-close'></i>
          </Button>
          <div className='spacer-10' />
          {/* <NavDropdown
            title={
              <>
                <div className='user-button'>
                  <img
                    src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/images.jpeg'
                    height={40}
                    width={40}
                    alt='User'
                  />
                  <div className='txt-pnl'>
                    <h6 className='email_text'>
                      {userAuth?.name?.slice(0, 8)}
                    </h6>
                    <p className='email_text'>
                      {formatEmail(userAuth?.email ?? '')}
                    </p>
                    <span>
                      <i className='fa fa-angle-down'></i>
                    </span>
                  </div>
                </div>
              </>
            }
            id='navbarScrollingDropdown'
          >
            <NavDropdown.Item onClick={() => copyAccount(auth.identity)}>
              <PrincipalSvg /> &emsp; Copy Wallet Address
            </NavDropdown.Item>
            <NavDropdown.Item onClick={() => copyRefferalLink(auth.identity)}>
              <PrincipalSvg /> &emsp; Copy Refferal Link
            </NavDropdown.Item>
            <NavDropdown.Item onClick={handleShowTokenModal}>
              <TransferSvg /> &emsp; Transfer ICP
            </NavDropdown.Item>
            <NavDropdown.Item href='#action5' onClick={logout}>
              <LogoutSvg /> &emsp; Logout
            </NavDropdown.Item> */}
          {/* </NavDropdown> */}
          {isConnected(auth.state) ? (
            <div className='d-flex'>
              <NavDropdown
                className='w-100'
                title={
                  <>
                    <div className='user-button '>
                      <img
                        src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/images.jpeg'
                        height={40}
                        width={40}
                        alt='User'
                      />
                      <div className='txt-pnl'>
                        <h6 className='email_text'>
                          {userAuth?.name?.slice(0, 8)}
                        </h6>
                        <p className='email_text'>
                          {formatEmail(userAuth?.email ?? '')}
                        </p>
                        <span>
                          <i className='fa fa-angle-down'></i>
                        </span>
                      </div>
                    </div>
                  </>
                }
                id='navbarScrollingDropdown'
              >
                <NavDropdown.Item className='big'>
                  <DepositSvg />   Deposit
                </NavDropdown.Item>

                <NavDropdown.Item
                  onClick={() => copyAccount(auth.identity)}
                >
                  <PrincipalSvg /> Copy Wallet Address
                </NavDropdown.Item>

                <NavDropdown.Item
                  onClick={() => copyPrincipal(auth)}
                >
                  <PrincipalSvg /> Copy Principal
                </NavDropdown.Item>
                {/* <NavDropdown.Item
                  onClick={() => copyRefferalLink(auth.identity)}
                >
                  <PrincipalSvg />  Copy Refferal Link
                </NavDropdown.Item> */}
                <NavDropdown.Item
                  className='big'
                  onClick={() => {
                    handleClose10();
                    handleShowTransferCKBTC();
                  }}
                >
                  <TransferSvg />   Transfer ICP
                </NavDropdown.Item>
                {/* <NavDropdown.Item onClick={handleShowTransferCKBTC}>
                  <TransferSvg /> &emsp; Transfer CKBTC
                </NavDropdown.Item> */}
                <NavDropdown.Item href='#action5' onClick={logout} className='big'>
                  <LogoutSvg />   Logout
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          ) : (
            <Button
              onClick={() => {
                handleClose10();
                handleShowConnect();
              }}
              // disabled={auth.isLoading}
              className='reg-btn m-1 w-loader'
              id='connect_btn_'
            >
              {/* <Image
                      src={connectIcon}
                      alt='fantasy connect'
                      className='ribben'
                      height={30}
                      width={100}
                    /> */}
              Connect
              {/* {!auth.isLoading && 'Connect'} */}
              {/* <RingLoader size={20} loading={auth.isLoading} /> */}
            </Button>
          )}
          <div className='spacer-20' />
          {isConnected(auth.state) && (
            <>
              <Nav.Link
                as={Link}
                href={DASHBOARD_ROUTE}
                active={location == DASHBOARD_ROUTE}
                onClick={handleClose10}
              >
                DASHBOARD
              </Nav.Link>
              <Nav.Link
                as={Link}
                href={MY_TEAMS_ROUTE}
                active={location == MY_TEAMS_ROUTE}
                onClick={handleClose10}
              >
                My Teams
              </Nav.Link>
            </>
          )}

          <div className='select-white-icon '>
            <Dropdown
              className='leaguesDropDown'
              onSelect={(e) => {
                handleClose10();
              }}
            >
              <Dropdown.Toggle id='dropdown-basic'>LEAGUES</Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  key={'LEAGUES'}
                  href={`${MATCHES_ROUTE}?tournament=`}
                >
                  All
                </Dropdown.Item>
                {tournamnets?.map(([id, tournament], i) => (
                  <Dropdown.Item
                    as={Link}
                    key={id}
                    href={`${MATCHES_ROUTE}?tournament=${id}`}
                  >
                    {tournament.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {/* {isConnected(auth.state) ? (
                <>
                  <Nav.Link as={Link} href={`${CONTESTS_ROUTE}?type=1`}>
                    My Contests
                  </Nav.Link>
                </>
              ) : null} */}

          {userAuth.userPerms?.admin && (
            <NavDropdown
              title={
                <>
                  <div className='user-button pointer'>Admin Panel</div>
                </>
              }
              id='navbarScrollingDropdown'
              onSelect={(e) => {
                handleClose10();
              }}
            >
              <NavDropdown.Item
                as={Link}
                href={ADMIN_ROUTE}
                active={location == ADMIN_ROUTE}
              >
                Matches List
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                href={ADMIN_PLAYER_PRICES_ROUTE}
                active={location == ADMIN_PLAYER_PRICES_ROUTE}
              >
                Player Points
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                href={ADMIN_STATS_SYSTEM_ROUTE}
                active={location == ADMIN_STATS_SYSTEM_ROUTE}
              >
                Stats System
              </NavDropdown.Item>
           
        
              <NavDropdown.Item
                as={Link}
                href={ADMIN_UPLOAD_LEAGUE_ROUTE}
                active={location == ADMIN_UPLOAD_LEAGUE_ROUTE}
              >
                Manage Data
              </NavDropdown.Item>
              <NavDropdown.Item
                as={Link}
                href={ADMIN_SYSTEM_SETTINGS_ROUTE}
                active={location == ADMIN_SYSTEM_SETTINGS_ROUTE}
              >
                System Settings
              </NavDropdown.Item>
            </NavDropdown>
          )}
          {/* <Nav.Link
            as={Link}
            href={CONTACT_US_ROUTE}
            active={location == CONTACT_US_ROUTE}
            onClick={handleClose10}
          >
            Contact Us
          </Nav.Link> */}
          <Nav.Link
            as={Link}
            href={GAMEPLAYRULES_ROUTE}
            active={location == GAMEPLAYRULES_ROUTE}
            onClick={handleClose10}
          >
            Game Rules
          </Nav.Link>
          <ul className='nav-social-list'>
            <li>
              <Link target='_blank' href='https://x.com/FExtremesports'>
                <Image src={iconX} alt='Icon X' />
              </Link>
            </li>
            <li>
              <Link
                className='rol'
                target='_blank'
                href='https://www.youtube.com/channel/UCXXr-1HXeZfBKc5WM3lF8YQ '
              >
                <i className='fa fa-youtube-play'></i>
              </Link>
            </li>
            <li>
              <Link
                target='_blank'
                href='https://www.facebook.com/FantasyExtremeSports '
              >
                <Image src={iconfb} alt='Icon Facebook' />
              </Link>
            </li>
            <li>
              <Link
                target='_blank'
                href='https://www.linkedin.com/company/fantasyextremesports '
              >
                <Image src={iconlinkedin} alt='Icon Linkedin' />
              </Link>
            </li>
            <li>
              <Link
                target='_blank'
                href='https://www.tiktok.com/@fexofficials '
              >
                <Image src={icontiktok} alt='Icon Tiktok' />
              </Link>
            </li>
            <li>
              <Nav.Link
                className='reg-btn discord-btn'
                target='_blank'
                href='https://discord.com/invite/3KGpJyr7Hw '
              >
                <Image src={icondiscord1} alt='Icon Discord' /> Join Discord
              </Nav.Link>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
      {/* Mobile canvas menu */}

      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={() => { }}
      />
      <TransferModal
        showTokenModal={showTokenModal}
        handleCloseTokenModal={handleCloseTokenModal}
      />
      <TransferCKBTCModal
        showTokenModal={showCKBTCTransferModal}
        handleCloseTokenModal={handleCloseTransferCKBTC}
      />
      {showROICalculator && <RewardCalculatorModal
        show={showROICalculator}
        handleClose={handleHideROI}
        icpRate={icpRate}
      />}
      <BottomNav handleShowROI={handleShowROI} location={location} auth={auth} />
    </>
  );
}
