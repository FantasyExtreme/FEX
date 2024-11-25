import React, { useEffect, useRef, useState } from 'react';
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
  Dropdown,
  Form,
  Modal,
  Nav,
  NavDropdown,
  NavLink,
  Spinner,
} from 'react-bootstrap';
import { object, string } from 'yup';

import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import logger from '@/lib/logger';
import { toast } from 'react-toastify';
import { Principal } from '@dfinity/principal';
import { fromNullable } from '@dfinity/utils';

interface Props {
  contestId: string;
  show: boolean;
  handleClose: () => void;
}
interface SelectedTeam {
  teamId: string | null;
  teamName: string | null;
}
const AddReferalLink = ({
  contestId,
  show,
  handleClose,
}: Props) => {
  const [playerSquads, setPlayerSquads] = useState<any>([]);
  const { auth, userAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
  }));
  let formRef=useRef(null)
  const [contestReferalAdding, setContestRefAdding] = useState(false);
  const [communityId, setCommunityId] = useState<null | number>(null);

  const initialTransferValues = {
    communityId: '',
  };

  const transferSchema = object().shape({
    communityId: string().trim().required("Community Id is required"),
   
  });
 /**
  * use to get referal id of contest
  */
  async function getCommunityIdBycontestId() {
    try {
      let res=await auth.actor.getCommunityIdBycontestId(contestId);
      let contestReferalId=fromNullable(res);
      logger(formRef.current, 'cotnest referal');
      if(contestReferalId){
        formRef?.current?.setFieldValue("communityId",contestReferalId);
        setCommunityId(contestReferalId)
        // formRef.current
      }
    
    } catch (error) {
      logger(error, 'getting it err');
    }
  }
  /**
   * 
   * @param values 
   */
  let handleAddCommunityIdToContest=async (values:any)=>{
    setContestRefAdding(true)
    try {
      let res=await auth.actor.addCommunityIdToContest(contestId,values.communityId);
      if(res?.ok){
        toast.success(res.ok);
        handleClose()
      }
      if(res?.err){
        toast.error(res.err);

      }
    } catch (error) {
      logger(error, 'error adding referal link');
      
    }finally{
      setContestRefAdding(false)
    }
  }
   /**
   * 
   * @param values 
   */
   let handleDeleteCommunityIdFromContest=async (communityId:any)=>{
    setContestRefAdding(true)
    try {
      let res=await auth.actor.deleteCommunityIdfromContest(contestId,communityId);
      if(res?.ok){
        toast.success(res.ok);
        handleClose()
      }
      if(res?.err){
        toast.error(res.err);

      }
    } catch (error) {
      logger(error, 'error deleting referal link');
      
    }finally{
      setContestRefAdding(false)
    }
  }
 
  useEffect(() => {
    if (auth.state == 'initialized' && contestId) {
      getCommunityIdBycontestId();
    }
  }, [auth, contestId]);

  return (
    <>
      <Modal
        centered
        show={show}
        className='fade light'
        onHide={() => {
          handleClose();
   
        }}
        onClose={() => {
          handleClose();
          
        }}
      >
        <Modal.Body className='contestModle'>
        <h5 className='text-center'>Add Community Id</h5>
        <div className=''>
          <Formik
            initialValues={initialTransferValues}
            innerRef={formRef}
            validationSchema={transferSchema}
            onSubmit={async (values, actions) => {
              handleAddCommunityIdToContest(values)
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
                <Field name='communityId'>
                  {({ field, formProps }: any) => (
                    <Form.Group
                      className='mb-2'
                     
                    >  <p className='text-danger'>Once you add you can't edit.</p>
                    
                      <div className='d-flex justify-content-between w-100'>
                        <Form.Label>{'Community Id'}</Form.Label>
                      </div>
<div className='communityBox'>


                      <Form.Control
                        type='text'
                        placeholder={'Community Id'}
                        value={field.value}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        name='communityId'
                      />
                        {communityId && <div className='delCummunityId' onClick={()=>handleDeleteCommunityIdFromContest(communityId)}>
                    <i className="fa fa-trash" aria-hidden="true"/>

                  </div>}
                  </div>
                    </Form.Group>
                    
                  )}
                
                </Field>
                
                <div className='text-danger mb-2'>
                  <ErrorMessage
                    className='Mui-err'
                    name='communityId'
                    component='div'
                  />
                </div>
         
                <div className='btn-list-div'>
                  <Button
                    className='reg-btn trans-white'
                    disabled={contestReferalAdding}
                    onClick={handleClose}
                  >
                    {'Cancel'}
                  </Button>
                  <Button
                    className='reg-btn'
                    disabled={contestReferalAdding }
                    type='submit'
                  >
                    {contestReferalAdding ? <Spinner size='sm' /> : 'Add'}
                  </Button>
                </div>
              </FormikForm>
            )}
          </Formik>
        </div>
     
        </Modal.Body>
      </Modal>

    </>
  );
};

export default AddReferalLink;
