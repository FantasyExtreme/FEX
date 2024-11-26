'use client';
import React, { useEffect, useRef, useState } from 'react';

import Link from 'next/link';
import { Container, Row, Col, Table, Button } from 'react-bootstrap';

import freeicon from '@/assets/images/icons/icon-free.png';
import bronzeicon from '@/assets/images/icons/icon-bronze.png';
import goldicon from '@/assets/images/icons/icon-gold.png';
import coinicon from '@/assets/images/icons/coin-icon.png';
import tethericon from '@/assets/images/icons/tether-icon.png';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import user2 from '@/assets/images/user2.png';
import user3 from '@/assets/images/user3.png';
import cup from '@/assets/images/icons/cup-1.png';
import cup1 from '@/assets/images/teams/team-bestfoot.png';
import cup2 from '@/assets/images/teams/team-soccer.png';
import userImage from '@/assets/images/user3.png';
import Tippy from '@tippyjs/react';
export default function content() {
  const mvpsslider = useRef(null);
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 992 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 991, min: 767 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 767, min: 0 },
      items: 1,
    },
  };
  var settings = {
    dots: true,
    infinite: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 0,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: false,
        },
      },
    ],
  };

  return (
    <>
      <div className='spacer-50' />
      <div className='spacer-50' />
      <div className='spacer-50' />
      <div className='spacer-50' />

      <Container fluid>
        <Row>
          <Container>
            <Row>
              <Col xl='12'>
                <div className='mobile-match-post' style={{ display: 'block' }}>
                  <div className='match-post-header'>
                    <div className='flex-div'>
                      <h6>
                        <Image src={tethericon} alt='Icon paris' />
                        Borussia Dortmund
                      </h6>
                      <h6 className='color'>10h : 28m : 13s</h6>
                      <h6>
                        <Image src={tethericon} alt='Icon paris' />
                        Borussia Dortmund
                      </h6>
                    </div>
                    <p>
                      {' '}
                      Yellow Dragon waly
                      <span>HonoLolo</span>
                    </p>
                  </div>
                  <div className='match-post-footer'>
                    <Link
                      href='#'
                      className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
                    >
                      Create Contest
                    </Link>

                    <Link
                      href='#'
                      className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
                    >
                      View Contests
                    </Link>
                  </div>
                </div>

                <div className='mobile-match-post' style={{ display: 'block' }}>
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
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Contest Panel */}
      <Container fluid>
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <div className='package-contest-big'>
                  <div className='package-contest-post-main'>
                    <div className='package-contest-post'>
                      <div className='package-contest-post-inner'>
                        <div className='contest-info'>
                          <Image src={freeicon} alt='img' /> Free Contest
                        </div>
                        <div className='post-heading-info'>
                          <div className='img-pnl'>
                            <Image className='small' src={coinicon} alt='img' />
                            <Image src={tethericon} alt='img' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>Free Contest</h6>
                            <span>Entry Fee: 0 ICP</span>
                          </div>
                        </div>
                        <ul className='calculate-list'>
                          <li>
                            <p>Roi:</p>
                            <p>
                              <i className='fa fa-rocket color'></i> Calculate
                              ROI <i className='fa fa-calculator'></i>
                            </p>
                          </li>
                          <li>
                            <p>Participants</p>
                            <p>15</p>
                          </li>
                        </ul>
                        <Link href='#' className='reg-btn'>
                          Join Contest
                        </Link>

                        <div className='table-p'>
                          <div className='text-center'>
                            <h6 className='m-0'>
                              Hide <i className='fa fa-angle-double-down'></i>
                            </h6>
                          </div>
                          <div className='table-container'>
                            <div className='table-inner-container'>
                              <table className='table'>
                                <thead>
                                  <tr>
                                    <th className='text-center'>Action</th>
                                    <th className='text-center'>Team</th>
                                    <th>Rank</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className='border-active ds'>
                                    <td className='no-bg'>
                                      <div className='d-flex align-items-center justify-content-center match-action'>
                                        <a href='/teams?squadId=1723718896417467421&amp;type=0'>
                                          View
                                        </a>
                                        <a href='/teams?squadId=1723718896417467421&amp;type=0'>
                                          Join Contest
                                        </a>
                                      </div>
                                    </td>
                                    <td className='text-center truncate no-bg'>
                                      <span className='truncate'>
                                        {' '}
                                        Spartans{' '}
                                      </span>
                                    </td>
                                    <td className='no-bg'>21</td>
                                    <td className='no-bg'>
                                      <span className='Joined status'>
                                        Joined
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='package-contest-post-main bronze'>
                    <div className='package-contest-post'>
                      <div className='package-contest-post-inner'>
                        <div className='contest-info'>
                          <Image src={bronzeicon} alt='img' /> Bronze
                        </div>
                        <div className='post-heading-info'>
                          <div className='img-pnl'>
                            <Image className='small' src={coinicon} alt='img' />
                            <Image src={tethericon} alt='img' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>Bronze</h6>
                            <span>26.6X</span>
                          </div>
                        </div>
                        <ul className='calculate-list'>
                          <li>
                            <p>Roi:</p>
                            <p>
                              <i className='fa fa-rocket color'></i> Calculate
                              ROI <i className='fa fa-calculator'></i>
                            </p>
                          </li>
                          <li>
                            <p>Participants</p>
                            <p>15</p>
                          </li>
                        </ul>
                        <Link href='#' className='reg-btn'>
                          Join Contest
                        </Link>
                        <div className='table-p'>
                          <div className='text-center'>
                            <h6 className='m-0'>
                              Hide <i className='fa fa-angle-double-down'></i>
                            </h6>
                          </div>
                          <div className='table-container'>
                            <div className='table-inner-container'>
                              <table className='table'>
                                <thead>
                                  <tr>
                                    <th className='text-center'>Action</th>
                                    <th className='text-center'>Team</th>
                                    <th>Rank</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className='border-active ds'>
                                    <td className='no-bg'>
                                      <div className='d-flex align-items-center justify-content-center match-action'>
                                        <a href='/teams?squadId=1723718896417467421&amp;type=0'>
                                          View
                                        </a>
                                      </div>
                                    </td>
                                    <td className='text-center truncate no-bg'>
                                      <span className='truncate'>
                                        {' '}
                                        Spartans{' '}
                                      </span>
                                    </td>
                                    <td className='no-bg'>21</td>
                                    <td className='no-bg'>
                                      <span className='Joined status'>
                                        Joined
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='package-contest-post-main gold'>
                    <div className='package-contest-post'>
                      <div className='package-contest-post-inner'>
                        <div className='contest-info'>
                          <Image src={goldicon} alt='img' /> Gold
                        </div>
                        <div className='post-heading-info'>
                          <div className='img-pnl'>
                            <Image className='small' src={coinicon} alt='img' />
                            <Image src={tethericon} alt='img' />
                          </div>
                          <div className='txt-pnl'>
                            <h6>Gold</h6>
                            <span>45X</span>
                          </div>
                        </div>
                        <ul className='calculate-list'>
                          <li>
                            <p>Roi:</p>
                            <p>
                              <i className='fa fa-rocket color'></i> Calculate
                              ROI <i className='fa fa-calculator'></i>
                            </p>
                          </li>
                          <li>
                            <p>Participants</p>
                            <p>15</p>
                          </li>
                        </ul>
                        <Link href='#' className='reg-btn'>
                          Join Contest
                        </Link>

                        <div className='table-p'>
                          <div className='text-center'>
                            <h6 className='m-0'>
                              Hide <i className='fa fa-angle-double-down'></i>
                            </h6>
                          </div>
                          <div className='table-container'>
                            <div className='table-inner-container'>
                              <table className='table'>
                                <thead>
                                  <tr>
                                    <th className='text-center'>Action</th>
                                    <th className='text-center'>Team</th>

                                    <th>Rank</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className='border-active ds'>
                                    <td className='no-bg'>
                                      <div className='d-flex align-items-center justify-content-center match-action'>
                                        <a href='/teams?squadId=1723718896417467421&amp;type=0'>
                                          View
                                        </a>
                                      </div>
                                    </td>
                                    <td className='text-center truncate no-bg'>
                                      <span className='truncate'>
                                        {' '}
                                        Spartans{' '}
                                      </span>
                                    </td>
                                    <td className='no-bg'>21</td>
                                    <td className='no-bg'>
                                      <span className='Joined status'>
                                        Joined
                                      </span>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Contest Panel */}
      <div className='spacer-50' />
      <Container fluid id='winnermp' className='winner-mp winner-mvpscls mb-5'>
        <Row>
          <Container>
            <Row>
              <Col xl='12'>
                <Slider {...settings} className='mvpsSlider' ref={mvpsslider}>
                  <div className='winners-mvps'>
                    <ul className=''>
                      <li>
                        <Link href='#' className='latest-post'>
                          <h6 className='text-center'> Nov 2, 2024</h6>
                          <div className='d-flex justify-content-center gap-5'>
                            <span className='matchTitle maxw'>Italy FC</span>
                            <span className='matchTitle maxw'>Italy FC</span>
                          </div>
                          <div className='flex-div justify-content-center'>
                            <h6>
                              <div className='d-flex justify-content-center mt-3'>
                                <Image src={cup2} alt='Team' />
                              </div>
                            </h6>
                            <span className='mx-5'>2-3</span>
                            <h6>
                              <div className='d-flex justify-content-center mt-3'>
                                <Image src={cup1} alt='Team' />{' '}
                              </div>
                            </h6>
                          </div>
                          <p className='text-center'>
                            <i className='fa fa-map-marker' /> Central Olympia
                            Stadium
                          </p>
                        </Link>
                      </li>
                    </ul>
                    <ul className='winner-mvp-list'>
                      <li>
                        <div className='winner-post winner '>
                          <Link href='#'>
                            <h5>
                              CONTEST <span>WINNER</span>
                            </h5>
                            <div className='user-info-post'>
                              <div className='img-pnl'>
                                <img
                                  src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/icons/cup-1.png'
                                  alt='Cup'
                                />

                                <div className='userImg'>
                                  <Image src={userImage} alt='John Doe' fill />
                                </div>
                              </div>
                              <div className='txt-pnl'>
                                <h6>John Doe</h6>
                                <p>@john_178</p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </li>

                      <li>
                        <div className='winner-post mvp '>
                          <Link href='#'>
                            <h5>
                              Man OF <span>MATCH</span>
                            </h5>
                            <div className='user-info-post'>
                              <div className='img-pnl'>
                                <Image
                                  className='MVPS_PLAYER_IMG'
                                  src={user2}
                                  alt='User'
                                />
                              </div>

                              <div className='txt-pnl'>
                                <h6>John Doe</h6>
                                <p>Points: 64546</p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Slider>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>

      <Container fluid>
        <Row>
          <Container>
            <Row>
              <Col xl='12'>
                <div className='table-container'>
                  <div className='table-inner-container'>
                    <Table>
                      <tbody>
                        <tr>
                          <td colSpan={4}>
                            <h5>
                              <span> Super League</span>
                            </h5>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div className='d-flex justify-content-center matchesBtns'>
                              <Link
                                href='#'
                                className=' reg-btn text-white reg-custom-btn empty text-capitalize '
                              >
                                Create Team
                              </Link>
                              <Link
                                href='#'
                                className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
                              >
                                Create Contest
                              </Link>
                              <Link
                                href='#'
                                className=' reg-btn text-white reg-custom-btn empty text-capitalize  '
                              >
                                View Contests
                              </Link>
                            </div>
                          </td>
                          <td>
                            <div className='w-100 d-flex justify-content-center align-items-center text-center'>
                              <span className='w-half text-right d-flex align-items-center justify-content-end'>
                                {/* {sliceText(match.homeTeam.name,0,10)}{' '} */}
                                <Tippy content={'Sichuan Jiuniu'}>
                                  <span className='truncate'>
                                    Sichuan Jiuniu
                                  </span>
                                </Tippy>

                                <Image
                                  className='mx-2'
                                  src={tethericon}
                                  alt='Icon paris'
                                />
                              </span>
                              <span className='d-flex flex-column'>
                                <span className='w-80 text-center fs-6 color fw-bold'>
                                  Sichuan Jiuniu
                                </span>
                                <span className='w-80 text-center'>vs</span>
                              </span>

                              <span className='w-half text-left d-flex align-items-center justify-content-start'>
                                <Image
                                  className='mx-2'
                                  src={tethericon}
                                  alt='Icon paris'
                                />
                                <Tippy content={'Sichuan Jiuniu'}>
                                  <span className='truncate'>
                                    Sichuan Jiuniu
                                  </span>
                                </Tippy>
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className='text-nowrap'>Sep 13,24</div>
                          </td>
                          <td>
                            <div className='text-nowrap'>05:00Pm</div>
                          </td>
                          <td>
                            <div className='isPostpondStatus'>
                              Yellow Dragon waly
                              <span>HonoLolo</span>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    </>
  );
}
