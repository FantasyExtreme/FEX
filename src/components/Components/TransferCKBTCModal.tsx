import React, { useRef } from 'react';
import {
  Formik,
  FormikProps,
  Form as FormikForm,
  Field,
  FormikValues,
  ErrorMessage,
} from 'formik';
import {
  Button,
  Form,
  Modal,
  Nav,
  NavDropdown,
  NavLink,
  Spinner,
} from 'react-bootstrap';
import { number, object, string } from 'yup';
import { Principal } from '@dfinity/principal';
import useAuth from '@/lib/auth';
import {
  CKBTC_GAS_FEE,
  CKBTC_GAS_FEE_INTEGER,
  E8S,
  GAS_FEE,
  GAS_FEE_ICP,
} from '@/constant/fantasticonst';
import { makeICPLedgerCanister } from '@/dfx/service/actor-locator';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import logger from '@/lib/logger';
import useCkBtcLedger from '@/dfx/hooks/useCkBtcLedger';
// import { AccountIdentifier } from '@dfinity/ledger-icp';

function TransferCKBTCModal({
  showTokenModal,
  handleCloseTokenModal,
}: {
  showTokenModal: boolean;
  handleCloseTokenModal: () => void;
}) {
  const [isTransfering, setIsTransfering] = React.useState(false);
  const { transfer: ckbtcTransfer } = useCkBtcLedger();
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const { updateBalance } = useAuth();

  const initialTransferValues = {
    destination: '',
    amount: 0,
  };

  const transferSchema = object().shape({
    destination: string().test('min', 'Not a valid address', (value) => {
      try {
        AccountIdentifier.fromHex(value as string);
        return true;
      } catch {
        return false;
      }
    }),
    amount: number()
      .test('min', 'Minimum 0.00000001 ICP can be sent.', (value) => {
        if (value && value >= 0.00000001) {
          return true;
        } else {
          return false;
        }
      })
      .test(
        'min',
        'Sorry, there are not enough funds in your account',
        (value) => {
          if (userAuth.ckBalance && value) {
            let requiredICP = userAuth.ckBalance - CKBTC_GAS_FEE_INTEGER;
            if (requiredICP >= value) return true;
          } else if (!value) {
            return true;
          } else {
            return false;
          }
        },
      ),
  });

  return (
    <Modal
      centered
      show={showTokenModal}
      onHide={handleCloseTokenModal}
      onClose={handleCloseTokenModal}
    >
      <Modal.Body>
        <h5 className='text-center'>Transfer CKBTC</h5>
        <div className=''>
          <Formik
            initialValues={initialTransferValues}
            validationSchema={transferSchema}
            onSubmit={async (values, actions) => {
              if (!auth.identity) {
                return;
              }
              try {
                setIsTransfering(true);
                // let acc: any = AccountIdentifier.fromHex(values.destination);
                // logger(acc.toHex(), 'acccccc');
                let _transferHash = await ckbtcTransfer(
                  values.amount * E8S,
                  values.destination,
                );
                if (_transferHash) {
                  setIsTransfering(false);
                  handleCloseTokenModal();
                  toast.success('Transfer Successfull');
                } else {
                  toast.error('Error During Transaction');

                  setIsTransfering(false);
                }
              } catch (err) {
                toast.error('Error During Transaction');
                logger(err, 'transaction err');
                setIsTransfering(false);
              }
              // setConfirmTransaction(true);
              // formikRef.current?.handleSubmit();
              // await uploadEntry(values, actions);
            }}
          >
            {({
              errors,
              touched,
              handleChange,
              handleBlur,
              isValid,
              dirty,
              setFieldValue,
            }) => (
              <FormikForm className='flex w-full flex-col items-center justify-center'>
                <Field name='destination'>
                  {({ field, formProps }: any) => (
                    <Form.Group
                      className='mb-2'
                      controlId='exampleForm.ControlInput1'
                    >
                      <div className='d-flex justify-content-between w-100'>
                        <Form.Label>{'Destination'}</Form.Label>
                      </div>

                      <Form.Control
                        type='text'
                        placeholder={'Destination'}
                        value={field.value}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name='destination'
                      />
                    </Form.Group>
                  )}
                </Field>
                <div className='text-danger mb-2'>
                  <ErrorMessage
                    className='Mui-err'
                    name='destination'
                    component='div'
                  />
                </div>
                <Field name='amount'>
                  {({ field, formProps }: any) => (
                    <Form.Group
                      className='mb-2 balanceInput'
                      controlId='exampleForm.ControlInput1'
                    >
                      <div className='d-flex justify-content-between w-100'>
                        <Form.Label>{'Amount'}</Form.Label>
                      </div>

                      <Form.Control
                        type='number'
                        placeholder={'Amount'}
                        value={field.value}
                        onInput={handleBlur}
                        onChange={handleChange}
                        name='amount'
                      />
                      <span
                        className='maxValueBtn'
                        onClick={() => {
                          setFieldValue(
                            'amount',
                            userAuth.ckBalance
                              ? (
                                  userAuth.ckBalance - CKBTC_GAS_FEE_INTEGER
                                ).toFixed(8)
                              : 0,
                          );
                        }}
                      >
                        Max
                      </span>
                    </Form.Group>
                  )}
                </Field>
                <div className='text-danger mb-2'>
                  <ErrorMessage
                    className='Mui-err'
                    name='amount'
                    component='div'
                  />
                </div>
                <div className='btn-list-div'>
                  <Button
                    className='reg-btn trans-white'
                    disabled={isTransfering}
                    onClick={handleCloseTokenModal}
                  >
                    {'Cancel'}
                  </Button>
                  <Button
                    className='reg-btn'
                    disabled={isTransfering || !(isValid && dirty)}
                    type='submit'
                  >
                    {isTransfering ? <Spinner size='sm' /> : 'Transfer'}
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default TransferCKBTCModal;
