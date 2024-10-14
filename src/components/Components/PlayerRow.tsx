import { Player, TogglePlayerSelection } from '@/types/fantasy';
import { getPlayerStatus } from '../utils/fantasy';
import Image from 'next/image';

export default function PlayerRow({
  player,
  onClick,
  className,
  time,
  onUserClick,
}: {
  player: Player;
  onClick: TogglePlayerSelection;
  className: string;
  time: number;
  onUserClick: any;
}) {
  let { status, showStatus } = getPlayerStatus(player, time);
  return (
    <tr
      className={'pointer ' + className}
      onClick={() => {
        onClick(player, false, false);
        onUserClick();
      }}
    >
      <td>
        <div className={`playing-status ${status}`}>
          {showStatus ? (
            showStatus
          ) : (
            <img
              alt='Clock Icon'
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/waiting.png'
            />
          )}
        </div>
      </td>
      <td>
      <div className={`playing-status mobile mb-2 ${status}`}>
          {showStatus ? (
            showStatus
          ) : (
            <img
              alt='Clock Icon'
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/waiting.png'
            />
          )}
        </div>
        <span className='circle-span'></span>
        {player.name}
      </td>
      <td>{player.teamName}</td>
      <td>{player.fantasyPrice}</td>
      <td>{player?.number}</td>
    </tr>
  );
}
