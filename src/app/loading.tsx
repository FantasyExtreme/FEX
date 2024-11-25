import { Spinner } from 'react-bootstrap';

export default function Loading() {
  return (
    <div className='z-3'>
      <div className='spacer-300' />
      <div className='d-flex justify-content-center'>
        <Spinner animation='border' />
      </div>
      <div className='spacer-300' />
    </div>
  );
}
