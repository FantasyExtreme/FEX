'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import authMethods from '@/lib/auth';
import RingLoader from 'react-spinners/RingLoader';
import PrincipalSvg from '../Icons/PrincipalSvg';
import LogoutSvg from '../Icons/LogoutSvg';

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
  formatEmail,
  getTournaments,
  isConnected,
} from '../utils/fantasy';
import {
  copyPrincipal,
} from '@/components/utils/fantasy';
import {
  GAMEPLAYRULES_ROUTE,
  MATCHES_ROUTE,
  CONTACT_US_ROUTE,
  DASHBOARD_ROUTE,
  ADMIN_ROUTE,
  ADMIN_PLAYER_PRICES_ROUTE,
  ADMIN_STATS_SYSTEM_ROUTE,
  ADMIN_UPLOAD_LEAGUE_ROUTE,
  ADMIN_SYSTEM_SETTINGS_ROUTE
} from '@/constant/routes';
import { TournamentType } from '@/types/fantasy';
import { DEFAULT_MATCH_STATUS, QURIES } from '@/constant/variables';
import { usePathname, useRouter } from 'next/navigation';
import ConnectModal from './ConnectModal';
import useSearchParamsHook from '../utils/searchParamsHook';
import useAuth from '@/lib/auth';


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
  const { auth, userAuth, setUserAuth} = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
   


  }));
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

  // const [randomUserName, setRandomUserName] = useState<string | null>(null);

  const router = useRouter();
  const matchProps = {
    status: DEFAULT_MATCH_STATUS,
    search: '',
    page: 0,
    limit: 10,
  };

  const handleSelect = (e: any) => {
    setExpanded(false); // Close the navbar
   
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
            <Navbar.Brand href='/' as={Link} >
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
                
              </div>
         
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
                  
                </>
              )}

              <Nav.Link
                as={Link}
                href={MATCHES_ROUTE}
                active={location == MATCHES_ROUTE}
              >
                MATCHES
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
          
              <Nav.Link
                as={Link}
                href={GAMEPLAYRULES_ROUTE}
                active={location == GAMEPLAYRULES_ROUTE}
              >
                Gameplay Rules
              </Nav.Link>
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
                    
                    {!auth.isLoading && 'Connect'}
                    <RingLoader size={20} loading={auth.isLoading} />
                  </Button>
                )}
              </div>
            
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
            
              Connect
           
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
          <Nav.Link
            as={Link}
            href={GAMEPLAYRULES_ROUTE}
            active={location == GAMEPLAYRULES_ROUTE}
            onClick={handleClose10}
          >
           Game Rules
          </Nav.Link>
       
        </Offcanvas.Body>
      </Offcanvas>
      {/* Mobile canvas menu */}

      <ConnectModal
        show={showConnect}
        hideModal={handleHideConnect}
        callBackfn={() => {}}
      />

   </>
  );
}
