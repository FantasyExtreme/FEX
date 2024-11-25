import React from 'react';
import { Spinner } from 'react-bootstrap';

const CenteredSpinner = ({ minHeight }: { minHeight?: number }) => {
  return (
    <div
      className={`d-flex align-items-center justify-content-center `}
      style={minHeight ? { minHeight } : {}}
    >
      <Spinner />
    </div>
  );
};

export default CenteredSpinner;
