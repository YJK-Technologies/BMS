import React, { useState, useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faListUl } from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingPopup from "./LoadingPopup";
const config = require('../ApiConfig');


const BoothList = () => {
  const navigate = useNavigate();
  const [age, setage] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [min_forecast, setmin_forecast] = useState("");
  const [max_forecast, setmax_forecast] = useState("");
  const [constituency, setConstituency] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [stateDrop, setStateDrop] = useState([]);
  const [districtDrop, setDistrictDrop] = useState([]);
  const [constituencyDrop, setConstituencyDrop] = useState([]);
  const [loading, setLoading] = useState(false);

  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const uploadedPatientPermission = permissions
    .filter(permission => permission.screen_type === 'Settings')
    .map(permission => permission.permission_type.toLowerCase());


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
    setState(SelectSIDdrop ? SelectSIDdrop.value : '');
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
    setDistrict(SelectSIDdrop ? SelectSIDdrop.value : '');
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
    setConstituency(SelectSIDdrop ? SelectSIDdrop.value : '');
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

    useEffect(() => {
    fetch(`${config.apiBaseUrl}/getSettings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_code: sessionStorage.getItem('selectedUserCode'),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) return;

        const {
          state,
          district,
          constituency,
          age,
          min_forecast,
          max_forecast
        } = data[0];

        const setDefault = (type, setType, options, setSelected) => {
          if (type !== undefined && type !== null) {
            const typeStr = type.toString();
            setType(typeStr);
            setSelected(options.find((opt) => opt.value === typeStr) || null);
          }
        };

        setDefault(state, setState, filteredOptionState, setSelectedState);
        setDefault(district, setDistrict, filteredOptionDistrict, setSelectedDistrict);
        setDefault(constituency, setConstituency, filteredOptionConstituency, setSelectedConstituency);

        if (age) setage(age);
        if (min_forecast) setmin_forecast(min_forecast);
        if (max_forecast) setmax_forecast(max_forecast);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [ stateDrop, districtDrop, constituencyDrop ]);

    const handleSave = async () => {
      setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/addSettings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_code:sessionStorage.getItem('selectedUserCode'),
          state,
          district,
          constituency,
          age,
          min_forecast,
          max_forecast,
        })
      });
      if (response.ok) {
        toast.success("Data inserted successfully")
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to get data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error while Deleting data:", error);
      toast.error('An error occurred while fetching data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="main-content">
      {loading && <LoadingPopup />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2 ">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="me-5 ms-4 fs-2 mt-1">Settings</h1>
          </div>
          <div className="button-container">
            <div className="dropdown d-md-none rounded-end">
              <div
                className="btn btn-primary p-2 rounded-0 dropdown-toggle"
                type="button"
                onClick={toggleDropdown}
              >
                <FontAwesomeIcon icon={faListUl} />
              </div>
              {isOpen && (
                <ul className="dropdown-menu show">
                  {['add', 'all permission'].some(permission => uploadedPatientPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={handleSave}>
                      <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "black" }} />
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="d-none d-md-flex  justify-content-end">
              {['add', 'all permission'].some(permission => uploadedPatientPermission.includes(permission)) && (
                <savebutton title='Add' className="purbut" onClick={handleSave}>
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </savebutton>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded-3 mb-2 mt-2">
        <div className="row ms-4 me-4 mt-3">
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                State
              </label>
              <Select
                id="Gender"
                value={selectedState}
                onChange={handleChangeState}
                options={filteredOptionState}
                className=""
                placeholder=""
                required
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="lname" class="exp-form-labels">
                District
              </label>
              <Select
                id="Gender"
                value={selectedDistrict}
                onChange={handleChangeDistrict}
                options={filteredOptionDistrict}
                className=""
                placeholder=""
                required
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="Detail" class="exp-form-labels">
                Constituency
              </label>
              <Select
                id="Gender"
                value={selectedConstituency}
                onChange={handleChangeConstituency}
                options={filteredOptionConstituency}
                className=""
                placeholder=""
                required
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Age Limit
              </label>
              <input
                id="Gender"
                value={age}
                onChange={(e) => setage(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Minimum Forecast
              </label>
              <input
                id="Gender"
                value={min_forecast}
                onChange={(e) => setmin_forecast(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Maximum Forecast
              </label>
              <input
                id="Gender"
                value={max_forecast}
                onChange={(e) => setmax_forecast(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BoothList