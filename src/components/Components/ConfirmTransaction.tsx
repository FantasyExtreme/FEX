import {
  CKBTC_GAS_FEE,
  CKBTC_GAS_FEE_INTEGER,
  GAS_FEE,
  GAS_FEE_ICP,
} from '@/constant/fantasticonst';
import { useAuthStore } from '@/store/useStore';
import { Contest } from '@/types/fantasy';
import { ConnectPlugWalletSlice } from '@/types/store';
import React, { useEffect, useState } from 'react';
import { Button, Modal, Spinner } from 'react-bootstrap';
import { getContest } from '../utils/fantasy';
import Contest from './Contest';
import {
  ContestPayment,
  PaymentsArray,
  PaymentTypes,
} from '@/constant/variables';
import { toast } from 'react-toastify';
import { fromE8S } from '@/lib/ledger';
import logger from '@/lib/logger';

interface Props {
  show: boolean;
  hideModal: () => void;
  entryFee: number;
  onConfirm: () => void;
  loading: boolean;
  contestId: string;
}
function ConfirmTransaction({
  show,
  hideModal,
  onConfirm,
  entryFee,
  contestId,
  loading,
}: Props) {
  const { auth, userAuth, setUserAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));
  const [contest, setContest] = useState<null | Contest>(null);
  const [total, setTotal] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [gasFee, setGasFee] = useState(0);
  const [contestPaymentObj, setContestPaymentObj] = useState<
    (typeof PaymentsArray)[0] | null
  >(null);

  useEffect(() => {
    if (!contest) return;
    let contestPaymentObj = ContestPayment.get(
      contest?.paymentMethod as string,
    );
    if (!contestPaymentObj) {
      toast.error('Payment method not found');
      return;
    }
    setContestPaymentObj(contestPaymentObj);
    let total = 0;
    let remaining = 0;
    if (contestPaymentObj.id == PaymentTypes.ICP) {
      total = fromE8S(Number(contest?.entryFee) + GAS_FEE * 2);
      setGasFee(GAS_FEE_ICP * 2);
      remaining = userAuth.balance - total;
    } else if (contestPaymentObj.id == PaymentTypes.CKBTC) {
      total = fromE8S(Number(contest?.entryFee) + CKBTC_GAS_FEE * 2);
      setGasFee(CKBTC_GAS_FEE_INTEGER * 2);
      remaining = (userAuth.ckBalance ?? 0) - total;
    }
    setTotal(total);
    setRemaining(remaining);
  }, [contest]);
  useEffect(() => {
    (async () => {
      await getContest(auth.actor, contestId, setContest);
    })();
  }, [contestId]);

  return (
    <Modal className='light' show={show} centered onHide={hideModal}>
      <Modal.Body>
        <h5 className='text-center'>Confirm Transaction</h5>
        <div className='text-center mt-3'>
          <p>
            Current Balance:{' '}
            {contestPaymentObj?.id == PaymentTypes.ICP
              ? userAuth.balance
              : contestPaymentObj?.id == PaymentTypes.CKBTC
                ? userAuth.ckBalance
                : 0}{' '}
            {contestPaymentObj?.name}
          </p>
          <p>
            Entry Fees: {fromE8S(contest?.entryFee)} {contestPaymentObj?.name}
          </p>
          {entryFee <= 0 ? null : (
            <>
              {' '}
              <p>
                Gas Fees: {gasFee} {contestPaymentObj?.name}
              </p>
              <p>
                Total: {total} {contestPaymentObj?.name}
              </p>
            </>
          )}
          <p>
            Remaining Balance:{' '}
            {remaining >= 0
              ? `${remaining} ${contestPaymentObj?.name}`
              : 'Insufficient Balance'}
          </p>
          <div className='btn-list-div'>
            <Button
              className='reg-btn mid reg-btn'
              id='confirmBtn'
              disabled={loading || (entryFee !=0 &&remaining < 0)}
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
