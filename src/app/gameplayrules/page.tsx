'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Table,
  Spinner,
  Button,
  Form,
} from 'react-bootstrap';
import Image from 'next/image';

export default function gameplayrules() {
  return (
    <>
      <Container fluid className='inner-page'>
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12'>
                <h2 className='animedown'>
                  <span>Fantasy Extreme Gameplay Rules</span>
                </h2>
                <h5 className='whitecolor animedown'>
                  We are providing a comprehensive guide on how you can become a
                  manager and enter the contests on Fantasy Extreme. Please
                  refer to the below guidelines.
                </h5>
                <p className='whitecolor animedown'>
                  <span className='color'>1.</span> Select a match from upcoming
                  matches.
                </p>
                <p className='whitecolor animedown'>
                  <span className='color'>2.</span> Create your virtual
                  team.(Multiple users can create multiple teams for each single
                  match)
                </p>
                <p className='whitecolor animedown'>
                  <span className='color'>3.</span> Select 3 forwards, 5
                  midfielders, 5 defenders, and 2 goalkeepers, in order to
                  complete your team selection.
                </p>
                <p className='whitecolor animedown'>
                  <span className='color'>4.</span> Join the contest. (Maximum 3
                  teams from a single player can join one contest)
                </p>
                <p className='whitecolor animedown'>
                  <span className='color'>5.</span> Access live standing during
                  the match to track your team performances.
                </p>
                <p className='whitecolor animedown'>
                  <span className='color'>6.</span> Get instant updates on your
                  team’s victory as the contest concludes.
                </p>
                <p className='whitecolor animedown'>
                  <span className='color'>7.</span> Earn instant rewards right
                  after each match your team wins.
                </p>

                <h5 className='whitecolor animedown'>
                  Follow these steps to enhance your Fantasy Extreme experience
                  and lead your team to victory!
                </h5>
                <div className='spacer-50' />
              </Col>
              <Col xl='12' lg='12' md='12'>
                <div className='gray-panel'>
                  <h4 className='animedown Nasalization'>
                    <span>Shots</span>
                  </h4>
                  <ul className='points-list animedown'>
                    <li>
                      <h6>total shots</h6>
                      <h6>1</h6>
                    </li>
                    <li>
                      <h6>shots on goal</h6>
                      <h6>2</h6>
                    </li>
                  </ul>
                  <h4 className='animedown Nasalization'>
                    <span>Goals</span>
                  </h4>
                  <ul className='points-list animedown'>
                    <li>
                      <h6>goals scored</h6>
                      <h6>10</h6>
                    </li>
                    <li>
                      <h6>goals assists</h6>
                      <h6>6</h6>
                    </li>
                    <li>
                      <h6>goals conceded</h6>
                      <h6>-2</h6>
                    </li>
                    <li>
                      <h6>goals owngoals</h6>
                      <h6>-3</h6>
                    </li>
                  </ul>

                  <h4 className='animedown Nasalization'>
                    <span>Fouls </span>
                  </h4>
                  <ul className='points-list animedown'>
                    <li>
                      <h6>fouls drawn</h6>
                      <h6>2</h6>
                    </li>
                    <li>
                      <h6>fouls committed</h6>
                      <h6>-2</h6>
                    </li>
                  </ul>
                  <h4 className='animedown Nasalization'>
                    <span>Cards</span>
                  </h4>
                  <ul className='points-list animedown'>
                    <li>
                      <h6>cards yellowcards</h6>
                      <h6>-3</h6>
                    </li>
                    <li>
                      <h6>cards redcards</h6>
                      <h6>-5</h6>
                    </li>
                  </ul>
                  <h4 className='animedown Nasalization'>
                    <span>Passing</span>
                  </h4>
                  <ul className='points-list animedown'>
                    <li>
                      <h6>passing total crosses</h6>
                      <h6>2</h6>
                    </li>
                    <li>
                      <h6>passing crosses accuracy</h6>
                      <h6> 2 for &gt; 50% &lt; 70% 4 for &gt; 70%</h6>
                    </li>
                    <li>
                      <h6>passing passes</h6>
                      <h6>1</h6>
                    </li>
                    <li>
                      <h6>passing accurate passes</h6>
                      <h6>2</h6>
                    </li>
                    <li>
                      <h6>passing passes accuracy</h6>
                      <h6>3 for &gt; 50% &lt; 70 % 6 for &gt; 70%</h6>
                    </li>
                    <li>
                      <h6>passing key passes</h6>
                      <h6>3</h6>
                    </li>
                  </ul>

                  <h4 className='animedown Nasalization'>
                    <span>Dribbles</span>
                  </h4>
                  <ul className='points-list animedown'>
                    <li>
                      <h6>dribbles attempts</h6>
                      <h6>1 for 1 attempt</h6>
                    </li>
                    <li>
                      <h6>dribbles success</h6>
                      <h6>5</h6>
                    </li>
                    <li>
                      <h6>dribbles dribbled past</h6>
                      <h6>3</h6>
                    </li>
                  </ul>

                  <h4 className='animedown Nasalization'>
                    <span>Duels</span>
                  </h4>
                  <ul className='points-list animedown'>
                    <li>
                      <h6>duels won</h6>
                      <h6>2</h6>
                    </li>
                  </ul>

                  <h4 className='animedown Nasalization'>
                    <span>Other</span>
                  </h4>
                  <ul className='points-list animedown m-0'>
                    <li>
                      <h6>aerials won</h6>
                      <h6>3</h6>
                    </li>
                    <li>
                      <h6>offsides</h6>
                      <h6>-1</h6>
                    </li>
                    <li>
                      <h6>saves</h6>
                      <h6>2</h6>
                    </li>
                    <li>
                      <h6>inside box saves</h6>
                      <h6>3</h6>
                    </li>
                    <li>
                      <h6>pen scored</h6>
                      <h6>7</h6>
                    </li>
                    <li>
                      <h6>pen missed</h6>
                      <h6>-5</h6>
                    </li>
                    <li>
                      <h6>pen saved</h6>
                      <h6>7</h6>
                    </li>
                    <li>
                      <h6>pen won</h6>
                      <h6>3</h6>
                    </li>
                    <li>
                      <h6>hit woodwork</h6>
                      <h6>3</h6>
                    </li>
                    <li>
                      <h6>tackles</h6>
                      <h6>3</h6>
                    </li>
                    <li>
                      <h6>blocks</h6>
                      <h6>5</h6>
                    </li>
                    <li>
                      <h6>interceptions</h6>
                      <h6>3</h6>
                    </li>
                    <li>
                      <h6>clearances</h6>
                      <h6>1 for 1</h6>
                    </li>
                    <li>
                      <h6>dispossesed</h6>
                      <h6>-3</h6>
                    </li>
                    <li>
                      <h6>minutes played</h6>
                      <h6>&lt; 60 1 &gt; = 60 2</h6>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
    </>
  );
}
