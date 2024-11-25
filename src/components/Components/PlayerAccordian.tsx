'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Accordion, Spinner, Table } from 'react-bootstrap';
import logger from '@/lib/logger';
export default function Playeraccordian({
  players,
  count,
  selectedPlayers,
  togglePlayerSelection,
}: {
  players: GroupedPlayers | null;
  count: any;
  selectedPlayers: GroupedPlayers;
  togglePlayerSelection: (player: Player) => void;
}) {
  if (players) {
    logger({ players, count, ggg: players['goalKeeper'] }, 'hiiiiii');
  }
  return (
    <>
      <Accordion alwaysOpen>
        <h5>Goalkeepers</h5>
        <Accordion.Item eventKey='0'>
          <Accordion.Header>
            <p className='d-flex justify-content-between'>
              <span>Player</span>
              {/* <span>Player</span> */}
              <span>Position</span>
              <span>Price</span>
            </p>
          </Accordion.Header>
          <Accordion.Body>
            <Table>
              <tbody>
                {players ? (
                  players['goalKeeper']?.map((player) => {
                    return (
                      <tr
                        key={player.id}
                        className={
                          selectedPlayers?.all?.find((p) => p.id === player.id)
                            ? 'selected-player'
                            : ''
                        }
                        onClick={() => togglePlayerSelection(player)}
                      >
                        <td>
                          <div className='d-flex'>
                            <Image
                              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/teams/team-bestfoot-club.png'
                              alt='shirt5'
                            />
                            <div>
                              <h6>{player.name}</h6>
                              <p>{player.country}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span>{renamePosition(player?.positionString)}</span>
                        </td>
                        <td>{/* <p>144</p> */}</td>
                        <td>
                          <p>{Number(player.fantasyPrice)}</p>
                        </td>
                        <td>
                          <Link href='#'>
                            <i className='fa fa-info-circle' />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <div className='d-flex justify-content-center'>
                    <Spinner />
                  </div>
                )}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        <h5>Defenders</h5>
        <Accordion.Item eventKey='1'>
          <Accordion.Header>
            <p className='d-flex justify-content-between'>
              <span>Player</span>
              <span>Position</span>
              <span>Price</span>
            </p>
          </Accordion.Header>
          <Accordion.Body>
            <Table>
              <tbody>
                {players ? (
                  players['defender']?.map((player) => {
                    return (
                      <tr
                        key={player.id}
                        className={
                          selectedPlayers?.all?.find((p) => p.id === player.id)
                            ? 'selected-player'
                            : ''
                        }
                        onClick={() => togglePlayerSelection(player)}
                      >
                        <td>
                          <div className='d-flex'>
                            <Image
                              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/teams/team-bestfoot-club.png'
                              alt='shirt5'
                            />
                            <div>
                              <h6>{player.name}</h6>
                              <p>{player.country}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span>{renamePosition(player?.positionString)}</span>
                        </td>
                        <td>{/* <p>144</p> */}</td>
                        <td>
                          <p>{Number(player.fantasyPrice)}</p>
                        </td>
                        <td>
                          <Link href='#'>
                            <i className='fa fa-info-circle' />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <div className='d-flex justify-content-center'>
                    <Spinner />
                  </div>
                )}
                {/* <tr key={player.id} className={selectedPlayers?.all?.find(({player:p}) => p.id === player.id) ? 'selected-player' : ''}
onClick={()=>togglePlayerSelection(player)}>
                  <td>
                    <div className='d-flex'>
                      <Image src={shirt2} alt='Shirt' />
                      <div>
                        <h6>John Doe</h6>
                        <p>EVE GKP</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span>{renamePosition(player?.positionString)}</span>
                  </td>
                  <td>
                    <p>144</p>
                  </td>
                  <td>
                    <p>$4.3</p>
                  </td>
                  <td>
                    <Link href='#'>
                      <i className='fa fa-info-circle'/>
                    </Link>
                  </td>
                </tr> */}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        <h5>Midfielders</h5>
        <Accordion.Item eventKey='2'>
          <Accordion.Header>
            <p className='d-flex justify-content-between'>
              <span>Player</span>
              <span>Position</span>
              <span>Price</span>
            </p>
          </Accordion.Header>
          <Accordion.Body>
            <Table>
              <tbody>
                {players ? (
                  players['midfielder']?.map((player) => {
                    return (
                      <tr
                        key={player.id}
                        className={
                          selectedPlayers?.all?.find((p) => p.id === player.id)
                            ? 'selected-player'
                            : ''
                        }
                        onClick={() => togglePlayerSelection(player)}
                      >
                        <td>
                          <div className='d-flex'>
                            <Image
                              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/teams/team-bestfoot-club.png'
                              alt='shirt5'
                            />
                            <div>
                              <h6>{player.name}</h6>
                              <p>{player.country}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span>{renamePosition(player?.positionString)}</span>
                        </td>
                        <td>{/* <p>144</p> */}</td>
                        <td>
                          <p>{Number(player.fantasyPrice)}</p>
                        </td>
                        <td>
                          <Link href='#'>
                            <i className='fa fa-info-circle' />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <div className='d-flex justify-content-center'>
                    <Spinner />
                  </div>
                )}
                {/* <tr key={player.id} className={selectedPlayers?.all?.find(({player:p}) => p.id === player.id) ? 'selected-player' : ''}
onClick={()=>togglePlayerSelection(player)}>
                  <td>
                    <div className='d-flex'>
                      <Image src={shirt2} alt='Shirt' />
                      <div>
                        <h6>John Doe</h6>
                        <p>EVE GKP</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span>{renamePosition(player?.positionString)}</span>
                  </td>
                  <td>
                    <p>144</p>
                  </td>
                  <td>
                    <p>$4.3</p>
                  </td>
                  <td>
                    <Link href='#'>
                      <i className='fa fa-info-circle'/>
                    </Link>
                  </td>
                </tr>
               */}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
        <h5>Forward</h5>
        <Accordion.Item eventKey='3'>
          <Accordion.Header>
            <p className='d-flex justify-content-between'>
              <span>Player</span>
              <span>Position</span>
              <span>Price</span>
            </p>
          </Accordion.Header>
          <Accordion.Body>
            <Table>
              <tbody>
                {players ? (
                  players['forward']?.map((player) => {
                    return (
                      <tr
                        key={player.id}
                        className={
                          selectedPlayers?.all?.find((p) => p.id === player.id)
                            ? 'selected-player'
                            : ''
                        }
                        onClick={() => togglePlayerSelection(player)}
                      >
                        <td>
                          <div className='d-flex'>
                            <Image
                              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/teams/team-bestfoot-club.png'
                              alt='shirt5'
                            />
                            <div>
                              <h6>{player.name}</h6>
                              <p>{player.country}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span>{renamePosition(player?.positionString)}</span>
                        </td>
                        <td>{/* <p>144</p> */}</td>
                        <td>
                          <p>{Number(player.fantasyPrice)}</p>
                        </td>
                        <td>
                          <Link href='#'>
                            <i className='fa fa-info-circle' />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <div className='d-flex justify-content-center'>
                    <Spinner />
                  </div>
                )}
                {/*                
                <tr key={player.id} className={selectedPlayers?.all?.find(({player:p}) => p.id === player.id) ? 'selected-player' : ''}
onClick={()=>togglePlayerSelection(player)}>
                  <td>
                    <div className='d-flex'>
                      <Image src={shirt4} alt='Shirt' />
                      <div>
                        <h6>John Doe</h6>
                        <p>EVE GKP</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span>{renamePosition(player?.positionString)}</span>
                  </td>
                  <td>
                    <p>144</p>
                  </td>
                  <td>
                    <p>$4.3</p>
                  </td>
                  <td>
                    <Link href='#'>
                      <i className='fa fa-info-circle'/>
                    </Link>
                  </td>
                </tr> */}
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}
