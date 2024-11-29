'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Carousel, Table } from 'react-bootstrap';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useAuthStore } from '@/store/useStore';
import Image from 'next/image';
import HowItWorksList from '@/components/Components/HowItWorksList';
import bg from '@/assets/images/slides/slide-1.jpg';
import circle from '@/assets/images/MainPage/circle.png';
import banner1 from '@/assets/images/MainPage/Banners/banner-1.jpg';
import banner2 from '@/assets/images/MainPage/Banners/banner-2.jpg';
import banner3 from '@/assets/images/MainPage/Banners/banner-3.jpg';
import banner4 from '@/assets/images/MainPage/Banners/banner-4.jpg';
import banner5 from '@/assets/images/MainPage/Banners/banner-5.jpg';
import banner6 from '@/assets/images/MainPage/Banners/banner-6.png';
import Batch1 from '@/assets/images/MainPage/Batch/batch-1.png';
import Batch2 from '@/assets/images/MainPage/Batch/batch-2.png';
import Batch3 from '@/assets/images/MainPage/Batch/batch-3.png';
import Batch4 from '@/assets/images/MainPage/Batch/batch-4.png';
import Team1 from '@/assets/images/MainPage/team/team-1.jpg';
import Team2 from '@/assets/images/MainPage/team/team-2.jpg';
import Team3 from '@/assets/images/MainPage/team/team-3.jpg';
import Team4 from '@/assets/images/MainPage/team/team-4.jpg';
import Team5 from '@/assets/images/MainPage/team/team-5.jpg';
import Team6 from '@/assets/images/MainPage/team/team-6.jpg';
import Team7 from '@/assets/images/MainPage/team/team-7.jpg';
import Team8 from '@/assets/images/MainPage/team/team-8.jpg';
import Team9 from '@/assets/images/MainPage/team/team-9.jpg';
import Team10 from '@/assets/images/MainPage/team/team-10.jpg';
import Team11 from '@/assets/images/MainPage/team/team-11.jpg';
import Team12 from '@/assets/images/MainPage/team/team-12.jpg';
import Team13 from '@/assets/images/MainPage/team/team-13.jpg';
import Team14 from '@/assets/images/MainPage/team/team-14.jpg';
import Team15 from '@/assets/images/MainPage/team/team-15.jpg';
import Team16 from '@/assets/images/MainPage/team/team-16.jpg';
import Team17 from '@/assets/images/MainPage/team/team-17.jpg';
import Team18 from '@/assets/images/MainPage/team/team-18.jpg';
import Game1 from '@/assets/images/MainPage/game/game-1.jpg';
import Game2 from '@/assets/images/MainPage/game/game-2.jpg';
import Game3 from '@/assets/images/MainPage/game/game-3.jpg';
import Game4 from '@/assets/images/MainPage/game/game-4.jpg';

