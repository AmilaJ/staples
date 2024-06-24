
import { FunctionComponent, ReactElement, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import ListIcon from '@mui/icons-material/List';
import logo from '../assets/images/logo.png';
import {
  SignIn,
  SignOutButton,
  useAuthentication,
  useOn,
  Hooks
} from "@asgardeo/react";
import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { colors } from '@mui/material';
import ProductListSelected from './ProductListSelected';

const Header: FunctionComponent = (): ReactElement => {

  interface DecodedToken {
    given_name?: string;
    family_name?: string;
    [key: string]: any;
  };

  const envVariables = import.meta.env;

  const { user } = useAuthentication();
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [isSignInOverlayVisible, setSignInOverlayVisible] = useState(false);
  const [impersonatorUserName, setImpersonatorUserName] = useState<string | null>(null);
  const [impersonateeUsername, setImpersonateeUsername] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const openModal = (): void => {

    setModalVisible(true);
  };

  const closeModal = (): void => {
    setModalVisible(false);
  };


  useEffect(() => {
    
    const access_token = localStorage.getItem('access_token');
    const impersonateeUserId = localStorage.getItem('impersonateeUserId');

    if (access_token && impersonateeUserId && !impersonatorUserName) {
      try {
        const decoded: DecodedToken = jwtDecode(access_token);
        setImpersonatorUserName(`${decoded.given_name} ${decoded.family_name}`);        
        setIsSignedIn(true);
        setImpersonateeUsername(localStorage.getItem('impersonateeUsername'));
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
      }
    }    
    
  }, []);

  useEffect(() => {
    if (user) {
      setSignInOverlayVisible(false);
      setIsSignedIn(true);
    }    
    
  }, [user]);

  useOn({
    event: Hooks.SignOut,
    callback: () => {
      setIsSignedIn(false);
      window.location.reload();
    },
  });

  const handleSignInClick =  () => {
    toggleOverlay();
  }

  const handleSignOutClick =  () => {
    console.log('Signing out...');
    localStorage.removeItem('impersonateeUsername');
    localStorage.removeItem('access_token');
    localStorage.removeItem('impersonateeUserId');
    window.location.href = envVariables.VITE_CSR_APP_PATH;
  }

  const toggleOverlay = () => {
    setSignInOverlayVisible(!isSignInOverlayVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.id === 'sign-in-box-container') {
      toggleOverlay();
    }
  };

  useEffect(() => {
    if (isSignInOverlayVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSignInOverlayVisible]);

  return (
    <header>
      { isSignInOverlayVisible && 
        <div className="signInContainer overlay" id='sign-in-box-container'>
          <SignIn 
            showSignUp={true}
            showFooter={false}
          />          
        </div>
      }

      
       {modalVisible && (
        <div className="popup-box">
          <button type="button" className="close-button" onClick={closeModal}>
            X
          </button>
          <h3>Favourite Products</h3>
          <ProductListSelected />

        </div>
      )}
      {modalVisible && <div className="popup-box-overlay" onClick={closeModal} />}


      <div className="logo">
        <img src={logo} alt="Staples Logo" className="logo-image" />
      </div>
      <div className="search-bar">
        <SearchIcon />
        <input type="text" placeholder="Search..." />
      </div>
      { isSignedIn && !impersonatorUserName &&
        <>
          <h5 style={{padding: '0px 10px 0px 10px'}}>
            Welcome, {user.name.givenName} {user.name.familyName}
          </h5>
          <SignOutButton />
        </>
      }
      { isSignedIn && impersonatorUserName && impersonateeUsername &&
        <>
          <h5 style={{padding: '0px 10px 0px 10px'}}>
            Welcome, {impersonateeUsername} (Impersonator: {impersonatorUserName})
          </h5>
          <button className="sign-out-button" onClick={ () => {handleSignOutClick();} }>Sign Out</button>
        </>
      }
      <div className="header-buttons">
        { !isSignedIn &&
          <button className="header-icon-button" onClick={ () => {handleSignInClick();} }><PersonIcon /></button>
        }
        { !isSignedIn &&
          <button className="header-icon-button" onClick={ () => {handleSignInClick();} }><ListIcon /></button>
        }
        { isSignedIn &&
          <button className="header-icon-button" onClick={ () => {openModal();} }><ListIcon /></button>
        }

     
      </div>
    </header>
  );
};

export default Header;
