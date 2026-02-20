import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import Select from 'react-select'
import '@fortawesome/react-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import LoadingPopup from "./LoadingPopup";
const config = require('../ApiConfig');


function UserInput({ open, handleClose }) {
    const [user_code, setUser_code] = useState("");
    const [user_name, setUser_name] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [user_password, setUser_password] = useState("");
    const [user_status, setUser_status] = useState("");
    const [log_in_out, setLog_in_out] = useState("");
    const [role_id, setRole] = useState("");
    const [email_id, setEmail_id] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedLog, setSelectedLog] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [statusdrop, setStatusdrop] = useState([]);
    const [roleDrop, setRoleDrop] = useState([]);
    const [Genderdrop, setGenderdrop] = useState([]);
    const [Loginoroutdrop, setLoginoroutdrop] = useState([]);
    const [error, setError] = useState("");
    const [user_images, setuser_image] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const usercode = useRef(null);
    const username = useRef(null);
    const firstname = useRef(null);
    const lastname = useRef(null);
    const password = useRef(null);
    const Status = useRef(null);
    const loginlogout = useRef(null);
    const usertype = useRef(null);
    const email = useRef(null);
    const Dob = useRef(null);
    const Gender = useRef(null);
    const ImagE = useRef(null);
    const [hasValueChanged, setHasValueChanged] = useState(false);
    const created_by = sessionStorage.getItem('selectedUserCode')
    const [loading, setLoading] = useState(false);


    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            const maxSize = 1 * 1024 * 1024;
            if (file.size > maxSize) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'File size exceeds 1MB. Please upload a smaller file.',
                    confirmButtonText: 'OK'
                });
                event.target.value = null;
                return;
            }
            if (file) {
                setSelectedImage(URL.createObjectURL(file));
                setuser_image(file);
            }
        }
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/status`)
            .then((data) => data.json())
            .then((val) => setStatusdrop(val));
    }, []);
    useEffect(() => {
        fetch(`${config.apiBaseUrl}/gender`)
            .then((data) => data.json())
            .then((val) => setGenderdrop(val));
    }, []);
    useEffect(() => {
        fetch(`${config.apiBaseUrl}/Loginorout`)
            .then((data) => data.json())
            .then((val) => setLoginoroutdrop(val));
    }, []);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/UserRole`)
            .then((response) => response.json())
            .then((val) => setRoleDrop(val))
            .catch((error) => console.error("Error parsing JSON:", error));
    }, []);


    const filteredOptionStatus = statusdrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const filteredOptionRole = roleDrop.map((option) => ({
        value: option.role_id,
        label: option.role_name,
    }));

    const filteredOptionLog = Loginoroutdrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    // const filteredOptionGender = Genderdrop.map((   option) => ({
    //     value: option.attributedetails_name,
    //     label: option.attributedetails_name,
    // }));
    const filteredOptionGender = Genderdrop
  .filter(option => option.attributedetails_name.toLowerCase() !== 'all')
  .map(option => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));


    const handleChangeStatus = (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        setUser_status(selectedStatus ? selectedStatus.value : '');
    };


    const handleChangeRole = (selectedRole) => {
        setSelectedRole(selectedRole);
        setRole(selectedRole ? selectedRole.value : '');
    };

    const handleChangeLog = (selectedLog) => {
        setSelectedLog(selectedLog);
        setLog_in_out(selectedLog ? selectedLog.value : '');
    };


    const handleChangeGender = (selectedGender) => {
        setSelectedGender(selectedGender);
        setGender(selectedGender ? selectedGender.value : '');
    };


    const handleInsert = async () => {
        if (
            !user_code ||
            !user_name ||
            !first_name ||
            !last_name ||
            !user_password ||
            !user_status ||
            !role_id ||
            !email_id ||
            !dob
        ) {
            setError(" ");
            toast.warning("Error: Missing Required Fields.")
            return;
        }

        if (!validateEmail(email_id)) {
            setError("Invalid email format.");
            return;
        }
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("user_code", user_code);
            formData.append("user_name", user_name);
            formData.append("first_name", first_name);
            formData.append("last_name", last_name);
            formData.append("user_password", user_password);
            formData.append("user_status", user_status);
            formData.append("log_in_out", log_in_out);
            formData.append("email_id", email_id);
            formData.append("dob", dob);
            formData.append("role_id", role_id);
            formData.append("gender", gender);
            formData.append("created_by", sessionStorage.getItem("selectedUserCode"));

            if (user_images) {
                formData.append("user_img", user_images);
            }

            const response = await fetch(`${config.apiBaseUrl}/useradd`, {
                method: "POST",
                body: formData,
            });

            if (response.status === 200) {
                console.log("Data inserted successfully");
                setTimeout(() => {
                    toast.success("Data inserted successfully!", {
                        onClose: () => window.location.reload(), // Reloads the page after the toast closes
                    });
                }, 1000);
            } else if (response.status === 400) {
                const errorResponse = await response.json();
                console.error(errorResponse.message);
                toast.warning(errorResponse.message, {

                });
            } else {
                console.error("Failed to insert data");
                toast.error('Failed to insert data', {

                });
            }
        } catch (error) {
            console.error("Error inserting data:", error);
            toast.error('Error inserting data: ' + error.message, {

            });
        } finally {
            setLoading(false);
        }
    };

    function validateEmail(email) {
        const emailRegex = /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/;
        return emailRegex.test(email);
    }

    const handleKeyDown = async (e, nextFieldRef, value, hasValueChanged, setHasValueChanged) => {
        if (e.key === 'Enter') {
            if (hasValueChanged) {
                await handleKeyDownStatus(e);
                setHasValueChanged(false);
            }

            if (value) {
                nextFieldRef.current.focus();
            } else {
                e.preventDefault();
            }
        }
    };

    const handleKeyDownStatus = async (e) => {
        if (e.key === 'Enter' && hasValueChanged) {
            setHasValueChanged(false);
        }
    };

    return (
        <div class="">
            {open && (
                <fieldset>
                    {loading && <LoadingPopup />}
                    <div className="modal container-fluid" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        {/* <ToastContainer position="top-right" className="toast-design" theme="colored" /> */}
                        <div className="modal-dialog  modal-xl ps-5 p-1 pe-5" role="document">
                            <div className="modal-content">
                                <div class="row justify-content-center">
                                    <div class="col-md-12 text-center">
                                        <div className="bg-body-tertiary">
                                            <div className="mb-0 d-flex justify-content-between" >
                                                <h1 class="me-5 ms-4 fs-2 mt-1">Add User</h1>
                                                <button onClick={handleClose} className="btn btn-danger shadow-none mt-0 rounded-0 h-70 fs-5" required title="Close">
                                                    <FontAwesomeIcon icon={faXmark} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="">
                                    <div class="row p-4">
                                        <div className="col-md-3 form-group mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">User Code<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <input
                                                    id="ucode"
                                                    class="exp-input-field form-control"
                                                    type="text"
                                                    placeholder=""
                                                    required title="Please enter the user code"
                                                    value={user_code}
                                                    onChange={(e) => setUser_code(e.target.value)}
                                                    maxLength={18}
                                                    ref={usercode}
                                                    onKeyDown={(e) => handleKeyDown(e, username, usercode)}
                                                    autoComplete='off'
                                                />
                                                {error && !user_code && <div className="text-danger">User Code should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">User Name<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <input
                                                    id="uname"
                                                    class="exp-input-field form-control"
                                                    type="text"
                                                    placeholder=""
                                                    required title="Please enter the user name"
                                                    value={user_name}
                                                    onChange={(e) => setUser_name(e.target.value)}
                                                    maxLength={250}
                                                    ref={username}
                                                    onKeyDown={(e) => handleKeyDown(e, firstname, username)}
                                                    autoComplete='off'
                                                />
                                                {error && !user_name && <div className="text-danger">User Name should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">First Name<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <input
                                                    id="fname"
                                                    class="exp-input-field form-control"
                                                    type="text"
                                                    placeholder=""
                                                    required title="Please enter the first name"
                                                    value={first_name}
                                                    onChange={(e) => setFirst_name(e.target.value)}
                                                    maxLength={250}
                                                    ref={firstname}
                                                    onKeyDown={(e) => handleKeyDown(e, lastname, firstname)}
                                                    autoComplete='off'
                                                />
                                                {error && !first_name && <div className="text-danger">First Name should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">Last Name<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <input
                                                    id="lname"
                                                    class="exp-input-field form-control"
                                                    type="text"
                                                    placeholder=""
                                                    required title="Please enter the last name"
                                                    value={last_name}
                                                    onChange={(e) => setLast_name(e.target.value)}
                                                    maxLength={250}
                                                    ref={lastname}
                                                    autoComplete='off'
                                                    onKeyDown={(e) => handleKeyDown(e, password, lastname)}
                                                />
                                                {error && !last_name && <div className="text-danger">Last Name should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">Password<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <input
                                                    id="upass"
                                                    class="exp-input-field form-control"
                                                    type="text"
                                                    placeholder=""
                                                    required title="Please enter the password"
                                                    value={user_password}
                                                    onChange={(e) => setUser_password(e.target.value)}
                                                    maxLength={50}
                                                    autoComplete='off'
                                                    ref={password}
                                                    onKeyDown={(e) => handleKeyDown(e, Status, password)}
                                                />
                                                {error && !user_password && <div className="text-danger">Password should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">Status<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <Select
                                                    id="status"
                                                    value={selectedStatus}
                                                    onChange={handleChangeStatus}
                                                    options={filteredOptionStatus}
                                                    className="exp-input-field"
                                                    placeholder=""
                                                    maxLength={50}
                                                    ref={Status}
                                                    onKeyDown={(e) => handleKeyDown(e, loginlogout, Status)}
                                                />
                                                {error && !user_status && <div className="text-danger">Status should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2">
                                            <div class="exp-form-floating">
                                                <label for="loginout" class="exp-form-labels">Log IN/OUT</label>
                                                <Select
                                                    id="loginout"
                                                    value={selectedLog}
                                                    onChange={handleChangeLog}
                                                    options={filteredOptionLog}
                                                    className="exp-input-field"
                                                    placeholder=""
                                                    maxLength={3}
                                                    ref={loginlogout}
                                                    onKeyDown={(e) => handleKeyDown(e, usertype, loginlogout)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2 ">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">Role ID<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <Select
                                                    id="usertype"
                                                    value={selectedRole}
                                                    onChange={handleChangeRole}
                                                    options={filteredOptionRole}
                                                    className="exp-input-field"
                                                    placeholder=""
                                                    maxLength={50}
                                                    ref={usertype}
                                                    onKeyDown={(e) => handleKeyDown(e, email, usertype)}
                                                />
                                                {error && !role_id && <div className="text-danger">Role ID should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">Email<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <input
                                                    id="uemail"
                                                    class="exp-input-field form-control"
                                                    type="email"
                                                    placeholder=""
                                                    required title="Please enter the email ID"
                                                    value={email_id}
                                                    onChange={(e) => setEmail_id(e.target.value)}
                                                    maxLength={150}
                                                    ref={email}
                                                    onKeyDown={(e) => handleKeyDown(e, Dob, email)}
                                                    autoComplete='off'
                                                />
                                                {error && !validateEmail(email_id) && <div className="text-danger">Please Enter Valid Email Id</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">DOB<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <input
                                                    id="udob"
                                                    class="exp-input-field form-control"
                                                    type="date"
                                                    placeholder=""
                                                    required title="Please enter the DOB"
                                                    value={dob}
                                                    onChange={(e) => setDob(e.target.value)}
                                                    ref={Dob}
                                                    onKeyDown={(e) => handleKeyDown(e, Gender, Dob)}
                                                    autoComplete='off'
                                                />
                                                {error && !dob && <div className="text-danger">DOB should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group mb-2 ">
                                            <div class="exp-form-floating">
                                                <label for="gender" class="exp-form-labels">Gender</label>
                                                <Select
                                                    id="gender"
                                                    value={selectedGender}
                                                    onChange={handleChangeGender}
                                                    options={filteredOptionGender}
                                                    className="exp-input-field"
                                                    placeholder=""
                                                    maxLength={50}
                                                    ref={Gender}
                                                    onKeyDown={(e) => handleKeyDown(e, ImagE, Gender)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group mb-2 ">
                                            <div class="exp-form-floating">
                                                <label for="locno" class="exp-form-labels">Image</label>
                                                <input type="file"
                                                    class="exp-input-field form-control"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    ref={ImagE}
                                                    onKeyDown={(e) => handleKeyDown(e, ImagE)}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group mb-2">
                                            <div className="exp-form-floating">
                                                <div className="image-frame" style={{
                                                    width: "200px",
                                                    height: "200px",
                                                    border: "2px solid #ccc",
                                                    padding: "10px",
                                                    textAlign: "center",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}>
                                                    <img
                                                        src={selectedImage || 'default-placeholder.png'} 
                                                        alt="Preview"
                                                        style={{
                                                        height: "100%",
                                                        width: "100%",
                                                        objectFit: "cover"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group  mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">
                                                            Created By
                                                        </label>
                                                    </div>
                                                </div>
                                                <input
                                                    id="emailid"
                                                    class="exp-input-field form-control"
                                                    type="text"
                                                    placeholder=""
                                                    required
                                                    value={created_by}
                                                />
                                            </div>
                                        </div>
                                        <div class="col-md-3 form-group mt-3">
                                            <button onClick={handleInsert} className="btn btn-primary rounded-3" title="Save">
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>
            )}
        </div>
    );
}
export default UserInput;
