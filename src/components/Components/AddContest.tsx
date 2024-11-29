'use client';
import React, { useEffect, useRef, useState } from 'react';
import { date, object, string, number, array } from 'yup';
import { Spinner, Modal, Form, Button } from 'react-bootstrap';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FieldArray,
} from 'formik';
import {
  MAX_NAME_CHARACTERS,
  MIN_NAME_CHARACTERS,
  Messages,
  ONLY_ALPHABET,
  Validations,
} from '@/constant/validations';
import logger from '@/lib/logger';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { toast } from 'react-toastify';
import { getContest } from '../utils/fantasy';
import { Contest } from '@/types/fantasy';
import { fromE8S } from '@/lib/ledger';
import Tippy from '@tippyjs/react';
import { ContestPayment, PaymentsArray, PaymentTypes } from '@/constant/variables';

interface Props {
  matchId: string | null;
  showModal: boolean;
  updateId: string | null;
  handleCloseModal: () => void;
  handleShowModal: () => void;
}
const AddContest = ({
  matchId,
  handleCloseModal,
  handleShowModal,
  showModal,
  updateId,
}: Props) => {
  const [saving, setSaving] = useState(false);
  const [oldContest, setOldContest] = useState<Contest | null>(null);
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  const initialContest = {
    name: oldContest?.name ?? '',
    slots: oldContest?.slots ?? '',
    entryFee: oldContest?.entryFee ?? '',
    rewardDistribution: oldContest?.rewardDistribution ?? [],
    minCap: oldContest?.minCap ?? '',
    teamsPerUser: oldContest?.teamsPerUser ?? '',
    rules: oldContest?.rules ?? '',
    paymentMethod: oldContest?.paymentMethod ?? '',
    // maxCap: '',
  };
  const heading = updateId ? 'Update Contest' : 'Add Contest';
  const button = updateId ? 'Update' : 'Add';

  const contestSchema = object().shape({
    name: string()
      .required(Messages.contest.name.min)
      .max(Validations.contests.name.max, Messages.contest.name.min)
      .min(MIN_NAME_CHARACTERS, Messages.contest.name.max),
    slots: number()
      .required(Messages.contest.slots.req)
      .min(Validations.contests.slots.min, Messages.contest.slots.min),
    entryFee: number()
      .required(Messages.contest.entryFee.req)
      .min(Validations.contests.entryFee.min, Messages.contest.entryFee.min),
    // minCap: number()
    //   .required(Messages.contest.minCap.req)
    //   .min(Validations.contests.minCap.min, Messages.contest.minCap.min),
    teamsPerUser: number()
      .required(Messages.contest.teamsPerUser.req)
      .min(
        Validations.contests.teamsPerUser.min,
        Messages.contest.teamsPerUser.min,
      ),
    rules: string().required(Messages.contest.rules.req),
    paymentMethod: string().required(),
    // maxCap: number()
    //   .required(Messages.contest.maxCap.req)
    //   .min(Validations.contests.maxCap.min, Messages.contest.maxCap.min),
    // rewardDistribution: array()
    //   .of(
    //     object().shape({
    //       from: number().min(1, 'From is required'),
    //       to: number().min(1, 'To is required'),
    //       amount: number().min(1, 'Amount is required'),
    //     }),
    //   )
    //   .min(1, 'Please add atleast one Reward'),
  });
  async function handleContest(values: any, actions: any) {
    try {
      setSaving(true);
      // const _rewardDistribution: any = [];
      // let keys = Object.keys(values);
      // keys.map((key: any) => {
      //   if (values[key]?.from > 0) {
      //     _rewardDistribution.push(values[key]);
      //   }
      // });
      // let _rewardDistribution = values.rewardDistribution?.map((r: any) => ({
      //   to: Number(r.to),
      //   from: Number(r.from),
      //   amount: Number(r.amount),
      // }));

      const contest = {
        name: values.name,
        slots: values.slots,
        entryFee: values.entryFee,
        teamsPerUser: values.teamsPerUser,
        rules: values.rules,
        paymentMethod: values.paymentMethod,
        // rewardDistribution: _rewardDistribution,
        rewardDistribution: [],
        matchId,
        // minCap: values.minCap,
        minCap: 0,
        maxCap: 0,
        providerId: '0',
        isDistributed: false,
      };
      logger(contest, 'foormm gothca');
      let respContest;
      if (updateId) {
        respContest = await auth.actor.updateContest(contest, updateId);
      } else {
        respContest = await auth.actor.addContest(contest);
      }
      logger({ contest, updateId, respContest }, 'foormm gothca');
      if (respContest?.ok) {
        toast.success(respContest?.ok);
        handleCloseModal();
      } else {
        toast.error(respContest?.err);
      }
      logger(respContest, 'we did this k?');
    } catch (error) {
      toast.error('Error');
      logger(error, 'error adding contest');
    }
    setSaving(false);
  }

  useEffect(() => {
    logger({ updateId }, 'foormm gothca');

    if (updateId) {
      getContest(auth.actor, updateId, setOldContest);
    } else {
      setOldContest(null);
    }
  }, [showModal, updateId]);
  return (
    <Modal show={showModal} centered className='mt-5' onHide={handleCloseModal}>
      <Modal.Body className='mt-5'>
        <h5 className='text-center'>{button} Contest</h5>
        <Formik
          initialValues={initialContest}
          validationSchema={contestSchema}
          valid
          enableReinitialize
          onSubmit={async (values: any, actions) => {
            handleContest(values, actions);
            // await newContest(values);
          }}
        >
          {({
            errors,
            touched,
            handleChange,
            handleBlur,
            isValid,
            dirty,
            values,
          }) => (
            <FormikForm className='flex w-full flex-col items-center justify-center'>
              <Field name='name'>
                {({ field, formProps }: any) => (
                  <Form.Group className='mb-2'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='text'
                      placeholder={'Enter Contest Name'}
                      value={field.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onInput={handleChange}
                      name='name'
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage className='Mui-err' name='name' component='div' />
              </div>
              <Field name='slots'>
                {({ field, formProps }: any) => (
                  <Form.Group className='mb-2'>
                    <Form.Label>Slots</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder={'Enter the amount of slots'}
                      value={field.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onInput={handleChange}
                      name='slots'
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='slots'
                  component='div'
                />
              </div>
              <Field name='paymentMethod'>
                {({ field, form }: any) => (
                  <Form.Group className='mb-2'>
                    <Form.Label>Payment Method</Form.Label>
                    <Form.Select
                      {...field}
                      onChange={(e) => {
                        form.setFieldValue('paymentMethod', e.target.value);
                      }}
                      disabled={updateId}
                    >
                      <option value=''>Select Payment Method</option>
                      {PaymentsArray.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                          
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='paymentMethod'
                  component='div'
                />
              </div>
              <Field name='entryFee'>
                {({ field, form }: any) => (
                  <Form.Group className='mb-2'>
                    <Form.Label>Entry Fees (In E8S)</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder={'Enter Entry Fees'}
                      value={field.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onInput={handleChange}
                      name='entryFee'
                    />
                    <span className='color'>
                      {' '}
                      IN {ContestPayment.get(form.values.paymentMethod)?.name}: {fromE8S(field.value)}
                      </span>
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='entryFee'
                  component='div'
                />
              </div>
              <Field name='teamsPerUser'>
                {({ field, formProps }: any) => (
                  <Form.Group className='mb-2'>
                    <Form.Label>Teams Per User</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder={'Enter Teams Per User'}
                      value={field.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onInput={handleChange}
                      name='teamsPerUser'
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='teamsPerUser'
                  component='div'
                />
              </div>
             
              <Field name='rules'>
                {({ field, formProps }: any) => (
                  <Form.Group className='mb-2'>
                    <Tippy
                      content={<span>Separate each rule with a "," comma</span>}
                      className='dark-tippy'
                    >
                      <Form.Label>
                        Rules <i className='fa fa-info-circle fa-sm '></i>
                      </Form.Label>
                    </Tippy>
                    <Form.Control
                      type='text'
                      as='textarea'
                      className='control-area'
                      placeholder={'Enter Contest Rules'}
                      value={field.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onInput={handleChange}
                      name='rules'
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='rules'
                  component='div'
                />
              </div>
              {/* <Field name='minCap'>
                {({ field, formProps }: any) => (
                  <Form.Group className='mb-2'>
                    <Form.Label>Minimum Cap</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder={'Enter Minimum Cap'}
                      value={field.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onInput={handleChange}
                      name='minCap'
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='minCap'
                  component='div'
                />
              </div> */}
              {/* <Field name='maxCap'>
                {({ field, formProps }: any) => (
                  <Form.Group className='mb-2'>
                    <Form.Label>Maximum Cap</Form.Label>
                    <Form.Control
                      type='number'
                      placeholder={'Enter Maximum Cap'}
                      value={field.value}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      onInput={handleChange}
                      name='maxCap'
                    />
                  </Form.Group>
                )}
              </Field>
              <div className='text-danger mb-2'>
                <ErrorMessage
                  className='Mui-err'
                  name='maxCap'
                  component='div'
                />
              </div> */}
              {/* <Form.Label className='fw-bold my-2'>
                Reward Distribution
              </Form.Label>
              <FieldArray
                name='rewardDistribution'
                render={(arrayHelpers) => (
                  <>
                    {values.rewardDistribution?.map((r: any, index: number) => (
                      <div key={index} className='my-2'>
                        <Form.Group className='d-flex justify-content-between mb-1 flex-row'>
                          <Field name={`rewardDistribution[${index}].from`}>
                            {({ field, formProps }: any) => (
                              <Form.Group>
                                <Form.Label>From</Form.Label>
                                <Form.Control
                                  type='number'
                                  // placeholder={''}
                                  value={field.value}
                                  onBlur={handleBlur}
                                  min={1}
                                  onChange={(e) => {
                                    arrayHelpers.replace(index, {
                                      ...values.rewardDistribution[index],
                                      from: e.target.value,
                                    });
                                    logger(
                                      {
                                        ...values.rewardDistribution[index],
                                        from: e.target.value,
                                      },
                                      'hiii',
                                    );
                                  }}
                                  onInput={handleChange}
                                  name={`rewardDistribution[${index}].from`}
                                />
                              </Form.Group>
                            )}
                          </Field>
                          <ErrorMessage
                            className='Mui-err'
                            name={`rewardDistribution[${index}].from`}
                            component='div'
                          />
                          <Field name={`rewardDistribution[${index}].to`}>
                            {({ field, formProps }: any) => (
                              <Form.Group>
                                <Form.Label>To</Form.Label>
                                <Form.Control
                                  type='number'
                                  // placeholder={'Enter Entry Fees'}
                                  value={field.value}
                                  onBlur={handleBlur}
                                  min={1}
                                  onChange={(e) =>
                                    arrayHelpers.replace(index, {
                                      ...values.rewardDistribution[index],
                                      to: e.target.value,
                                    })
                                  }
                                  onInput={handleChange}
                                  name={`rewardDistribution[${index}].to`}
                                />
                              </Form.Group>
                            )}
                          </Field>
                          <ErrorMessage
                            className='Mui-err'
                            name={`rewardDistribution[${index}].to`}
                            component='div'
                          />
                        </Form.Group>
                        <Field name={`rewardDistribution[${index}].amount`}>
                          {({ field, formProps }: any) => (
                            <Form.Group className=''>
                              <Form.Label>Amount</Form.Label>
                              <Form.Control
                                type='number'
                                // placeholder={'Enter Entry Fees'}
                                value={field.value}
                                onBlur={handleBlur}
                                min={1}
                                onChange={(e) =>
                                  arrayHelpers.replace(index, {
                                    ...values.rewardDistribution[index],
                                    amount: e.target.value,
                                  })
                                }
                                onInput={handleChange}
                                name={`rewardDistribution[${index}].amount`}
                              />
                            </Form.Group>
                          )}
                        </Field>
                        <ErrorMessage
                          className='Mui-err'
                          name={`rewardDistribution[${index}].amount`}
                          component='div'
                        />
                      </div>
                    ))}
                    <ErrorMessage
                      className='Mui-err'
                      name={`rewardDistribution`}
                      component='div'
                    />
                    <div className='d-flex mt-2 gap-2'>
                      {values.rewardDistribution?.length >
                      Validations.contests.rewardDistribution.min ? (
                        <Button
                          className='reg-btn'
                          onClick={() => arrayHelpers.pop()}
                          id='minusbtn'
                        >
                          -
                        </Button>
                      ) : null}

                      <Button
                        className='reg-btn'
                        id='plusbtn'
                        onClick={() =>
                          arrayHelpers.push(initialContest.rewardDistribution)
                        }
                      >
                        +
                      </Button>
                    </div>
                  </>
                )}
              /> */}

              <div className='d-flex justify-content-end gap-4 mt-3'>
                <Button
                  className='reg-btn'
                  disabled={saving}
                  type='submit'
                  id='submittingBtn'
                >
                  {saving ? <Spinner size='sm' /> : button}
                </Button>
              </div>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default AddContest;
