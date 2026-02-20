import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faIdCard, faListAlt, faMapMarkedAlt , faAddressCard, faDatabase, faUserShield, faUser, faKey, faArrowRightFromBracket, faList, faUsers, faChartBar, faCog } from '@fortawesome/free-solid-svg-icons';
import '../Css/Sidebar2.css';
import logo from './logo5.png';
import { ToastContainer, toast } from 'react-toastify';
import { showConfirmationToast } from './ToastConfirmation';
import Logo from '../images/logo.png';


function Sidebar() {
  const [isClosed, setIsClosed] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const userImageBase64 = sessionStorage.getItem('user_image');
  const user_code = sessionStorage.getItem('selectedUserCode');
  const userImageSrc = userImageBase64 ? `data:image/png;base64,${userImageBase64}` : null;
  const navigate = useNavigate();
  const toggleNav = () => {
    setIsClosed(!isClosed);
    if (window.innerWidth <= 768) {
      setIsMobileOpen(!isMobileOpen);
    }
  };

  const handleNavigatesToForm = () => {
    navigate("/Master");
  };

  const Report = () => {
    navigate("/VoterList");
  };

  const dash = () => {
    navigate("/Dashboard");
  };

  const roleRights = () => {
    navigate("/RoleRights");
  };

  const DistrictMapping = () => {
    navigate("/DistrictMapping");
  };

  const User = () => {
    navigate("/User");
  };

  const Role = () => {
    navigate("/Role");
  };

  const BoothWiseList = () => {
    navigate("/BoothWiseList");
  };

  const BoothStatistics = () => {
    navigate("/BoothStatistics");
  };

  const VoterAddInfo = () => {
    navigate("/VoterAddInfo");
  };

  const VoterListUpload = () => {
    navigate("/VoterListUpload");
  };

  const VoterListSummary = () => {
    navigate("/VoterListSummary");
  };

  const Settings = () => {
    navigate("/Settings");
  };

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [navigate]);


  const handleLogout = () => {
    showConfirmationToast(
      "Are you sure you want to log out?",
      () => {
        localStorage.clear();
        sessionStorage.removeItem('isLoggedIn');
        sessionStorage.removeItem('permissions');
        sessionStorage.removeItem('screenTypes');
        navigate('/');
      },
      () => {
        toast.info("Logout cancelled");
      }
    );
  };


  const permissionsJSON = sessionStorage.getItem("permissions");
  const permissions = permissionsJSON ? JSON.parse(permissionsJSON) : [];
  const screenType = Array.isArray(permissions)
    ? permissions.map((permission) =>
      permission.screen_type.replace(/\s+/g, "")
    )
    : [];

  return (
    <div className={`sidebar ${isClosed ? 'closed' : ''} ${isMobileOpen ? 'open' : ''}`} id="mySidebar">
      <div className="sidebar-header">
        <ToastContainer position="top-right" className="toast-design" theme="colored" />

        {/* 👇 ADMK Logo Added */}
        <img
          src={Logo} // <-- change this to actual path
          alt="ADMK"
          className="admk-logo me-2"
        />

        <h3 className='d-none'>Menu</h3>

        <sidebutton className="toggle-btn">
          {userImageSrc ? (
            <div className='User d-flex align-items-center'>
              <img
                src={userImageSrc}
                width="35"
                height="35"
                className="avatar-placeholder rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                title={user_code}
                onClick={toggleNav}
              />
              <label className="ms-3 text-white">{user_code}</label>
            </div>
          ) : (
            <div className="User d-flex align-items-center">
              <div
                className="avatar-placeholder rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                style={{ width: '35px', height: '35px', fontSize: '20px', cursor: 'pointer' }}
                title={user_code}
                onClick={toggleNav}
              >
                {user_code ? user_code.charAt(0) : 'U'}
              </div>
              <label className="ms-3 text-white">{user_code}</label>
            </div>
          )}
        </sidebutton>
      </div>
      {screenType.includes("Dashboard") && (
        <a className='pe-auto' onClick={dash} title='Dashboard'>
          <FontAwesomeIcon icon={faTachometerAlt} className='me-3' /> <span>Dashboard</span>
        </a>
      )}

      {screenType.includes("Master") && (
        <a className='pe-auto' onClick={handleNavigatesToForm} title='Master'>
          <FontAwesomeIcon icon={faDatabase} className='me-3' /> <span>Master</span>
        </a>
      )}

      {screenType.includes("User") && (
        <a className='pe-auto' onClick={User} title='User'>
          <FontAwesomeIcon icon={faUser} className='me-3' /> <span>User</span>
        </a>
      )}

      {screenType.includes("Role") && (
        <a className='pe-auto' onClick={Role} title='Role'>
          <FontAwesomeIcon icon={faUserShield} className='me-3' /> <span>Role</span>
        </a>
      )}

      {screenType.includes("RoleRights") && (
        <a className='pe-auto' onClick={roleRights} title='Role Rights'>
          <FontAwesomeIcon icon={faKey} className='me-3' /> <span>Role Rights</span>
        </a>
      )}

      {screenType.includes("DistrictMapping") && (
        <a className='pe-auto' onClick={DistrictMapping} title='District Mapping'>
          <FontAwesomeIcon icon={faMapMarkedAlt } className='me-3' /> <span>District Mapping</span>
        </a>
      )}

      {screenType.includes("VoterList") && (
        <a className='pe-auto' onClick={Report} title='Voter List'>
          <FontAwesomeIcon icon={faList} className='me-3' /> <span>Voter List</span>
        </a>
      )}

      {screenType.includes("BoothWiseList") && (
        <a className='pe-auto' onClick={BoothWiseList} title='Booth Wise List'>
          <FontAwesomeIcon icon={faUsers} className='me-3' /> <span>Booth Wise List</span>
        </a>
      )}

      {screenType.includes("BoothStatistics") && (
        <a className='pe-auto' onClick={BoothStatistics} title='Booth Wise Statistics'>
          <FontAwesomeIcon icon={faChartBar} className='me-3' /> <span>Booth Statistics</span>
        </a>
      )}

      {screenType.includes("VoterAddInfo") && (
        <a className='pe-auto' onClick={VoterAddInfo} title='Voter Additional Information'>
          <FontAwesomeIcon icon={faIdCard} className='me-3' />
          <span className='text-wrap'>Voter Additional Information</span>
        </a>
      )}

      {screenType.includes("VoterListUpload") && (
        <a className='pe-auto' onClick={VoterListUpload} title='Voter List Upload'>
          <FontAwesomeIcon icon={faAddressCard} className='me-3' />
          <span className='text-wrap'>Voter List Upload</span>
        </a>
      )}

      {screenType.includes("VoterListSummary") && (
        <a className='pe-auto' onClick={VoterListSummary} title='Voter List Summary'>
          <FontAwesomeIcon icon={faListAlt} className="me-3" />
          <span className='text-wrap'>Voter List Summary</span>
        </a>
      )}

      {screenType.includes("Settings") && (
        <a className='pe-auto' onClick={Settings} title='Settings'>
          <FontAwesomeIcon icon={faCog} className='me-3' /> <span>Settings</span>
        </a>
      )}
      <a className='' onClick={handleLogout} title='Logout'><FontAwesomeIcon icon={faArrowRightFromBracket} className='me-3 pe-auto' /> <span>Logout</span></a>
      <div className="sidebar-footer position-fixed mt-5 pt-2 text-center fw-bold pb-1" style={{backgroundColor:"Black", paddingRight:"0px",paddingLeft:"5px"}}>
        <img src={logo} width={45} height={45} />
        <div>
        <div className=''><h6 className='col-md-1 ms-3' style={{fontSize:"12px"}}>YJK Technologies</h6></div>
        <h6 className='col-md-1 ms-3'style={{fontSize:"10px"}}>Version 1.0.0</h6>
        </div>

        
      </div>
    </div>
  );
}

export default Sidebar;
