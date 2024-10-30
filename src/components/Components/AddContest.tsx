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
import Tippy from '@tippyjs/react';

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
    minCap: oldContest?.minCap ?? '',
    teamsPerUser: oldContest?.teamsPerUser ?? '',
    rules: oldContest?.rules ?? '',
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
    teamsPerUser: number()
      .required(Messages.contest.teamsPerUser.req)
      .min(
        Validations.contests.teamsPerUser.min,
        Messages.contest.teamsPerUser.min,
      ),
    rules: string().required(Messages.contest.rules.req),

  });
  async function handleContest(values: any, actions: any) {
    try {
      setSaving(true);


      const contest = {
        name: values.name,
        slots: values.slots,
        teamsPerUser: values.teamsPerUser,
        rules: values.rules,
        matchId,
        minCap: 0,
        maxCap: 0,
        providerId: '0'
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