export default function MainPage() {
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  // Scroll ANimation  howtoplaypnl
  // const [isVisible1, setIsVisible1] = useState(false);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const element: any = document.getElementById('howtoplaypnl');
  //     const rect = element.getBoundingClientRect();
  //     const isVisible1 = rect.top < window.innerHeight && rect.bottom >= 0;
  //     if (isVisible1) {
  //       setIsVisible1(true);
  //     }
  //   };
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, []);
  // Scroll ANimation  howtoplaypnl
  return (
    <>
      {/* Header Starts Here */}
      <Container fluid className='main-header'>
        <Row>
          <Image src={bg} alt='BG' />
        </Row>
      </Container>
      {/* Header Ends Here */}

      <Container fluid className='main-inner'>
        <Row>
          {/* Heading Panel */}
          <Container fluid>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='text-center heading-panel'>
                  <h1>
                    FANTASY <span> EXTREME</span>
                  </h1>
                  <h4>Where ICP Meets Fantasy Sports</h4>
                  <h5>(Create Strong Teams, Win Smart, & Earn Big Rewards)</h5>
                  <p className='text-justify'>
                    Lorem ipsum dolor sit amet consectetur. Scelerisque est
                    imperdiet tellus adipiscing lectus quam adipiscing. Ornare
                    morbi tellus dictum nibh. Arcu velit feugiat lorem porttitor
                    duis. Justo tristique vel nunc neque id massa eget nunc ut.
                  </p>
                  <div className='spacer-40' />
                </div>
              </Col>
            </Row>
          </Container>
          {/* Heading Panel */}

          {/* Fantasy Extreme Panel */}
          <Container fluid>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12' className='p-0'>
                <div className='fantasy-promo-panel'>
                  <div className='text-pnl'>
                    <h3>
                      FANTASY <span> EXTREME</span>
                    </h3>
                    <p>
                      Fantasy Extreme is the world’s revolutionary Decentralized
                      DeFi sports platform that combines the power of Internet
                      Computer Protocols (ICP) to build an immersive, secure,
                      and rewarding DeFi/fantasy sports platform having
                      utilities of real-world sports. From getting access to
                      your real-world heroes, to building your virtual teams by
                      selecting the best players, you enter into a series of
                      non-stop matches & fun with Fantasy Extreme. Here, your
                      team’s victory leads to receiving big rewards right after
                      every contest you win.
                    </p>
                    <p>
                      Beginning with soccer, Fantasy Extreme will expand to
                      offer sports like cricket, NFL, Baseball, basketball, and
                      others while engaging users from all across the world.
                    </p>
                  </div>
                  <div className='img-pnl'>
                    <Image src={banner1} alt='Banner' />
                  </div>
                </div>
                <div className='spacer-20' />
              </Col>
            </Row>
          </Container>
          {/* Fantasy Extreme Panel */}

          {/* FANTASY EXTREME */}
          <Container fluid>
            <Row>
              <Container>
                <Row>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    <div className='text-center'>
                      <h2>
                        FANTASY <span> EXTREME</span>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Scelerisque est
                        imperdiet tellus adipiscing lectus quam adipiscing.
                        Ornare morbi tellus dictum nibh. Arcu velit feugiat
                        lorem porttitor duis. Justo tristique vel nunc neque id
                        massa eget nunc ut.
                      </p>
                      <div className='spacer-30' />
                    </div>
                  </Col>
                </Row>
              </Container>
              <Container fluid>
                <Row>
                  <ul className='game-selection-list'>
                    <li>
                      <Link href='#' className='game-selection-post active'>
                        <Image src={Game1} alt='Soccer' />
                        <span>Soccer</span>
                        <div className='comming-soon'>
                          <h2>Comming Soon</h2>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href='#' className='game-selection-post'>
                        <Image src={Game2} alt='Rugby' />
                        <span>Soccer</span>
                        <div className='comming-soon'>
                          <h2>Comming Soon</h2>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href='#' className='game-selection-post'>
                        <Image src={Game3} alt='Basket Ball' />
                        <span>Soccer</span>
                        <div className='comming-soon'>
                          <h2>Comming Soon</h2>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href='#' className='game-selection-post'>
                        <Image src={Game4} alt='Tennis' />
                        <span>Soccer</span>
                        <div className='comming-soon'>
                          <h2>Comming Soon</h2>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </Row>
              </Container>
            </Row>
          </Container>
          {/* FANTASY EXTREME */}

          {/* How To Win Reward Panel */}
          <Container fluid>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12' className='p-0'>
                <div className='fantasy-promo-panel pr'>
                  <div className='text-pnl'>
                    <h3>
                      How to <span> Win Rewards?</span>
                    </h3>
                    <ul className='dot-list'>
                      <li>Connect With ICP</li>
                    </ul>
                    <p>
                      Connect with ICP by creating your internet identity to
                      enter a match and join contest.
                    </p>
                  </div>
                  <div className='img-pnl'>
                    <Image src={banner2} alt='Banner' />
                  </div>
                </div>
                <div className='spacer-20' />
              </Col>
            </Row>
          </Container>
          {/* How To Win Reward Panel */}

          {/* How To Win Reward Panel */}
          <Container fluid>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12' className='p-0'>
                <div className='fantasy-promo-panel pr'>
                  <div className='text-pnl'>
                    <h3>
                      Our Key <span> Differentiators</span>
                    </h3>
                    <p>What distinguishes us apart:</p>
                    <ul className='dot-list'>
                      <li>Borderless Entry:</li>
                    </ul>
                    <p>
                      Fantasy Extreme removes the barriers to entry by allowing
                      participation from any part of the world providing
                      opportunities to participate and compete globally.
                    </p>
                  </div>
                  <div className='img-pnl'>
                    <Image src={banner3} alt='Banner' />
                  </div>
                </div>
                <div className='spacer-20' />
              </Col>
            </Row>
          </Container>
          {/* How To Win Reward Panel */}

          {/* P2E */}
          <Container fluid>
            <Row>
              <Container>
                <Row>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    <div className='text-center'>
                      <h2>
                        It’s NOT P2E!! <span> Be a Manager</span>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Scelerisque est
                        imperdiet tellus adipiscing lectus quam adipiscing.
                        Ornare morbi tellus dictum nibh. Arcu velit feugiat
                        lorem porttitor duis. Justo tristique vel nunc neque id
                        massa eget nunc ut.
                      </p>
                      <div className='spacer-20' />
                    </div>

                    <Col xl='8' lg='8' md='12' sm='12'>
                      <Image src={banner4} alt='Banner' />
                    </Col>
                    <Col xl='10' lg='10' md='12' sm='12'>
                      <div className='spacer-30' />
                    </Col>
                    <Col
                      xl={{ span: 8, offset: 4 }}
                      lg={{ span: 8, offset: 4 }}
                      md={{ span: 12, offset: 0 }}
                      sm={{ span: 12, offset: 0 }}
                    >
                      <Image src={banner5} alt='Banner' />
                    </Col>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Container>
          {/* P2E */}

          {/* How To Play */}
          <Container fluid id='howtoplaypnl' className='how-to-play-pnl'>
            <Row>
              <Container>
                <Row>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    <div className='text-center'>
                      <h2>
                        HOW IT <span>WORKS</span>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Scelerisque est
                        imperdiet tellus adipiscing lectus quam adipiscing.
                        Ornare morbi tellus dictum nibh. Arcu velit feugiat
                        lorem porttitor duis. Justo tristique vel nunc neque id
                        massa eget nunc ut.
                      </p>
                    </div>
                    <HowItWorksList />
                  </Col>
                </Row>
              </Container>
            </Row>
          </Container>
          {/* How To Play */}

          {/* Mystery Box */}
          <Container fluid>
            <Row>
              <Container>
                <Row>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    <div className='text-center'>
                      <h2>
                        Mystery <span> Box</span>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Scelerisque est
                        imperdiet tellus adipiscing lectus quam adipiscing.
                        Ornare morbi tellus dictum nibh. Arcu velit feugiat
                        lorem porttitor duis. Justo tristique vel nunc neque id
                        massa eget nunc ut.
                      </p>
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                      <div className='spacer-50' />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Container>
          {/* Mystery Box */}

          {/* Demo */}
          <Container fluid>
            <Row>
              <Container>
                <Row>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    <div className='text-center'>
                      <h2>
                        <span>Demo</span>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Scelerisque est
                        imperdiet tellus adipiscing lectus quam adipiscing.
                        Ornare morbi tellus dictum nibh. Arcu velit feugiat
                        lorem porttitor duis. Justo tristique vel nunc neque id
                        massa eget nunc ut.
                      </p>
                      <Image src={banner6} alt='Banner' />
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Container>
          {/* Demo */}

          {/* Market Value */}
          <Container fluid>
            <Row>
              <Container>
                <Row>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    <div className='text-center'>
                      <h2>
                        Market <span>Value</span>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Scelerisque est
                        imperdiet tellus adipiscing lectus quam adipiscing.
                        Ornare morbi tellus dictum nibh. Arcu velit feugiat
                        lorem porttitor duis. Justo tristique vel nunc neque id
                        massa eget nunc ut.
                      </p>
                      <div className='spacer-30' />
                    </div>
                    <div className='text-right'>
                      <h2>4 Billion People</h2>
                    </div>

                    <div className='Billion-pnl'>
                      <div className='marketing-size-pnl'>
                        <h4>Market Size</h4>
                        {/* <h5>$35.67 <span>Billions</span></h5> */}
                        <Image src={circle} alt='Circle' />
                        <h6>Curt in 2024</h6>
                      </div>
                      <div className='billion-count-pnl'>
                        <div className='flex-div'>
                          <h6>$20.69 Billion</h6>
                          <h6>EST in 2021</h6>
                        </div>
                        <div className='billion-bar'>
                          <span style={{ width: '30%' }}></span>
                        </div>
                        <div className='flex-div'>
                          <h6>$27.20 Billion</h6>
                          <h6>EST in 2022</h6>
                        </div>
                        <div className='billion-bar'>
                          <span style={{ width: '40%' }}></span>
                        </div>
                        <div className='flex-div'>
                          <h6>$30.95 Billion</h6>
                          <h6>EST in 2023</h6>
                        </div>
                        <div className='billion-bar'>
                          <span style={{ width: '50%' }}></span>
                        </div>
                        <div className='flex-div'>
                          <h6>$87.07 Billion</h6>
                          <h6> EXP in 2031</h6>
                        </div>
                        <div className='billion-bar'>
                          <span style={{ width: '80%' }}></span>
                        </div>
                      </div>
                    </div>
                    <div className='Billion-participants'>
                      <div className='txt-pnl'>
                        <h4>90 Million</h4>
                        <h5>90 Million</h5>
                        <h6>Participants</h6>
                      </div>
                      <ul>
                        <li>
                          <Image src={Batch1} alt='Batch' />
                        </li>
                        <li>
                          <Image src={Batch2} alt='Batch' />
                        </li>
                        <li>
                          <Image src={Batch3} alt='Batch' />
                        </li>
                        <li>
                          <Image src={Batch4} alt='Batch' />
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Container>
          {/* Market Value */}

          {/* Road Map */}
          <Container fluid>
            <Row>
              <Container>
                <Row>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    <div className='text-center'>
                      <h2>
                        Road <span>Map</span>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Scelerisque est
                        imperdiet tellus adipiscing lectus quam adipiscing.
                        Ornare morbi tellus dictum nibh. Arcu velit feugiat
                        lorem porttitor duis. Justo tristique vel nunc neque id
                        massa eget nunc ut.
                      </p>
                      <div className='spacer-30' />
                      <div className='roadp-map-table'>
                        <Table>
                          <thead>
                            <tr>
                              <th>Milestone</th>
                              <th>Timeline</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Platform Launch (Soccer)</td>
                              <td>Q3 2024</td>
                            </tr>
                            <tr>
                              <td>Integration of Cricket</td>
                              <td>Q3 2024</td>
                            </tr>
                            <tr>
                              <td>NFTs Launch</td>
                              <td>Q3 2024</td>
                            </tr>
                            <tr>
                              <td>Mobile App</td>
                              <td>Q3 2024</td>
                            </tr>
                            <tr>
                              <td>Integration of NFL</td>
                              <td>Q3 2024</td>
                            </tr>
                            <tr>
                              <td>Integration of Rugby</td>
                              <td>Q3 2024</td>
                            </tr>
                            <tr>
                              <td>Integration of Baseball</td>
                              <td>Q3 2024</td>
                            </tr>
                            <tr>
                              <td>Integration of Basketball</td>
                              <td>Q3 2024</td>
                            </tr>
                            <tr>
                              <td>AI Integration </td>
                              <td>Q3 2024</td>
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
          {/* Road Map */}

          {/* Our Team */}
          <Container fluid>
            <Row>
              <Container>
                <Row>
                  <Col xl='12' lg='12' md='12' sm='12'>
                    <div className='text-center'>
                      <h2>
                        Our <span>Team</span>
                      </h2>
                      <p>
                        Lorem ipsum dolor sit amet consectetur. Scelerisque est
                        imperdiet tellus adipiscing lectus quam adipiscing.
                        Ornare morbi tellus dictum nibh. Arcu velit feugiat
                        lorem porttitor duis. Justo tristique vel nunc neque id
                        massa eget nunc ut.
                      </p>
                      <div className='spacer-20' />

                      <ul className='our-team-list'>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team1} alt='Zohaib Qadir' />
                          </div>
                          <h5>
                            Zohaib Qadir
                            <span>Chairman</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team2} alt='M. Sheharyar' />
                          </div>
                          <h5>
                            M. Sheharyar
                            <span>CEO & Founder</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team3} alt='Malik Mehmood' />
                          </div>
                          <h5>
                            Malik Mehmood
                            <span>CTO</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team4} alt='Hamza' />
                          </div>
                          <h5>
                            Hamza
                            <span>CMO</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team5} alt='Istiwana Ayesha' />
                          </div>
                          <h5>
                            Istiwana Ayesha
                            <span>Project Manager</span>
                          </h5>
                        </li>
                      </ul>

                      <ul className='our-team-list small'>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team6} alt='Raza Ahmed' />
                          </div>
                          <h5>
                            Raza Ahmed
                            <span>QA Lead</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team7} alt='Taqveem' />
                          </div>
                          <h5>
                            Taqveem
                            <span>Back-end lead</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team8} alt='Furqan Rauf' />
                          </div>
                          <h5>
                            Furqan Rauf
                            <span>
                              Marketing <br />
                              manager
                            </span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team9} alt='Sheharyar' />
                          </div>
                          <h5>
                            Sheharyar
                            <span>HOD Design</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team10} alt='Abdullah Umer' />
                          </div>
                          <h5>
                            Abdullah Umer
                            <span>
                              Lead Blockchain <br />
                              Expert
                            </span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team11} alt='Haider Shah' />
                          </div>
                          <h5>
                            Haider Shah
                            <span>
                              Creative Director <br />& Ui/UX Designer{' '}
                            </span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team12} alt='Faisal Saeed' />
                          </div>
                          <h5>
                            Faisal Saeed
                            <span>
                              Game Developer <br />& 3d Modeler
                            </span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team13} alt='Hassan Nawazish' />
                          </div>
                          <h5>
                            Hassan Nawazish
                            <span>Front-end Lead</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team14} alt='Ruhma' />
                          </div>
                          <h5>
                            Ruhma
                            <span>SR.Sqa</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team15} alt='Ali shan' />
                          </div>
                          <h5>
                            Ali shan
                            <span>Front End Eng</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team16} alt='Usman Saleem' />
                          </div>
                          <h5>
                            Usman Saleem
                            <span>SNR. Full STack</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team17} alt='Anam Malik' />
                          </div>
                          <h5>
                            Anam Malik
                            <span>Content Manager</span>
                          </h5>
                        </li>
                        <li>
                          <div className='img-pnl'>
                            <Image src={Team18} alt='M. Hammad' />
                          </div>
                          <h5>
                            M. Hammad
                            <span>SEO Specialist</span>
                          </h5>
                        </li>
                      </ul>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Row>
          </Container>
          {/* Our Team */}
        </Row>
      </Container>
    </>
  );
}
