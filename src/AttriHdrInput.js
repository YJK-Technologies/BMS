import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import '@fortawesome/react-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import LoadingPopup from "./components/LoadingPopup";
const config = require("./ApiConfig");

function AttriHdrInput({ open, handleClose }) {
  const [open2, setOpen2] = React.useState(false);
  const [attributeheader_code, setAttributeheader_Code] = useState("");
  const [attributeheader_name, setAttributeheader_Name] = useState("");
  const [status, setStatus] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const code = useRef(null);
  const Name = useRef(null);
  const Status = useRef(null);
  const navigate = useNavigate();
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [loading, setLoading] = useState(false);


  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const AttributeHeaderPermission = permissions
    .filter(permission => permission.screen_type === 'Master')
    .map(permission => permission.permission_type.toLowerCase());

  console.log(selectedRows);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`)
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setStatus(selectedStatus ? selectedStatus.value : "");
  };

  const handleInsert = async () => {
    if (!attributeheader_code || !status) {
      setError(" ");
      toast.warning("Error:Missing Required Fields")
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/addattrihdrData`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem("selectedCompanyCode"),

          attributeheader_code,
          attributeheader_name,
          status,
          created_by: sessionStorage.getItem("selectedUserCode"),

         
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        toast.success("Data inserted Successfully")
      }else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
    }
    } catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
  } finally {
    setLoading(false);
  }
};
  const handleNavigate = () => {
    navigate("/AddAttributeDetail"); // Pass selectedRows as props to the Input component
  };

  const handleKeyDown = async (
    e,
    nextFieldRef,
    value,
    hasValueChanged,
    setHasValueChanged
  ) => {
    if (e.key === "Enter") {
      // Check if the value has changed and handle the search logic
      if (hasValueChanged) {
        await handleKeyDownStatus(e); // Trigger the search function
        setHasValueChanged(false); // Reset the flag after the search
      }

      // Move to the next field if the current field has a valid value
      if (value) {
        nextFieldRef.current.focus();
      } else {
        e.preventDefault(); // Prevent moving to the next field if the value is empty
      }
    }
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === "Enter" && hasValueChanged) {
      // Only trigger search if the value has changed
      // Trigger the search function
      setHasValueChanged(false); // Reset the flag after search
    }
  };

  return (
    <div className="">
      {open && (
        <fieldset>
        <div className="">
          {loading && <LoadingPopup />}
          <div className=" modal container-fluid" tabIndex="-1" role="dialog" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog  modal-xl  ps-5 p-1 pe-5" role="document">
              <div className="modal-content">
              <div class="row justify-content-center">
                <div class="col-md-12 text-center">
                  <div className=" bg-body-tertiary">
                  <div className=" mb-0 d-flex justify-content-between" >
                          <h1 className="me-5 ms-4 fs-2 mt-1">Master Header</h1>
                        <button onClick={handleClose} className=" btn btn-danger mt-0 shadow-none rounded-0 h-70 fs-5" required title="Close">
                        <FontAwesomeIcon icon={faXmark} />
                            </button>
                            
                        </div>
                      
                    
                    </div>
                  </div>
                    {/* <div>
                      <div>
                        <div
                          class="d-flex justify-content-between bg-secondary"
                          style={{ backgroundColor: "#d5d5d5" }}
                          className="head "
                        >
                          <legend>
                            <div className="purbut ">
                              <h1 align="left" class="">
                                Add Attribute Hdr
                              </h1>
                            </div>
                          </legend>

                          <div className="mobileview">
                            <div className="d-flex justify-content-between">
                              <div class="d-flex justify-content-start">
                                <div className="d-flex justify-content-start">
                                  <h1 align="left">Add Attribute Hdr</h1>
                                </div>
                                <div className="d-flex justify-content-end">
                                  <button
                                    onClick={handleNavigate}
                                    className="btn btn-danger pt-2 mt-2 mb-2 "
                                    required
                                    title="Close"
                                  >
                                    <i class="fa-solid fa-circle-xmark"></i>{" "}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="purbut">
                            <div class="d-flex justify-content-end mb-2 me-3 ms-4">
                              <div className="mt-3">
                                <button
                                  onClick={handleClose}
                                  class="closebtn"
                                  required
                                  title="Close"
                                >
                                  <i class="fa-solid fa-circle-xmark"></i>{" "}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </div>

                  <div class="">
                    <div class="row p-4">
                      <div className="col-md-3 form-group mb-2">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Code
                              </label>
                            </div>
                            <div>
                              {" "}
                              <span className="text-danger">*</span>
                            </div>
                          </div>
                          <input
                            id="ahcode"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header code"
                            value={attributeheader_code}
                            onChange={(e) =>
                              setAttributeheader_Code(e.target.value)
                            }
                            maxLength={100}
                            autoComplete='off'
                            ref={code}
                            onKeyDown={(e) => handleKeyDown(e, Name, code)}
                          />
                          {error && !attributeheader_code && (
                            <div className="text-danger">
                              Master Code should not be blank
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Name
                              </label>
                            </div>
                            <div>
                              {" "}
                              <span className="text-danger">*</span>
                            </div>
                          </div>{" "}
                          <input
                            id="ahname"
                            class="exp-input-field form-control"
                            type="text"
                            placeholder=""
                            required
                            title="Please enter the attribute header name"
                            value={attributeheader_name}
                            maxLength={250}
                            autoComplete='off'
                            onChange={(e) =>
                              setAttributeheader_Name(e.target.value)
                            }
                            ref={Name}
                            onKeyDown={(e) => handleKeyDown(e, Status, Name)}
                          />
                          {error && !attributeheader_name && (
                            <div className="text-danger">
                              Master Name should not be blank
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                          <div class="d-flex justify-content-start">
                            <div>
                              <label for="rid" class="exp-form-labels">
                                Status
                              </label>
                            </div>
                            <div>
                              {" "}
                              <span className="text-danger">*</span>
                            </div>
                          </div>
                          <Select
                            id="status"
                            value={selectedStatus}
                            onChange={handleChangeStatus}
                            options={filteredOptionStatus}
                            className="exp-input-field"
                            placeholder=""
                            required
                            data-tip="Please select a payment type"
                            ref={Status}
                            autoComplete='off'
                            onKeyDown={(e) => handleKeyDown(e, Status)}
                          />
                          {error && !status && (
                            <div className="text-danger">
                              {" "}
                              Status should not be blank
                            </div>
                          )}
                        </div>
                      </div>
                      <div class="col-md-3 form-group  ">
                      {['add', 'all permission'].some(permission => AttributeHeaderPermission.includes(permission)) && (
                <button onClick={handleInsert} class="mt-4 p-2" required title="Save"> Save</button>
              )}
                </div>
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
export default AttriHdrInput;
