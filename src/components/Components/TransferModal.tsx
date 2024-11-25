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
import { E8S, GAS_FEE, GAS_FEE_ICP } from '@/constant/fantasticonst';
import { makeICPLedgerCanister, makeLedgerCanister } from '@/dfx/service/actor-locator';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import logger from '@/lib/logger';
// import { AccountIdentifier } from '@dfinity/ledger-icp';

function TransferModal({
  showTokenModal,
  handleCloseTokenModal,
}: {
  showTokenModal: boolean;
  handleCloseTokenModal: () => void;
}) {
  const [isTransfering, setIsTransfering] = React.useState(false);
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
          if (userAuth.balance && value) {
            let requiredICP = userAuth.balance - GAS_FEE_ICP;
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
        <h5 className='text-center'>Transfer ICP</h5>
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
                // let acc: any = AccountIdentifier.fromPrincipal({
                //   principal: Principal.fromText(values.destination),
                // });
                let acc: any = AccountIdentifier.fromHex(values.destination);
                logger(acc.toHex(), 'acccccc');

                const ledgerActor = makeICPLedgerCanister({
                  agentOptions: {
                    identity: auth.identity,
                  },
                });
                let transfer = await ledgerActor.transfer({
                  to: acc.bytes,
                  fee: { e8s: GAS_FEE },
                  memo: 1,
                  amount: { e8s: values.amount * E8S },
                  from_subaccount: [],
                  created_at_time: [],
                });

                if (transfer.Ok) {
                  // setIsArticleDraft(false );
                  setIsTransfering(false);
                  handleCloseTokenModal();
                  toast.success('Transfer Successfull');
                  updateBalance();
                  // setConfirmTransaction(false);
                } else if (transfer.Err) {
                  toast.success('Error During Transaction');

                  setIsTransfering(false);
                }
              } catch (err) {
                setIsTransfering(false);
                logger(err, 'error during transfer');
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
                            (userAuth.balance==0 || userAuth.balance <= GAS_FEE_ICP)?0: userAuth.balance - GAS_FEE_ICP,
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

export default TransferModal;
