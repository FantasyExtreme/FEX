'use client';
import Header from '@/components/Components/Header';
import React, { useState } from 'react';
import {
  Button,
  Carousel,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from 'react-bootstrap';
import playerimg from '@/assets/images/runningplayer.png';
import Image from 'next/image';
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
import { object, string } from 'yup';
import logger from '@/lib/logger';
import { toast } from 'react-toastify';
import axios from 'axios';
import Link from 'next/link';
import iconfb from '@/assets/images/icons/icon-facebook.png';
import icontiktok from '@/assets/images/icons/icon-tiktok.png';
import iconlinkedin from '@/assets/images/icons/icon-linkedin.png';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { appData } from '@/constant/fantasticonst';
export default function page() {
  const { auth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
  }));
  const [loading, setLoading] = useState(false);
  const initialValues = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };
  const contatcusSchema = object().shape({
    name: string()
      .min(3, 'Name should be at least 3 characters')
      .max(100, "Name can't be more then 100 characters")
      .required('Name is required'),
    email: string().email('Invalid email format').required('Email is required'),
    phone: string()
      .matches(/^[0-9]+$/, 'Phone number is not valid')
      .min(10, 'Phone number should be at least 10 digits')
      .max(15, 'Phone number can be at most 15 digits')
      .required('Phone number is required'),
    message: string()
      .min(10, 'Message should be at least 10 characters')
      .max(3000, "Message can't be more then 3000 characters")
      .required('Message is required'),
  });
  /**
   * handleSubmitform use to send user form info to support via eamil  api
   * @param e
   * @param actions
   */
  let handleSubmitform = async (e: any, actions: any) => {
    setLoading(true);
    let userPincipal = auth?.identity?.getPrincipal().toString() ?? 'Anonymous';
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}sendcontactusform`,
        {
          email: e.email,
          name: e.name,
          phone: e.phone,
          message: e.message,
          url: appData.url,
          principal: userPincipal,
        },
      );

      if (response.status == 200) {
        toast.success(
          "Your message has been successfully submitted. We'll get back to you shortly. Thank you!",
        );
        setLoading(false);
        actions?.resetForm();
      }
    } catch (error) {
      toast.error('There was an issue while sending message');
      setLoading(false);
    }
  };
  return (
    <>
      <Container fluid className='header'>
        <Carousel fade>
          <Carousel.Item>
            <div className='bg-layer' />
          </Carousel.Item>
        </Carousel>
        <div className='bg-layer' />
      </Container>

      <Container fluid className='contactusContainer'>
        <Row>
          <Col
            sm='12'
            md={{ span: 10, offset: 1 }}
            xxl={{ span: 8, offset: 2 }}
          >
            <div className='contactUsBox'>
              <div className='contactusform me-2'>
                <h4>
                  <span>Contact </span>
                  <span>Us!</span>
                </h4>
                <Formik
                  initialValues={initialValues}
                  validationSchema={contatcusSchema}
                  enableReinitialize
                  onSubmit={async (values, actions) => {
                    handleSubmitform(values, actions);
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
                            <Form.Control
                              type='text'
                              placeholder={'Name'}
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
                      <Row>
                        <Col lg={12} xl={6}>
                          <Field name='email'>
                            {({ field, formProps }: any) => (
                              <Form.Group className='mb-2'>
                                <Form.Control
                                  type='email'
                                  placeholder={'Email'}
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
                        </Col>
                        <Col lg={12} xl={6}>
                          <Field name='phone'>
                            {({ field, formProps }: any) => (
                              <Form.Group className='mb-2'>
                                <Form.Control
                                  type='tel'
                                  placeholder={'Phone number'}
                                  value={field.value}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  onInput={handleChange}
                                  name='phone'
                                />
                              </Form.Group>
                            )}
                          </Field>
                          <div className='text-danger mb-2'>
                            <ErrorMessage
                              className='Mui-err'
                              name='phone'
                              component='div'
                            />
                          </div>
                        </Col>
                      </Row>
                      <Field name='message'>
                        {({ field }: any) => (
                          <Form.Group className='mb-2'>
                            <Form.Control
                              type='text'
                              as='textarea'
                              rows={6}
                              placeholder={'Message'}
                              value={field.value}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              onInput={handleChange}
                              name='message'
                              className='textarea'
                            />
                          </Form.Group>
                        )}
                      </Field>
                      <div className='text-danger mb-2'>
                        <ErrorMessage
                          className='Mui-err'
                          name='message'
                          component='div'
                        />
                      </div>
                      <div className='w-100'>
                        <Button
                          id='cancel_btn'
                          type='submit'
                          className='reg-btn trans-white  text-capitalize w-100'
                          disabled={loading}
                        >
                          {loading ? <Spinner size='sm' /> : 'Send'}
                        </Button>
                      </div>
                    </FormikForm>
                  )}
                </Formik>
                <ul className='nav-social-list contactusicons'>
                  <li>
                    <Link
                      target='_blank'
                      href='https://www.facebook.com/FantasyExtremeSports '
                    >
                      <Image src={iconfb} alt='Icon Facebook' />
                    </Link>
                  </li>
                  <li>
                    <Link
                      target='_blank'
                      href='https://www.linkedin.com/company/fantasyextremesports '
                    >
                      <Image src={iconlinkedin} alt='Icon Linkedin' />
                    </Link>
                  </li>
                  <li>
                    <Link
                      target='_blank'
                      href='https://www.tiktok.com/@fexofficials '
                    >
                      <Image src={icontiktok} alt='Icon Tiktok' />
                    </Link>
                  </li>
                  <li>
                    <Link
                      className='rol'
                      target='_blank'
                      href='https://www.youtube.com/channel/UCXXr-1HXeZfBKc5WM3lF8YQ '
                    >
                      <i className='fa fa-youtube-play'></i>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className='imagesec'>
                <Image src={playerimg} fill alt='running player' />
              </div>
            </div>
            <div className='spacer-50' />
          </Col>
        </Row>
      </Container>
    </>
  );
}
