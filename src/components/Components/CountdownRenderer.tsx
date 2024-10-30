import { CountdownRenderProps } from 'react-countdown';

const CountdownRender = ({
  hours,
  days,
  minutes,
  seconds,
  completed,
}: CountdownRenderProps) => {
  if (completed) {
    // Render a completed state
    return null;
  } else {
    // Render a countdown
    return (
      <span className='ms-2'>
        {days}:{hours}:{minutes}:{seconds}
      </span>
    );
  }
};
export default CountdownRender;
