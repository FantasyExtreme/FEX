import { GAS_FEE, GAS_FEE_ICP, LoginEnum } from '@/constant/fantasticonst';
import { useAuthStore } from '@/store/useStore';
import { ConnectPlugWalletSlice } from '@/types/store';
import React, { useEffect, useState } from 'react';
import { Button, CloseButton, Modal, Spinner } from 'react-bootstrap';
import NFIDLogo from '@/assets/tempImages/NFID.png';
import ConnectII from '@/assets/tempImages/ConnectII.png';
import ConnectNFID from '@/assets/tempImages/ConnectNFID.png';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import authMethods from '@/lib/auth';
import useAuth from '@/lib/auth';
interface Props {
  show: boolean;
  hideModal: () => void;
  callBackfn: () => void;
}

function ConnectModal({ show, hideModal, callBackfn }: Props) {
  const [selected, setSelected] = useState<LoginEnum | null>(null);
  // const [isLoading, setIsLoading] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const navigation = useRouter();
  const { auth, userAuth, setUserAuth } = useAuthStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    userAuth: (state as ConnectPlugWalletSlice).userAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
  }));
  const { login } = useAuth();
  const handleClose = () => {
    // setIsLoading(false);
  };
  function handleShowConnect() {
    setShowConnect(true);
  }
  function handleHideConnect() {
    setShowConnect(false);
  }

  // const methods = authMethods({
  //   useAuthStore,
  //   setIsLoading,
  //   handleClose,
  // });
  async function handleLogin(type: LoginEnum) {
    setSelected(type);
    login(type, navigation, callBackfn);
  }

  useEffect(() => {
    if (auth.state == 'initialized') hideModal();
  }, [auth.isLoading]);

  return (
    <Modal
      className='light connect-modal'
      backdrop={auth.isLoading ? 'static' : true}
      show={show}
      centered
      onHide={hideModal}
      // style={{ zIndex: '1000000000 ' }}
    >
      <Modal.Body>
        <Button
          disabled={auth.isLoading}
          className='custome-close-btn '
          onClick={hideModal}
        >
          <i className='fa fa-close ' />
        </Button>
        <div className='d-flex justify-content-center'>
          <img
            src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/logo/logo.png'
            className='connect-logo'
            alt='logo'
          />
        </div>
        <div className='text-center mt-3 white-modal'>
          <p className='text-left'>Connect With Internet Identity </p>
          <Button
            className='reg-btn connect-btn II'
            disabled={auth.isLoading}
            onClick={() => handleLogin(LoginEnum.InternetIdentity)}
            id='handleLogin_identity'
          >
            <img
              src='https://fantasy-extreme-assets.s3.us-east-005.backblazeb2.com/Compressed/infinte.png'
              alt='Infinte Logo'
            />
            {auth.isLoading && selected == LoginEnum.InternetIdentity ? (
              <Spinner size='sm' />
            ) : (
              <span className='rgb II'>Connect</span>
            )}
            <span style={{ width: 55 }}></span>
          </Button>
          <p className='text-left second'>Connect With NFID </p>
          <Button
            className='reg-btn connect-btn NFID'
            disabled={auth.isLoading}
            id='nfid_btn'
            onClick={() => handleLogin(LoginEnum.NFID)}
          >
            <Image alt='NFID' src={NFIDLogo} />
            {auth.isLoading && selected == LoginEnum.NFID ? (
              <Spinner size='sm' />
            ) : (
              <span className='rgb NFID'>Connect</span>
            )}
            <span style={{ width: 66 }}></span>
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ConnectModal;
