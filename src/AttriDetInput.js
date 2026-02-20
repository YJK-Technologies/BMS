import React ,{useState,useEffect}from 'react'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import { useLocation } from "react-router-dom";
import {  faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";
import AttriHdrInputPopup from "./AttriHdrInput";
import { faXmark, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import LoadingPopup from './components/LoadingPopup';
const config = require('./ApiConfig');

const AttriDetInput = () => {
  const [open2, setOpen2] = React.useState(false);
  const navigate = useNavigate();
  const [attributedetails_name, setAttributedetails_name] = useState("");
  const [attributeheader_code, setAttributeheader_Code] = useState("");
  const [attributedetails_code, setAttributedetails_code] = useState("");
  const [error, setError] = useState("");
  const created_by = sessionStorage.getItem('selectedUserCode')
  const modified_by = sessionStorage.getItem("selectedUserCode");
  const location = useLocation();
  const { mode, selectedRow } = location.state || {};
  const [selectedHeader, setSelectedHeader] = useState('Cash');
  const [codedrop, setCodedrop] = useState([]);
  const [descriptions, setDescriptions] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNavigatesToForm = () => {
    navigate("/AttriDetInput", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };
  const handleClickOpen = (params) => {
    setOpen2(true);
    console.log("Opening popup...");
  };
  const handleClose = () => {
    setOpen2(false);
  };
  const handleNavigate = () => {
    navigate("/Master"); // Pass selectedRows as props to the Input component
  };

  const handleChangeHeader = (selectedHeader) => {
    setSelectedHeader(selectedHeader);
    setAttributeheader_Code(selectedHeader ? selectedHeader.value : '');
    setError(false);
  };
  useEffect(() => {
    fetch(`${config.apiBaseUrl}/geattrihdrcode`)
      .then((data) => data.json())
      .then((val) => setCodedrop(val));
  }, []);

  
  const filteredOptionHeader = codedrop.map((option) => ({
    value: option.attributeheader_code,
    label: option.attributeheader_code,
  }));

  const handleInsert = async () => {
    if (!attributeheader_code || !attributedetails_code || !attributedetails_name) {
      setError(" ");
      toast.warning("Error:Missing Required Fields")
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/addattridetData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          company_code: sessionStorage.getItem('selectedCompanyCode'),
          attributeheader_code,
          attributedetails_code,
          attributedetails_name,
          descriptions,
          created_by: sessionStorage.getItem('selectedUserCode')
        }),
      });
      if (response.status === 200) {
        console.log("Data inserted successfully");
        toast.success("Data inserted Successfully")
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to insert sales data");
        console.error(errorResponse.details || errorResponse.message);
    }
    }  catch (error) {
      console.error("Error inserting data:", error);
      toast.error('Error inserting data: ' + error.message);
  } finally {
    setLoading(false);
  }
  };

  return (
    <div>
     
    <div className="">
    <div class="">
      {loading && <LoadingPopup />}
      <ToastContainer position="top-right" className="toast-design" theme="colored"/>
      <div class="row ">
        <div class="col-md-12 text-center">
          <div >
          </div>
          <div>
            <div>
              <div className="shadow-lg p-0 bg-body-tertiary rounded">
                <div className=" mb-0 d-flex justify-content-between" >
              <h1  class="me-5 ms-4 fs-2 mt-1">Master Details</h1>
              <button onClick={handleNavigate} className=" btn btn-danger shadow-none rounded-0 h-70 fs-5" required title="Close">
              <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
              </div>
            </div>
          </div>
        </div>
        <div class="pt-2 mb-4">
          <div className="shadow-lg p-3 bg-body-tertiary rounded  mb-2">
            <div class="row">
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">
                 <div class="">
                 <div>
                  <label for="rid" class="exp-form-labels">
                   Code<span className="text-danger">*</span>
                </label></div>
               
                 </div>
           
                 {/* <div class="input-group no-wrap">
                <Select
                id="HdrCode"
                className=" exp-input-field position-relative col-md-10 col-9"
                placeholder=""
                readOnly={mode === "update"}
                isDisabled={mode === "update"}
                value={selectedHeader}
                onChange={handleChangeHeader} 
                options={filteredOptionHeader}
               
              />
               {mode !== "update" &&
            ( <button 
             className="atthdrcode  btn btn-success text-white position-absloute rounded-end ps-3 pe-3 pt-1 pb-1  p-1 "
             
              required title="Add Header"
              onClick={handleClickOpen}
              >
                 
               <FontAwesomeIcon icon={faPlus} />
               
                  </button>)}
                  </div> */}
                  <div className="d-flex align-items-stretch gap-0">
                     <div className="flex-grow-1">
                       <Select
                         id="HdrCode"
                         className="exp-input-field w-100"
                         placeholder=""
                         readOnly={mode === "update"}
                         isDisabled={mode === "update"}
                         value={selectedHeader}
                         onChange={handleChangeHeader}
                         options={filteredOptionHeader}
                       />
                     </div>
                    
                      {mode !== "update" && (
                        <button
                          className="btn btn-success d-flex align-items-center justify-content-center"
                          style={{ minWidth: "40px" }}
                          onClick={handleClickOpen}
                          title="Add Header"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      )}
                   </div>
                    
         
               
                {error && !attributeheader_code && <div className="text-danger">Master Header Code should not be blank</div>}
              </div>
            </div>

          

            

            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                  Subcode
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="adcode"
                  value={attributedetails_code}
                  onChange={(e) => setAttributedetails_code(e.target.value)}
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  autoComplete='off'
                  required title="Please enter the attribute sub code"
                  maxLength={50}
                  readOnly={mode === "update"}
                /> {error && !attributedetails_code && <div className="text-danger">Master Sub Code should not be blank</div>}

                
              </div>
            </div>
            <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                   Detail Name
                </label></div>
                <div> <span className="text-danger">*</span></div>
                 </div><input
                  id="adnames"
                  value={attributedetails_name}
                  onChange={(e) => setAttributedetails_name(e.target.value)}
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  autoComplete='off'
                  required title="Please enter the attribute detail name"          
                  maxLength={250}
                />{error && !attributedetails_name && <div className="text-danger">Master Detail Name should not be blank</div>}

                
              </div>
            </div>
         
          <div className="col-md-3 form-group">
              <div class="exp-form-floating">

                <div class="d-flex justify-content-start">
                 <div><label for="rid" class="exp-form-labels">
                  Description
                </label></div>
                </div><input
                  id="addesc"
                  class="exp-input-field form-control"
                  type="text"
                  placeholder=""
                  autoComplete='off'
                  required title="Please enter the description"
                  onChange={(e) => setDescriptions(e.target.value)}
                 
                  maxLength={250}
                 
                />
                
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
                </div><input
                id="emailid"
                class="exp-input-field form-control"
                type="text"
                placeholder=""
                autoComplete='off'
                value={created_by}
              />  
            </div>
          </div> 
          <div class="col-md-4">
               {mode === "create" ? (
                  <button  onClick={handleInsert}  className="btn btn-primary mt-4 rounded-3" title="Save">
                  Save
                  </button>
                ) : (
                  <button  className="btn btn-primary mt-4 rounded-3" title="Update">
                 Update
                  </button>
                )}
              </div>
              <div>
                 <AttriHdrInputPopup  open={open2} handleClose={handleClose}  /> 
              </div>

            </div>
          </div>
        </div>
        </div>
    </div>
    </div>
   
    </div>
   
  )
}

export default AttriDetInput
