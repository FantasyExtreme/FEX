'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
// import Logo from '../../assets/old-images/logo1.png';
import Logo from '../../assets/images/logo/logo.png';
import user from '../../assets/images/user.png';
import Link from 'next/link';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import authMethods from '@/lib/auth';
import RingLoader from 'react-spinners/RingLoader';
import { date, object, string, number } from 'yup';
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
} from 'react-bootstrap';
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
import logger from '@/lib/logger';
import { toast } from 'react-toastify';
import { isConnected } from '../utils/fantasy';
import { MATCHES_ROUTE } from '@/constant/routes';

export default function NavBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { auth, userAuth, setUserAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));
  const handleClose = () => {
    setIsLoading(false);
  };
  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const methods = authMethods({
    useAuthStore,
    setIsLoading,
    handleClose,
  });

  const pfValues = {
    name: userAuth?.name ?? '',
    email: userAuth?.email ?? '',
  };

  const pfSchema = object().shape({
    name: string()
      .required('Name is required')
      .matches(ONLY_ALPHABET, 'Only alphabets are allowed')
      .max(MAX_NAME_CHARACTERS, 'Name can not be more than 40 characters')
      .min(MIN_NAME_CHARACTERS, 'Name can not be less than 3 characters'),
    email: string().trim().matches(EMAIL_VALIDATION, 'Invalid Email'),
  });

  async function updateProfile(values: FormikValues) {
    setIsUpdating(true);
    let user = {
      name: values.name,
      email: values.email,
    };
    try {
      let newUser = await auth.actor.addUser(user);
      setUserAuth({
        ...userAuth,
        name: user.name,
        email: user.email,
      });
      toast.success('Profile updated successfully');
      handleCloseModal();
    } catch (error) {
      toast.success('Error while updating profile');
      logger(error);
    }
    setIsUpdating(false);
  }
  function copyPrincipal() {
    window.navigator.clipboard.writeText(
      auth.identity.getPrincipal().toString(),
    );
    toast.success('Principal copied to clipboard', { autoClose: 750 });
  }

  useEffect(() => {
    if (auth) {
      methods.initAuth();
    }
  }, []);

  return (
    <>
      <Navbar expand='lg' className='bg-body-tertiary'>
        <Container fluid>
          <Navbar.Brand href='/'>
            {' '}
            <Image width={282} height={39} src={Logo} alt='logo' />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='navbarScroll' />
          <Navbar.Collapse id='navbarScroll'>
            <Nav
              className='my-lg-0 me-auto align-items-center my-2'
              style={{ maxHeight: '100vh' }}
              navbarScroll
            >
              <Nav.Link as={Link} href={MATCHES_ROUTE}>
                Matches
              </Nav.Link>
              <Nav.Link href='#action2'>Schedule</Nav.Link>
              <Nav.Link href='#action2'>Media</Nav.Link>
              <Nav.Link href='/playerselection'>Players</Nav.Link>
              <Nav.Link href='#action2'>Contact</Nav.Link>

              {isConnected(auth) ? (
                <NavDropdown
                  title={
                    <>
                      <div className='user-button'>
                        <div>
                          <h6>{userAuth?.name}</h6>
                          <p>{userAuth?.email}</p>
                        </div>
                        <Image src={user} alt='User' />
                      </div>
                    </>
                  }
                  id='navbarScrollingDropdown'
                >
                  {isConnected(auth) && (
                    <>
                      <NavDropdown.Item onClick={handleShowModal}>
                        Update Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={copyPrincipal}>
                        Copy Principal
                      </NavDropdown.Item>
                    </>
                  )}
                  <NavDropdown.Item href='#action3'>
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href='#action4'>My Wallet</NavDropdown.Item>
                  <NavDropdown.Item href='#action5' onClick={methods.logout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Button
                  onClick={methods.login}
                  disabled={isLoading}
                  className='reg-btn m-1 w-loader'
                >
                  {!isLoading && 'Connect'}
                  <RingLoader size={20} loading={isLoading} />
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Modal show={showModal} centered onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                <div className='d-flex justify-content-end gap-4'>
                  <Button
                    className='reg-btn'
                    disabled={isUpdating}
                    type='submit'
                  >
                    {isUpdating ? <Spinner size='sm' /> : 'Update'}
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
