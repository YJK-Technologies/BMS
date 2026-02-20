import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import '@fortawesome/react-fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import LoadingPopup from "./LoadingPopup";
const config = require('../ApiConfig');

function Role_input({ open,handleClose }) {
  const [role_id, setRole_id] = useState("");
  const [role_name, setRole_name] = useState("");
  const [description, setDescription] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const roleid = useRef(null);
  const rolename = useRef(null);
  const Description = useRef(null);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const created_by = sessionStorage.getItem('selectedUserCode')
  const [loading, setLoading] = useState(false);
  

  const handleInsert = async () => {
    if (
      !role_id ||!role_name
    ) {
      setError(" ");
      toast.warning("Error:Missing Required Fields")
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddRoleInfoData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role_id,
          role_name,
          description,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        toast.success("Data inserted Successfully")
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert  data");
        console.error(errorResponse.details || errorResponse.message);
    }
    }catch (error) {
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
    {/* <ToastContainer position="top-right" className="toast-design" theme="colored"/> */}
    <div className="modal-dialog  modal-xl ps-5 p-1 pe-5" role="document">
    <div className="modal-content">
    <div class="row justify-content-center">
                <div class="col-md-12 text-center">
                    <div className="bg-body-tertiary">
                        <div className="mb-0 d-flex justify-content-between" >
                            <h1 class="me-5 ms-4 fs-2 mt-1">Add Role</h1>
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
                      <label for="rid" class="exp-form-labels">Role ID<span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <input
                    id="rid"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="please enter the role ID"
                    value={role_id}
                    onChange={(e) => setRole_id(e.target.value)}
                    maxLength={18}
                    autoComplete='off'
                    ref={roleid}
                    onKeyDown={(e) => handleKeyDown(e, rolename, roleid)}
                  />
                  {error && !role_id && <div className="text-danger">Role ID should not be blank</div>}
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels"> Role Name<span className="text-danger">*</span></label>
                    </div>
                  </div>
                  <input
                    id="rname"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="please enter the role name"
                    value={role_name}
                    onChange={(e) => setRole_name(e.target.value)}
                    maxLength={50}
                    autoComplete='off'
                    ref={rolename}
                    onKeyDown={(e) => handleKeyDown(e, Description, rolename)}
                  />
                  {error && !role_name && <div className="text-danger">Role Name should not be blank</div>}
                </div>
              </div>
              <div className="col-md-3 form-group">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="rid" class="exp-form-labels">Description</label>
                    </div>
                  </div>
                  <input
                    id="desc"
                    class="exp-input-field form-control"
                    type="text"
                    placeholder=""
                    required title="please enter the description"
                    value={description}
                    autoComplete='off'
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255}
                    ref={Description}
                    onKeyDown={(e) => handleKeyDown(e, Description)}
                  />
                </div>
              </div>
              <div className="col-md-3 form-group  mb-2">
                <div class="exp-form-floating">
                  <div class="d-flex justify-content-start">
                    <div>
                      <label for="state" class="exp-form-labels">Created By</label>
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
              <div class="col-md-3 form-group">
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
export default Role_input;