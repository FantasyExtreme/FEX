import { GAS_FEE, GAS_FEE_ICP } from '@/constant/fantasticonst';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import React from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';

interface Props {
  show: boolean;
  hideModal: () => void;
  onConfirm: () => void;
  loading: boolean;
}
function ConfirmTransaction({
  show,
  hideModal,
  onConfirm,
  loading,
}: Props) {
  const { auth, userAuth, setUserAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));


  return (
    <Modal className='light' show={show} centered onHide={hideModal}>
      <Modal.Body>
        <h5 className='text-center'>Join Contest</h5>
        <div className='text-center mt-3'>
        <p>Are you sure you want to join contest.</p>
          <div className='btn-list-div'>
            <Button
              className='reg-btn mid reg-btn'
              id='confirmBtn'
              disabled={loading }
              onClick={onConfirm}
            >
              {loading ? <Spinner size='sm' /> : 'Confirm'}
            </Button>
            <Button
              className='reg-btn trans-white mid text-capitalize mx-2 cencelbtn'
              disabled={loading}
              onClick={hideModal}
              id='cancelButton'
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConfirmTransaction;
