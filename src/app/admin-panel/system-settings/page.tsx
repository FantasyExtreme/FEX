'use client';
import React, { useEffect, useState } from 'react';

import {
  Row,
  Col,
  Form,
  Button,
  Container,
  Spinner,
  Modal,
  Table,
} from 'react-bootstrap';
import {
  ErrorMessage,
  Field,
  Formik,
  Form as FormikForm,
  FormikValues
} from 'formik';
import useSearchParamsHook from '@/components/utils/searchParamsHook';
import { useAuthStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { ConnectPlugWalletSlice } from '@/types/store';
import {
  getContestTypes,
  isConnected,
} from '@/components/utils/fantasy';
import { DEAFULT_PROPS } from '@/constant/variables';
import { toast } from 'react-toastify';
import {
  AdminSetting,
  ContestType,
  RContestType,
  RContestTypes,
} from '@/dfx/declarations/temp/fantasyfootball/fantasyfootball.did';
import { boolean, number, object, string } from 'yup';
import { convertMotokoObject } from '@/components/utils/convertMotokoObject';
import logger from '@/lib/logger';
import BeatLoader from 'react-spinners/BeatLoader';

export default function SystemSettings() {
  const navigation = useRouter();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<AdminSetting[] | null>(null);
  const [show, setShow] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<AdminSetting | null>(
    null,
  );


  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));

  /**
   * Handles the display of the modal for adding or updating admin settings.
   *
   * @param {AdminSetting} [setting] - The admin setting to be displayed in the modal.
   * If not provided, the modal will be empty for adding a new setting.
   */
  function handleShowModal(setting?: AdminSetting) {
    setSelectedSetting(setting ?? null);
    setShow(true);
  }

 
  /**
   * Handles the display of the warning modal for confirming the deletion of an admin setting.
   *
   * @param {AdminSetting} setting - The admin setting to be deleted.
   */
  function handleShowWarning(setting: AdminSetting) {
    setSelectedSetting(setting);
    setShowWarning(true);
  }

  /**
   * Handles the closing of the admin setting modal.
   */
  function handleCloseModal() {
    setShow(false);
    setSelectedSetting(null);
  }

 
  const settingsValues = {
    settingName: selectedSetting?.settingName ?? '',
    settingValue: selectedSetting?.settingValue ?? '',
  };


  const settingsSchema = object().shape({
    settingName: string().required('Setting Name is required'),
    settingValue: string().required('Setting Value is required'),
  });

  /**
   * Function to add a new admin setting to the system.
   *
   * @param values - The form values containing the setting name and value.
   * @returns Promise - Resolves when the setting is added successfully, rejects otherwise.
   */
  async function addAdminSetting(values: FormikValues) {
    try {
      setLoading(true);
      const resp = await auth.actor.addAdminSetting({
        settingName: values.settingName,
        settingValue: values.settingValue,
        settingType: '',
      });
      toast.success('Setting added successfully');
      handleCloseModal();
    } catch {
      toast.error('Error addming setting');
    }
    setLoading(false);
  }
  /**
   * Function to update an admin setting in the system.
   *
   * @param values - The form values containing the setting name and value.
   * @returns Promise - Resolves when the setting is updated successfully, rejects otherwise.
   */
  async function updateAdminSetting(values: FormikValues) {
    try {
      setLoading(true);
      const resp = await auth.actor.updateAdminSetting({
        settingName: values.settingName,
        settingValue: values.settingValue,
        settingType: '',
      });

      toast.success('Setting updated successfully');
      handleCloseModal();
    } catch {
      toast.error('Error updating setting');
    }
    setLoading(false);
  }
  /**
   * Function to delete an admin setting from the system.
   *
   * @param name - The name of the setting to be deleted.
   * @returns Promise - Resolves when the setting is deleted successfully, rejects otherwise.
   */
  async function deleteAdminSetting(name: string) {
    try {
      setLoading(true);
      const resp = await auth.actor.deleteAdminSetting(name);
      setSettings((prev) => {
        let newArr = prev?.filter((setting) => setting.settingName !== name);
        return newArr ?? null;
      });
      toast.success('Setting deleted');
      setShowWarning(false);
    } catch (error) {
      toast.error('Error deleting setting');
      logger(error);
    }

    setLoading(false);
  }
  /**
   * Retrieves admin settings from the blockchain.
   *
   * @remarks
   * This function fetches admin settings from the blockchain using the provided actor and default properties.
   * It then maps the settings to their corresponding TypeScript objects and sets the settings state.
   *
   * @param auth - The object containing the actor for interacting with the blockchain.
   * @param auth.actor - The actor for interacting with the blockchain.
   * @param DEAFULT_PROPS - The default properties for fetching admin settings.
   *
   * @returns Promise - Resolves when the admin settings are fetched and set, rejects otherwise.
   */
  async function getAdminSettings() {
    const resp = await auth.actor.getAdminSettings(DEAFULT_PROPS);
    let respSettings = resp?.settings?.map((setting: any) =>
      convertMotokoObject(setting),
    );
    setSettings(respSettings);
  }


  useEffect(() => {
    if (!isConnected(auth.state)) return;
    getAdminSettings();
  }, [auth]);
  useEffect(() => {
    if (isConnected(auth.state)) {
      if (!userAuth.userPerms?.admin) {
        navigation.replace('/');
      }
    }
  }, [auth.state]);

  return (
    <>
      {userAuth.userPerms?.admin && (
        <Container fluid className='inner-page'>
          <Row>
            <Container>
              <Row>
                <Col xl='12' lg='12' md='12'>
                  <div className='gray-panel'>
                    <h4 className='animeleft d-flex justify-content-between whitecolor Nasalization fw-normal'>
                      <span>System Settings</span>
                      <Button
                        id='setting'
                        onClick={() => handleShowModal()}
                        disabled={loading}
                        className='reg-btn mid text-capitalize'
                      >
                        Add Admin Setting
                      </Button>
                    </h4>
                    <div className='gray-panel'>
                      <div className='table-container'>
                      <div className='table-inner-container'>
                      <Table>
                        <thead>
                          <tr>
                            <th>Setting Name</th>
                            <th>Setting Value</th>
                            <th>Last Modified By</th>
                            <th>Last Modified Date</th>
                            <th>Functions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {settings?.map((setting: AdminSetting) => (
                            <tr key={setting.settingName}>
                              <td>{setting.settingName}</td>
                              <td>{setting.settingValue}</td>
                              <td>
                                {setting.last_modified_by.substring(0, 5)}
                                ...
                                {setting.last_modified_by.substring(
                                  setting.last_modified_by.length - 5,
                                )}
                                <i
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      setting.last_modified_by,
                                    );
                                    toast.success('Copied to clipboard');
                                  }}
                                  className='fa fa-copy pointer ms-2'
                                />
                              </td>
                              <td>
                                {new Date(
                                  Number(setting.modification_date),
                                ).toLocaleString()}
                              </td>
                              <td>
                                <div className='d-flex gap-2'>
                                  <i
                                    onClick={() => handleShowModal(setting)}
                                    className='pointer fa fa-edit'
                                  />
                                  <i
                                    onClick={() => handleShowWarning(setting)}
                                    className='pointer fa fa-trash'
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      </div>
                      </div>
                    </div>
                    <div className='spacer-30' />

                    {/* {loading && <Spinner size='sm' />}
                    {saved && <div>Saved!</div>} */}
                  </div>
                </Col>
        
              </Row>
            </Container>
          </Row>
        </Container>
      )}
 
      <Modal show={show} centered onHide={handleCloseModal}>
        <Modal.Body>
          <h5 className='text-center'>
            {selectedSetting ? 'Update' : 'Add'} Setting
          </h5>
          <Formik
            initialValues={settingsValues}
            validationSchema={settingsSchema}
            enableReinitialize
            onSubmit={async (values, actions) => {
              if (selectedSetting) {
                await updateAdminSetting(values);
              } else {
                await addAdminSetting(values);
              }
              getAdminSettings();
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
                <Field name='settingName'>
                  {({ field, formProps }: any) => (
                    <Form.Group
                      className='mb-2 system-setting'
                      controlId='exampleForm.ControlInput1'
                    >
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder={'Enter Setting Name'}
                        value={field.value}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onInput={handleChange}
                        disabled={selectedSetting? true :false}
                        name='settingName'
                      />
                    </Form.Group>
                  )}
                </Field>
                <div className='text-danger mb-2'>
                  <ErrorMessage
                    className='Mui-err'
                    name='settingName'
                    component='div'
                  />
                </div>{' '}
                <Field name='settingValue'>
                  {({ field, formProps }: any) => (
                    <Form.Group className='mb-2'>
                      <Form.Label>Value</Form.Label>
                      <Form.Control
                        type='text'
                        placeholder={'Enter Setting Value'}
                        value={field.value}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onInput={handleChange}
                        name='settingValue'
                      />
                    </Form.Group>
                  )}
                </Field>
                <div className='text-danger mb-2'>
                  <ErrorMessage
                    className='Mui-err'
                    name='settingValue'
                    component='div'
                  />
                </div>
                <div className='btn-list-div'>
                  <Button
                    className='reg-btn'
                    disabled={loading}
                    type='submit'
                    id='submit_btn'
                  >
                    {loading ? (
                      <Spinner size='sm' />
                    ) : selectedSetting ? (
                      'Update'
                    ) : (
                      'Add'
                    )}
                  </Button>
                  <Button
                    id='cancel_btn'
                    className='reg-btn trans-white mid text-capitalize mx-2'
                    disabled={loading}
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
      <Modal show={showWarning} centered onHide={() => setShowWarning(false)}>
        <Modal.Body className='text-center'>
          <h5 className='text-center'>Are you sure?</h5>
          <p className='text-center'>
            Are you sure you want to delete this{' '}
            <b>({selectedSetting?.settingName})</b> setting?
          </p>
          <div className='d-flex justify-content-center gap-4'>
            <Button
              id='spinner_del_btn'
              className='reg-btn'
              disabled={loading}
              onClick={async () => {
                await deleteAdminSetting(selectedSetting?.settingName || '');
              }}
            >
              {loading ? <Spinner size='sm' /> : 'Delete'}
            </Button>
            <Button
              id='cancelBtn'
              className='reg-btn trans-white mid text-capitalize mx-2'
              onClick={() => setShowWarning(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
