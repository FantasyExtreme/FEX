import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

const Loader = () => {
  return (
    // <span className='text-center w-full d-flex justify-content-center'>
    <BeatLoader color='white' className='w-full' size={30} />
    // </span>
  );
};

export default Loader;
