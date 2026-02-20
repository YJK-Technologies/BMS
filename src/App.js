import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';

import './App.css';
import Login from './components/Login';
import { useState } from 'react';
import Report from './components/Report';
import AddReport from './components/AddReport';
import MainLayout from './components/MainLayout';
import Feed from './components/FeedbackForm';
import Attri from './AttriDetGrid';
import AttriDet from './AttriDetInput';
import AttriHdr from './AttriHdrInput';
import Dashboard from './Dashboard/Dashboard';
import RoleRights from './components/RoleRights';
import Role from './components/Rolegrid';
import User from './components/User';
import Rating from './components/Rating';
import NotFound from './components/NotFound';
import './App.css';
import LoadingPopup from './components/LoadingPopup';
import './Css/Sidebar2.css';
import BoothWiseList from './components/BoothWiseList';
import AddBoothWise from './components/BoothWiseListInput';
import AddBoothStatistics from './components/AddBoothStatistics';
import BoothStatistics from './components/BoothStatistics';
import Settings from './components/Settings';
import VoterAddInfo from './components/VoterAddInfo';
import AddVoterNotepad from './components/AddVoterNotepad';
import VoterListUpload from './components/VoterListUpload';
import DistrictMapping from './components/DistrictMapping';
import AddDistrictMapping from './components/AddDistrictMapping';
import VoterListSummary from './components/VoterListSummary';


function App() {

  const [loading, setLoading] = useState(false);
  // const [permissions, setPermissions] = useState([]);

  // const handlePermissionsUpdate = () => {
  //   const permissionsJSON = sessionStorage.getItem('permissions');
  //   const updatedPermissions = permissionsJSON ? JSON.parse(permissionsJSON) : [];
  //   setPermissions(updatedPermissions);
  // };

  // useEffect(() => {
  //   // Listen for the permissions update event
  //   window.addEventListener('permissionsUpdated', handlePermissionsUpdate);

  //   // Initial load
  //   handlePermissionsUpdate();

  //   // Cleanup event listener on unmount
  //   return () => {
  //     window.removeEventListener('permissionsUpdated', handlePermissionsUpdate);
  //   };
  // }, []);

  // const screenTypes = Array.isArray(permissions)
  //   ? permissions.map(permission => permission.screen_type.replace(/\s+/g, ''))
  //   : [];

  const [screenTypes, setScreenTypes] = useState(
    JSON.parse(sessionStorage.getItem("screenTypes")) || []
  );

  useEffect(() => {
    const loadPermissions = () => {
      const permissionsJSON = sessionStorage.getItem("permissions");
      if (permissionsJSON) {
        const permissions = JSON.parse(permissionsJSON);
        const screens = permissions.map((permission) =>
          permission.screen_type.replace(/\s+/g, "")
        );
        setScreenTypes(screens);
        sessionStorage.setItem("screenTypes", JSON.stringify(screens));
      }
    };

    loadPermissions();

    window.addEventListener("permissionsUpdated", loadPermissions);
    return () => window.removeEventListener("permissionsUpdated", loadPermissions);
  }, []);


  const routes = [
    { path: "/", component: <Login /> },
    { path: "/Dashboard", component: <Dashboard /> },
    { path: "/Master", component: <Attri /> },
    { path: "/MasterDetails", component: <AttriDet /> },
    { path: "/MasterHeader", component: <AttriHdr /> },
    { path: "/Feedback", component: <Feed /> },
    { path: "/VoterList", component: <Report /> },
    { path: "/AddVoterList", component: <AddReport /> },
    { path: "/RoleRights", component: <RoleRights /> },
    { path: "/Role", component: <Role /> },
    { path: "/User", component: <User /> },
    { path: "/Rating", component: <Rating /> },
    { path: "/NotFound", component: <NotFound /> },
    { path: "/AddBoothWise", component: <AddBoothWise /> },
    { path: "/BoothWiseList", component: <BoothWiseList /> },
    { path: "/AddBoothStatistics", component: <AddBoothStatistics /> },
    { path: "/BoothStatistics", component: <BoothStatistics /> },
    { path: "/Settings", component: <Settings /> },
    { path: "/VoterAddInfo", component: <VoterAddInfo /> },
    { path: "/AddVoterNotepad", component: <AddVoterNotepad /> },
    { path: "/VoterListUpload", component: <VoterListUpload /> },
    { path: "/DistrictMapping", component: <DistrictMapping /> },
    { path: "/AddDistrictMapping", component: <AddDistrictMapping /> },
    { path: "/VoterListSummary", component: <VoterListSummary /> },
  ];


  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading && <LoadingPopup />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Feedback" element={<Feed />} />
        {routes.map(({ path, component }) =>
          screenTypes.includes(path.replace("/", "")) ? (
            <Route key={path} path={path} element={<MainLayout>{component}</MainLayout>} />
          ) : (
            <Route key={path} path={path} element={<MainLayout><NotFound /></MainLayout>} />
          )
        )}

        {/* {screenTypes.includes('Dashboard') && (
          <Route path="/Dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        )}
        {screenTypes.includes('Master') && (
          <Route path="/Master" element={<MainLayout><Attri /></MainLayout>} />
        )}
        {screenTypes.includes('MasterDetails') && (
          <Route path="/MasterDetails" element={<MainLayout><AttriDet /></MainLayout>} />
        )}
        {screenTypes.includes('MasterHeader') && (
          <Route path="/MasterHeader" element={<MainLayout><AttriHdr /></MainLayout>} />
        )}
        {screenTypes.includes('UploadedPatient') && (
          <Route path="/UploadedPatient" element={<MainLayout><Report /></MainLayout>} />
        )}
        {screenTypes.includes('UploadPatient') && (
          <Route path="/UploadPatient" element={<MainLayout><AddReport /></MainLayout>} />
        )}
        {screenTypes.includes('RoleRights') && (
          <Route path="/RoleRights" element={<MainLayout><RoleRights /></MainLayout>} />
        )}
        {screenTypes.includes('Role') && (
          <Route path="/Role" element={<MainLayout><Role /></MainLayout>} />
        )}
        {screenTypes.includes('User') && (
          <Route path="/User" element={<MainLayout><User /></MainLayout>} />
        )}
        {screenTypes.includes('Rating') && (
          <Route path="/Rating" element={<MainLayout><Rating /></MainLayout>} />
        )} */}

        {/* <Route path="*" element={<MainLayout><NotFound /></MainLayout>} /> */}
      </Routes>
    </Router>
  );
}

export default App;
