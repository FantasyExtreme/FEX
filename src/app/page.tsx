"use client";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import Link from "next/link";
import { Container, Row, Col, Button, Form, Spinner } from "react-bootstrap";
import matchbg3 from "../assets/old-images/bg/bg-trans-3.png";
import team1 from "../assets/images/teams/team-bestfoot-club.png";
import team2 from "../assets/images/teams/team-soccer-club.png";

import HowItWorksList from "@/components/Components/HowItWorksList";

import Header from "@/components/Components/Header";
import { makeFantasyFootballActor } from "@/dfx/service/actor-locator";
import LatestResult from "@/components/Components/LatestResult";
import HowItWorksSlider from "@/components/Components/HowItWorksSlider";

import { useRouter } from "next/navigation";

import { ConnectPlugWalletSlice } from "@/types/store";
import { useAuthStore } from "@/store/useStore";
import { FANTASY_PLAYERS_ROUTE, MATCHES_ROUTE } from "@/constant/routes";
import { QURIES } from "@/constant/variables";
import FantasyPlayers from "@/components/Components/FantasyPlayers";

export default function HomePage() {
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element: any = document.getElementById("MatchResult");
      const rect = element.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible) {
        setIsVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isVisible1, setIsVisible1] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element: any = document.getElementById("howtoplaypnl");
      const rect = element.getBoundingClientRect();
      const isVisible1 = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible1) {
        setIsVisible1(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const [isVisible2, setIsVisible2] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element: any = document.getElementById("Fantasy");
      const rect = element.getBoundingClientRect();
      const isVisible2 = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible2) {
        setIsVisible2(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  const [isVisible3, setIsVisible3] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element: any = document.getElementById("History");
      const rect = element.getBoundingClientRect();
      const isVisible3 = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible3) {
        setIsVisible3(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
  const fantasyFootball = makeFantasyFootballActor({});
  const navigation = useRouter();

  const [isVisible4, setIsVisible4] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const element: any = document.getElementById("History");
      const rect = element.getBoundingClientRect();
      const isVisible4 = rect.top < window.innerHeight && rect.bottom >= 0;
      if (isVisible4) {
        setIsVisible4(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <>
      <Header />
      {/* How It Works */}
      <Container
        fluid
        id="howtoplaypnl"
        className={
          isVisible1 == true ? "animate how-to-play-pnl" : "how-to-play-pnl"
        }
      >
        <Row>
          <Container>
            <Row>
              <Col xl="12" lg="12" md="12" sm="12">
                <div className="text-center">
                  <h2>
                    HOW IT <span>WORKS</span>
                  </h2>
                </div>
                <HowItWorksList />
                <div className="HowtoPlaySlider">
                  <HowItWorksSlider />
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* How It Works */}
      <Container
        fluid
        id="History"
        className={
          isVisible3 == true ? "animate history-panel" : "history-panel"
        }
      >
        <Row>
          <Container>
            <Row>
              <Col xl="12" lg="12" md="12" sm="12">
                <div className="text-panel">
                  <div className="bg-layer" />
                  <h3 className="text-uppercase">Our History</h3>
                  <h2>
                    About <span>Fantasy</span>
                  </h2>
                  <p>
                    Take your love for soccer to the next level with fantasy
                    football. Build your own virtual dream team by drafting real
                    footballers. Their performances on the pitch - goals scored,
                    assists made, clean sheets kept - translate into points for
                    your team. You'll compete against friends or online leagues,
                    strategizing your picks, managing injuries, and watching
                    your team rack up. It's a fun and engaging way to experience
                    the beautiful game, combining the thrill of real-world
                    soccer with the challenge of building and managing your own
                    champion squad.
                  </p>
                  <div className="mobile-view-center">
                    <Link href={MATCHES_ROUTE} className="reg-btn mid">
                      Play Now
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>

      {/* matches Result Panel */}
      <Container
        fluid
        id="MatchResult"
        className={
          isVisible == true
            ? "animate matches-result-panel mb-5"
            : "matches-result-panel mb-5"
        }
      >
        <Row className="mb-5">
          <Container>
            <Row>
              <Col xl="12" lg="12" md="12" sm="12">
                <div className="text-center">
                  <h2>
                    Latest <span>Results</span>
                  </h2>
                </div>
                <div className="spacer-30" />
                <LatestResult />
                <div className="spacer-10" />
                <div className="flex-div justify-content-end">
                  <Link
                    href={`${MATCHES_ROUTE}?${QURIES.matchTab}=2`}
                    className="simple-link"
                  >
                    View All <i className="fa fa-arrow-right" />
                  </Link>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* matches Result Panel */}
      {/* Top Fantasy Player */}
      <Container
        fluid
        id='Fantasy'
        className={
          isVisible4 == true
            ? 'animate top-fantasy-panel pb-0'
            : 'top-fantasy-panel pb-0'
        }
      >
        <div className='bg-layer' />
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='flex-div'>
                  <h2>
                    Top Fantasy <span>Players</span>
                  </h2>
                  <Link className='simple-link mb-3' href={FANTASY_PLAYERS_ROUTE}>
                    View All{' '}
                    <i className='fa fa-arrow-right' aria-hidden='true'></i>
                  </Link>
                </div>
              </Col>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='spacer-50' />
              </Col>
              <FantasyPlayers />
            </Row>
          </Container>
        </Row>
      </Container>
      {/* Top Fantasy Player */}
    </>
  );
}
