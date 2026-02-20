import React, { useState, useEffect } from "react";
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
    const [error, setError] = useState("");
    const created_by = sessionStorage.getItem('selectedUserCode')
    const [loading, setLoading] = useState(false);
    const [stateDrop, setStateDrop] = useState([]);
    const [districtDrop, setDistrictDrop] = useState([]);
    const [constituencyDrop, setConstituencyDrop] = useState([]);
    const [statusDrop, setStatusDrop] = useState([]);
    const [userCodeDrop, setUserCodeDrop] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedConstituency, setSelectedConstituency] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedUserCode, setSelectedUserCode] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [constituency, setConstituency] = useState('');
    const [status, setStatus] = useState('');
    const [userCode, setUserCode] = useState('');

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getState`)
            .then((data) => data.json())
            .then((val) => setStateDrop(val));
    }, []);

    const filteredOptionState = stateDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangeState = (SelectSIDdrop) => {
        setSelectedState(SelectSIDdrop);
        setState(SelectSIDdrop ? SelectSIDdrop.value : "");
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getDistrict`)
            .then((data) => data.json())
            .then((val) => setDistrictDrop(val));
    }, []);

    const filteredOptionDistrict = districtDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangeDistrict = (SelectSIDdrop) => {
        setSelectedDistrict(SelectSIDdrop);
        setDistrict(SelectSIDdrop ? SelectSIDdrop.value : "");
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getConstituency`)
            .then((data) => data.json())
            .then((val) => setConstituencyDrop(val));
    }, []);

    const filteredOptionConstituency = constituencyDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangeConstituency = (SelectSIDdrop) => {
        setSelectedConstituency(SelectSIDdrop);
        setConstituency(SelectSIDdrop ? SelectSIDdrop.value : "");
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/status`)
            .then((data) => data.json())
            .then((val) => setStatusDrop(val));
    }, []);

    const filteredOptionStatus = statusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangeStatus = (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        setStatus(selectedStatus ? selectedStatus.value : "");
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getUserCode`)
            .then((data) => data.json())
            .then((val) => setUserCodeDrop(val));
    }, []);

    const filteredOptionUserCode = userCodeDrop.map((option) => ({
        value: option.user_code,
        label: option.user_code,
    }));

    const handleChangeUserCode = (SelectSIDdrop) => {
        setSelectedUserCode(SelectSIDdrop);
        setUserCode(SelectSIDdrop ? SelectSIDdrop.value : "");
    };

    const handleInsert = async () => {
        if (!userCode || !state || !district || !constituency || !status) {
            setError(" ");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/addDistrictMapping`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_code:userCode,
                    state,
                    district,
                    constituency,
                    status,
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

    return (
        <div class="">
            {open && (
                <fieldset>
                    {loading && <LoadingPopup />}
                    <div className="modal container-fluid" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
                        <div className="modal-dialog  modal-xl ps-5 p-1 pe-5" role="document">
                            <div className="modal-content">
                                <div class="row justify-content-center">
                                    <div class="col-md-12 text-center">
                                        <div className="bg-body-tertiary">
                                            <div className="mb-0 d-flex justify-content-between" >
                                                <h1 class="me-5 ms-4 fs-2 mt-1">Add District Mapping</h1>
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
                                                <Select
                                                    id="roleid"
                                                    value={selectedUserCode}
                                                    onChange={handleChangeUserCode}
                                                    options={filteredOptionUserCode}
                                                    className="exp-input-field"
                                                    placeholder=""
                                                    maxLength={18}
                                                    title="Please select a state here"
                                                />
                                                {error && !state && <div className="text-danger">State should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group mb-2">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">State<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <Select
                                                    id="roleid"
                                                    value={selectedState}
                                                    onChange={handleChangeState}
                                                    options={filteredOptionState}
                                                    className="exp-input-field"
                                                    placeholder=""
                                                    maxLength={18}
                                                    title="Please select a state here"
                                                />
                                                {error && !state && <div className="text-danger">State should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">District<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <Select
                                                    id="status"
                                                    value={selectedDistrict}
                                                    onChange={handleChangeDistrict}
                                                    options={filteredOptionDistrict}
                                                    className="exp-input-field"
                                                    placeholder=""
                                                    required title="Please select a district here"
                                                />
                                                {error && !state && <div className="text-danger">District should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group">
                                            <div class="exp-form-floating">
                                                <div class="d-flex justify-content-start">
                                                    <div>
                                                        <label for="state" class="exp-form-labels">Constituency<span className="text-danger">*</span></label>
                                                    </div>
                                                </div>
                                                <Select
                                                    id="status"
                                                    value={selectedConstituency}
                                                    onChange={handleChangeConstituency}
                                                    options={filteredOptionConstituency}
                                                    className="exp-input-field"
                                                    placeholder=""
                                                    required title="Please select a constituency here"
                                                />
                                                {error && !constituency && <div className="text-danger">Constituency should not be blank</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-3 form-group">
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
                                                    required title="Please select a status here"
                                                />
                                                {error && !status && <div className="text-danger">Status should not be blank</div>}
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