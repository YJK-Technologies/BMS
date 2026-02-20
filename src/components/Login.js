import React, { useState, useEffect } from "react";
import "../Css/Login.css";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
// import Logo from "../images/hospital logo.jpg";
import TopLeftImage from '../images/amma.png';        // (Jayalalithaa)
import TopRightImage from '../images/MGR.png';      // (MGR)
import Anna from '../images/anna.png'
import MiddleLeftImage from '../images/EPS.png';  // (EPS)
import text2 from '../images/text.jpg'
import text_mobile from '../images/text_mobile2.jpg'

import centertext from '../images/text.jpg'
import amma from'../images/amma2.png'
import fulllap from '../images/laptop_img.png'
import LoadingPopup from './LoadingPopup';
import Logo from '../images/YJKLOGO.png';           // Your logo
import hourglass from '../images/YJKLOGO.png';


const config = require("../ApiConfig");

const LoginForm = () => {
  const navigate = useNavigate();
  const [user_code, setUserCode] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showCapsLockWarning, setShowCapsLockWarning] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const secretKey = "yjk26012024";

  useEffect(() => {
    const handleCapsLock = (e) => {
      if (e instanceof KeyboardEvent && e.getModifierState("CapsLock")) {
        setIsCapsLockOn(true);
        setShowCapsLockWarning(true);
        setTimeout(() => setShowCapsLockWarning(false), 2000);
      } else {
        setIsCapsLockOn(false);
        setShowCapsLockWarning(false);
      }
    };

    window.addEventListener("keydown", handleCapsLock);
    window.addEventListener("keyup", handleCapsLock);

    return () => {
      window.removeEventListener("keydown", handleCapsLock);
      window.removeEventListener("keyup", handleCapsLock);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Encrypt user_code and user_password
      const encryptedUserCode = CryptoJS.AES.encrypt(
        user_code,
        secretKey
      ).toString();
      const encryptedPassword = CryptoJS.AES.encrypt(
        user_password,
        secretKey
      ).toString();

      // console.log("encryptedUserCode", encryptedUserCode)
      // console.log("encryptedPassword", encryptedPassword)

      const response = await fetch(`${config.apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_code: encryptedUserCode,
          user_password: encryptedPassword,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const [{ user_code, role_id, user_images, state, district, constituency,Booth_no }] = data;
        if (user_images && user_images.data) {
          const userImageBase64 = arrayBufferToBase64(user_images.data);
          sessionStorage.setItem("user_image", userImageBase64);
          // console.log("Stored Image in sessionStorage:", sessionStorage.getItem('user_image'));
        }

        sessionStorage.setItem("selectedUserCode", user_code);
        sessionStorage.setItem("selectedUserState", state);
        sessionStorage.setItem("selectedUserDistrict", district);
        sessionStorage.setItem("selectedUserContituency", constituency);
        sessionStorage.setItem("selectedBoothno", Booth_no);
        UserPermission(role_id);

        sessionStorage.setItem("isLoggedIn", true);
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
        setLoginError(errorData.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setLoginError("Internal server error occurred!");
    }
    finally {
      setLoading(false);
    }
  };

  const arrayBufferToBase64 = (arrayBuffer) => {
    let binary = "";
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // const UserPermission = async (role_id) => {
  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/getUserPermission`, {
  //       method: 'post',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ role_id }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);

  //       sessionStorage.setItem('permissions', JSON.stringify(data));
  //       const storedPermissions = JSON.parse(sessionStorage.getItem('permissions'));
  //       console.log('Stored permissions:', storedPermissions);

  //       navigate('/Dashboard');
  //       // window.location.reload();

  //     } else {
  //       const errorData = await response.json();
  //       console.error('Error:', errorData.message);
  //     }
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //   }
  // };

  const UserPermission = async (role_id) => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/getUserPermission`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_id, user:sessionStorage.getItem("selectedUserCode"), }),
      });

      if (response.ok) {
        const data = await response.json();

        sessionStorage.setItem("permissions", JSON.stringify(data));

        window.dispatchEvent(new Event("permissionsUpdated"));
        const storedPermissions = JSON.parse(
          sessionStorage.getItem("permissions")
        );

        console.log(data)

        const firstNonAddScreen = storedPermissions
        ?.map(p => p.screen_type)
        ?.find(screen => !screen?.toLowerCase().startsWith("add"));

        if (firstNonAddScreen) {
          navigate(`/${firstNonAddScreen}`);
        } else {
          console.warn("No valid screen_type found in permissions.");
        }
      } else {
        const errorData = await response.json();
        console.error("Error:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
  
  
  <div>
  <div className="d-none d-sm-block">
  
  <div className="body">
{loading && <LoadingPopup />}


<div className="horizontal-row">
  <img src={text2} className="devicetop" />
</div> 

 <img src={fulllap} className="laptopimg" />
 <img src={amma} className="ammagroup d-sm-none" />
<div className="d-flex align-items-center justify-content-center" style={{ height: '100vh', position: 'relative', zIndex: 2 }}>
  <div className="main-wrapper" >
    <div className="login-box shadow bg-white p-4">
      <img  src={MiddleLeftImage} className="mainimage d-sm-none"/>
        <form onSubmit={handleSubmit}>
          <h1 className="text-center mb-4 ">Login</h1>

          {loginError && <div className="text-danger">{loginError}</div>}
          {showCapsLockWarning && isCapsLockOn && (
            <div className="text-danger">Caps Lock is on</div>
          )}

          <div className="mb-3 pt-5">
            <input
              type="text"
              className="form-control"
              placeholder="User ID"
              required
              value={user_code}
              onChange={(e) => setUserCode(e.target.value)}
            />
          </div>

          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              required
              value={user_password}
              onChange={(e) => setUserPassword(e.target.value)}
            />
            <i
              className={`bx ${showPassword ? "bx-show" : "bx-hide"} eye-icon`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>

          <button
            type="submit"
            className="button-login"
            // disabled={loading}
          >
            Sign in
          </button>
 
        </form>
      </div>
    </div></div>

    <img className="logo-yjk d-sm-none" src={Logo}/>
  </div>
   </div>











  {/* MOBILE VIEW */}

  <div className="d-block d-sm-none">
    
  <div className="body">
    <div className="horizontal-row">
      <img src={text_mobile} className="devicetop" />
    </div> 

    <img src={amma} className="ammagroup" />
    <div className="d-flex align-items-center justify-content-center" style={{  position: 'relative', zIndex: 2 }}>
      <div className="main-wrapper">
        <div className="login-box shadow bg-white p-4">
          <img src={MiddleLeftImage} className="mainimage" />
          <form onSubmit={handleSubmit}>
            <h1 className="text-center mb-4">Login</h1>
            {loginError && <div className="text-danger">{loginError}</div>}
            {showCapsLockWarning && isCapsLockOn && (
              <div className="text-danger">Caps Lock is on</div>
            )}

            <div className="mb-3 pt-5">
              <input
                type="text"
                className="form-control"
                placeholder="User ID"
                required
                value={user_code}
                onChange={(e) => setUserCode(e.target.value)}
              />
            </div>

            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                required
                value={user_password}
                onChange={(e) => setUserPassword(e.target.value)}
              />
              <i
                className={`bx ${showPassword ? "bx-show" : "bx-hide"} eye-icon`}
                onClick={togglePasswordVisibility}
              ></i>
            </div>

            <button type="submit" className="button-login">Sign in</button>
          </form>
        </div>
      </div>
    </div>

    <img className="logo-yjk" src={Logo}/>
  </div>
</div>





   </div>
);

};

export default LoginForm;
