'use client';
import React, { useEffect, useState } from 'react';


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
import UserTransactions from '@/components/Components/UserTransactions';
import logger from '@/lib/logger';
import {
  copyPrincipal,
  getUserAssets,
  handleTransferError,
} from '@/components/utils/fantasy';
import UserTeams from '@/components/Components/UserTeams';
import LeaderBoardSvg from '@/components/Icons/LeaderboardSvg';
import GiftSvg from '@/components/Icons/GiftSvg';
import CupSvg from '@/components/Icons/CupSvg';
import { fromE8S, getCKBTCBalance } from '@/lib/ledger';
import { useRouter } from 'next/navigation';

import CKBTC from '@/components/Icons/CKBTC';
import { END_DATE, START_DATE } from '@/constant/fantasticonst';
import MyLiveRank from '@/components/Components/MyLiveRank';

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
  const [userAssets, setUserAssets] = useState({
    participated: 0,
    contestWon: 0,
    rewardsWon: 0,
    totalEarning: 0,
  });

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
      toast.success('Error while updating profile');
    }
    setIsUpdating(false);
  }
  function handleGetAssets() {
    let userPincipal = auth?.identity?.getPrincipal().toString();

    getUserAssets(auth.actor, userPincipal, setUserAssets);
  }



  useEffect(() => {
    if (auth.identity) {
      let userPincipal = auth?.identity?.getPrincipal().toString();
      setuserPrincipal(userPincipal);
      getUserAssets(auth.actor, userPincipal, setUserAssets);
   
    

      // getWinningContest(userPincipal);// !!use to get user nfts which user has won
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
                <div className='profile-info'>
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
                  <div className={`right-pnl `}>
                    <div className='text-pnl'>
                      <h4 className='Nasalization text-uppercase whitecolor'>
                        Your <span>Stats</span>
                      </h4>
                      <ul className='total-stat-list'>
                        <li>
                          <h5>Total Participated Contests</h5>
                          <div className='stat-container custom_margin'>
                            <span>
                              <LeaderBoardSvg />
                            </span>
                            <span>{userAssets?.participated}</span>
                          </div>
                        </li>
                        <li>
                          <h5>Total Contests Won</h5>
                          <div className='stat-container custom_margin'>
                            <span>
                              <GiftSvg />
                            </span>
                            <span>{userAssets?.contestWon}</span>
                          </div>
                        </li>
                        <li>
                          <h5>Total Rewards Won</h5>
                          <div className='stat-container custom_margin'>
                            <span>
                              <CupSvg />
                            </span>
                            <span>{fromE8S(userAssets?.rewardsWon, true)}</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                 

                    <div className='nft-details-container'>
                   
                      <div className='dashboard-btn-cntnr'>
                        <div className='d-flex'>
                       
                       
                          <h6 className='ml-2'>
                            <CKBTC />
                            {userAuth?.ckBalance ?? "  0"}
                          </h6>
                          <h6 className='ml-2'>
                            <img
                              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/infinte.png'
                              alt='Infinte Logo'
                            />
                            {userAuth.balance}
                          </h6>
                          
                        </div>                      
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
           
          </Container>
        </Row>
      </Container>
    
      {/* My Live Rank Panel */}
      <Container fluid>
        <Row>
          <Container>
            <Row>
              <Col xl='12' lg='12' md='12' sm='12'>
                <div className='spacer-50' />
                <div className='gray-panel web-view-trans'>
                  <h2>
                    My Live <span>Ranking</span>
                  </h2>
                  <MyLiveRank />
                </div>
                <div className='spacer-50' />
              </Col>
            </Row>
          </Container>
        </Row>
      </Container>
      {/* My Live Rank Panel */}
      <Container fluid>
        <Row>
          <Container>
            <Row>
              <Col xl='12'>
                <UserTeams handleGetAssets={handleGetAssets} dashboard={true} />
                <UserTransactions />
                <div className='spacer-50' />
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
