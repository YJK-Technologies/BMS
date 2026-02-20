import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Select from 'react-select'
import '@fortawesome/react-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import LoadingPopup from "./LoadingPopup";
const config = require('../ApiConfig');

function UserScreenInput({ open, handleClose }) {
    const [screensdrop, setscreensdrop] = useState([]);
    const [permissionsdrop, setpermissionsdrop] = useState([]);
    const [screen_type, setscreen_type] = useState("");
    const [permission_type, setpermission_type] = useState("");
    const [selectedscreens, setselectedscreens] = useState('');
    const [selectedpermissions, setselectedpermissions] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');
    const [error, setError] = useState("");
    const permissiontype = useRef(null);
    const screentype = useRef(null);
    const [role_id, setrole_id] = useState("");
    const [hasValueChanged, setHasValueChanged] = useState(false);
    const [roleiddrop, setroleiddrop] = useState([]);
    const created_by = sessionStorage.getItem('selectedUserCode')
    const [loading, setLoading] = useState(false);


    console.log(selectedRows);
    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getScreens`)
            .then((data) => data.json())
            .then((val) => setscreensdrop(val));
    }, []);

    const filteredOptionscreens = screensdrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));


    const handleChangescreens = (selectedscreens) => {
        setselectedscreens(selectedscreens);
        setscreen_type(selectedscreens ? selectedscreens.value : '');
    };
    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getpermission`)
            .then((data) => data.json())
            .then((val) => setpermissionsdrop(val));
    }, []);

    const filteredOptionPermissions = permissionsdrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangePermissions = (selectedpermissions) => {
        setselectedpermissions(selectedpermissions);
        setpermission_type(selectedpermissions ? selectedpermissions.value : '');
    };

    useEffect(() => {
        const company_code = sessionStorage.getItem('selectedCompanyCode');

        fetch(`${config.apiBaseUrl}/getroleid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ company_code })
        })
            .then((data) => data.json())
            .then((val) => setroleiddrop(val))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);


    const filteredOptionRole = roleiddrop.map((option) => ({
        value: option.role_id,
        label: `${option.role_id} - ${option.role_name}`,
    }));


    const handleChangeRole = (selectedRole) => {
        setSelectedRole(selectedRole);
        setrole_id(selectedRole ? selectedRole.value : '');
    };

    const handleInsert = async () => {
        if (!role_id || !screen_type || !permission_type) {
            setError(" ");
            toast.warning("Error:Missing Required Fields")
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/adduserscreenmap`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    company_code: sessionStorage.getItem('selectedCompanyCode'),
                    role_id,
                    screen_type,
                    permission_type,
                    created_by: sessionStorage.getItem('selectedUserCode')

                }),
            });
            if (response.ok) {
                toast.success("Data inserted Successfully")
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert  data");
                console.error(errorResponse.details || errorResponse.message);
            }
        } catch (error) {
            console.error("Error inserting data:", error);
            toast.error('Error inserting data: ' + error.message);
        } finally {
            setLoading(false);
        }
    };


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
                            <h1 class="me-5 ms-4 fs-2 mt-1">Add Role Rights</h1>
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
                                            <label for="state" class="exp-form-labels">Role Id<span className="text-danger">*</span></label>
                                        </div>
                                    </div>
                                    <Select
                                        id="roleid"
                                        value={selectedRole}
                                        onChange={handleChangeRole}
                                        options={filteredOptionRole}
                                        className="exp-input-field"
                                        placeholder=""
                                        maxLength={18}
                                    />
                                    {error && !role_id && <div className="text-danger">Role ID should not be blank</div>}
                                </div>
                            </div>
                            <div className="col-md-3 form-group">
                                <div class="exp-form-floating">
                                    <div class="d-flex justify-content-start">
                                        <div>
                                            <label for="state" class="exp-form-labels">Screen Type <span className="text-danger">*</span></label>
                                        </div>
                                    </div>
                                    <Select
                                        id="status"
                                        value={selectedscreens}
                                        onChange={handleChangescreens}
                                        options={filteredOptionscreens}
                                        className="exp-input-field"
                                        placeholder=""
                                        ref={screentype}
                                        onKeyDown={(e) => handleKeyDown(e, permissiontype, screentype)}
                                        required title="Please select a screen type here"
                                    />
                                    {error && !screen_type && <div className="text-danger">Screen Type should not be blank</div>}
                                </div>
                            </div>
                            <div className="col-md-3 form-group">
                                <div class="exp-form-floating">
                                    <div class="d-flex justify-content-start">
                                        <div>
                                            <label for="state" class="exp-form-labels">Permission Type<span className="text-danger">*</span></label>
                                        </div>
                                    </div>
                                    <Select
                                        id="status"
                                        value={selectedpermissions}
                                        onChange={handleChangePermissions}
                                        options={filteredOptionPermissions}
                                        className="exp-input-field"
                                        placeholder=""
                                        ref={permissiontype}
                                        onKeyDown={(e) => handleKeyDown(e, permissiontype)}
                                        required title="Please select a permission type here"
                                    />
                                    {error && !permission_type && <div className="text-danger">Permission Type should not be blank</div>}
                                </div>
                            </div>
                            <div className="col-md-3 form-group">
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
                                        <div class="col-md-3 form-group ">
                                <button onClick={handleInsert} className="btn btn-primary mt-4 rounded-3" title="Save">
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
export default UserScreenInput;