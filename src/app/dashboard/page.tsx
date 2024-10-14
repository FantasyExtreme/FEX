'use client';
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/Components/NavBar';
import Footer from '@/components/Components/Footer';
import NFTpic from '@/assets/images/NFTImage.png';
import { ConnectPlugWalletSlice } from '@/types/store';
import { useAuthStore } from '@/store/useStore';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikProps,
  FormikValues,
  FormikHelpers,
  useFormikContext,
} from 'formik';
import {
  EMAIL_VALIDATION,
  MAX_NAME_CHARACTERS,
  MIN_NAME_CHARACTERS,
  ONLY_ALPHABET,
} from '@/constant/validations';
import { date, object, string, number } from 'yup';
import { toast } from 'react-toastify';
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Spinner,
  Modal,
  Table,
  ProgressBar,
} from 'react-bootstrap';
import logger from '@/lib/logger';
import {
  copyPrincipal
} from '@/components/utils/fantasy';
import { useRouter } from 'next/navigation';
import Tippy from '@tippyjs/react';
import { TransferFromError } from '@dfinity/ledger-icp/dist/candid/ledger';


export default function Dashboard() {
  const { auth, userAuth, setUserAuth, principal } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
    principal: (state as ConnectPlugWalletSlice).principal,
  }));
 
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userPrincipal, setuserPrincipal] = useState('');

  let router = useRouter();


  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const pfValues = {
    name: userAuth?.name ?? '',
    email: userAuth?.email ?? '',
  };

  const pfSchema = object().shape({
    name: string()
      .required('Name is required')
      .trim()
      .max(MAX_NAME_CHARACTERS, 'Name can not be more than 40 characters')
      .min(MIN_NAME_CHARACTERS, 'Name can not be less than 3 characters'),
    email: string().trim().matches(EMAIL_VALIDATION, 'Invalid Email'),
  });

  /**
   * updateProfile use to update user profile
   * @param values
   * @returns null
   */
  async function updateProfile(values: FormikValues) {
    setIsUpdating(true);
    let user = {
      name: values.name,
      email: values.email,
    };
    try {
      let newUser = await auth.actor.updateUser(user);
      if (newUser?.ok) {
        setUserAuth({
          ...userAuth,
          name: user.name,
          email: user.email,
        });
        toast.success('Profile updated successfully');
        handleCloseModal();
      }
      if (newUser?.err) {
        toast.error(newUser?.err);
      }
    } catch (error) {
      console.log("dsajhgfadfsadfasdfsadf",error);
      
      toast.error('Error while updating profile');
    }
    setIsUpdating(false);
  }


  /**
   * formatNumber use to fix the number if decimal to 2 decimal point
   * @param num
   * @returns
   */
  function formatNumber(num: number) {
    // Check if the number is an integer
    if (Number.isInteger(num)) {
      return num;
    } else {
      return num.toFixed(2);
    }
  }
  
  /**
   * use to check is it staging or production project
   * @returns boolean
   */


  useEffect(() => {
    if (auth.identity) {
      let userPincipal = auth?.identity?.getPrincipal().toString();
      setuserPrincipal(userPincipal);
    } else {
      setuserPrincipal('');
    }
    if (!auth.isLoading && auth.state === 'anonymous') {
      router.replace('/');
    }
  }, [auth]);
  return (
    <>
      <Container fluid className='profile-header'>
        <Row>
          <Container>
            <Row>
              <Col xl='12'>
                <div className='profile-info d-flex justify-content-center mb-5'>
                  <div className='profile-info'>
                    <div className='profile-picture'>
                      <img
                        src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/profileplaceholder.png'
                        alt='Profile Pic'
                      />
                      <span onClick={handleShowModal}>
                        <i className='fa fa-pencil' />
                      </span>
                    </div>
                    <h4 className='whitecolor'>
                      {userAuth.name.split(' ').map((part, index) => (
                        <React.Fragment key={index}>
                          {index === 0 ? part : <span>{' ' + part}</span>}{' '}
                        </React.Fragment>
                      ))}
                    </h4>
                    <h5
                      onClick={() => copyPrincipal(auth)}
                      className='dashboard_principal'
                    >
                      {userPrincipal?.slice(0, 7)}...{userPrincipal?.slice(-7)}
                    </h5>
                  </div>
                  
                    
                    
                </div>
              </Col>
            </Row>
           
          </Container>
        </Row>
      </Container>
    
   
      <Modal show={showModal} centered onHide={handleCloseModal}>
        <Modal.Body>
          <h5 className='text-center'>Update Profile</h5>
          <Formik
            initialValues={pfValues}
            validationSchema={pfSchema}
            onSubmit={async (values, actions) => {
              await updateProfile(values);
            }}
          >
            {({
              errors,
              touched,
              handleChange,
              handleBlur,
              isValid,
              dirty,
            }) => (
              <FormikForm className='flex w-full flex-col items-center justify-center'>
                <Field name='name'>
                  {({ field, formProps }: any) => (
                    <Form.Group
                      className='mb-2'
                      controlId='exampleForm.ControlInput1'
                    >
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder={'Enter Name'}
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
                  <ErrorMessage
                    className='Mui-err'
                    name='name'
                    component='div'
                  />
                </div>{' '}
                <Field name='email'>
                  {({ field, formProps }: any) => (
                    <Form.Group
                      className='mb-2'
                      controlId='exampleForm.ControlInput1'
                    >
                      <Form.Label>Email (Optional)</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder={'Enter Email'}
                        value={field.value}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onInput={handleChange}
                        name='email'
                      />
                    </Form.Group>
                  )}
                </Field>
                <div className='text-danger mb-2'>
                  <ErrorMessage
                    className='Mui-err'
                    name='email'
                    component='div'
                  />
                </div>
                <div className='spacer-10' />
                <div className='d-flex justify-content-center gap-2'>
                  <Button
                    className='reg-btn'
                    disabled={isUpdating}
                    type='submit'
                  >
                    {isUpdating ? <Spinner size='sm' /> : 'Update'}
                  </Button>
                  <Button
                    className='reg-btn trans-white mid text-capitalize mx-2'
                    disabled={isUpdating}
                    onClick={handleCloseModal}
                  >
                    Cancel
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
}
