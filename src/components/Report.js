import React, { useState, useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faFileLines, faUserPlus, faListUl, faMagnifyingGlass, faUserMinus, faPrint, faEnvelope, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { AgGridReact } from 'ag-grid-react';
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
import { useLocation } from "react-router-dom";
import LoadingPopup from "./LoadingPopup";
const config = require('../ApiConfig');


const Report = () => {
  const location = useLocation();
  const passedState = location.state || {};
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [dol, setdol] = useState("");
  const [boothno, setboothno] = useState("");
  const [name, setname] = useState("");
  const [husband_parent_name, sethusband_parent_name] = useState("");
  const [houseno, sethouseno] = useState("");
  const [age, setage] = useState("");
  const [voterid, setvoterid] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [sex, setSex] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedSex, setSelectedSex] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [stateDrop, setStateDrop] = useState([]);
  const [districtDrop, setDistrictDrop] = useState([]);
  const [constituencyDrop, setConstituencyDrop] = useState([]);
  const [sexDrop, setSexDrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState([])
  const [shouldSearch, setShouldSearch] = useState(false);
  const [loading, setLoading] = useState(false);



  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const uploadedPatientPermission = permissions
    .filter(permission => permission.screen_type === 'VoterList')
    .map(permission => permission.permission_type.toLowerCase());

  useEffect(() => {
    if (passedState.selectedState) setSelectedState(passedState.selectedState);
    if (passedState.selectedDistrict) setSelectedDistrict(passedState.selectedDistrict);
    if (passedState.selectedConstituency) setSelectedConstituency(passedState.selectedConstituency);

    if (
      passedState.selectedState &&
      passedState.selectedDistrict &&
      passedState.selectedConstituency
    ) {
      setShouldSearch(true); // only once
    }
  }, []);

  // Step 2: Run search after state is set
  useEffect(() => {
    if (shouldSearch) {
      handleSearch();
      setShouldSearch(false); // avoid repeated calls
    }
  }, [shouldSearch]);


  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const columnDefs = [
    {
 headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: 'DOL',
      field: 'dol',
      sortable: false,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${day}-${month}-${year}`;
        }
        return '';
      }
    },
    {
      headerName: 'State',
      field: 'state',
      editable: false,
    
      sortable: false,
    },
    {
      headerName: 'District',
      field: 'district',
      editable: false,
    
      sortable: false
    },
    {
      headerName: 'Constituency',
      field: 'constituency',
      editable: false,
    
      sortable: false
    },
    {
      headerName: 'Booth No',
      field: 'boothno',
      editable: false,
      sortable: false
    },
    {
      headerName: 'S.No',
      field: 'serialno',
      maxWidth: 100,
      sortable: false,
      editable: false,
    },
    {
      headerName: 'Name',
      field: 'name',
      editable: true,
    },
    {
      headerName: 'Husband/Parent Name',
      field: 'husband_parent_name',
      editable: true,
    },
    {
      headerName: 'House No',
      field: 'houseno',
      editable: true,
    },
    {
      headerName: 'Age',
      field: 'age',
      editable: true,
    },
    {
      headerName: 'Sex',
      field: 'sex',
      editable: true,
    },
    {
      headerName: 'Voter Id',
      field: 'voterid',
      editable: true,
    },
    {
      headerName: 'Keyfield',
      field: 'keyfield',
      editable: true,
      hide:true
    },
    {
      headerName: 'File Name',
      field: 'file_name',
      editable: true
    
    },
    {
      headerName: 'Ward No',
      field: 'WardNo',
      editable: true
 
    },
  ];


  const handleNavigate = () => {
    navigate("/AddVoterList");
  };

const handleSearch = async () => {
  // Check if booth number is not available
  if (!boothno || boothno.trim() === "") {
    toast.warning("Must Enter The Booth Number");
    return; // Exit early
  }
  setLoading(true);
  try {
    const response = await fetch(`${config.apiBaseUrl}/searchVoterList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        dol,
        state: selectedState?.value || "",
        district: selectedDistrict?.value || "",
        constituency: selectedConstituency?.value || "",
        boothno,
        name,
        husband_parent_name,
        houseno,
        age,
        sex,
        voterid,
        user:sessionStorage.getItem("selectedUserCode"),
      })
    });

    if (response.ok) {
      const searchData = await response.json();
      setRowData(searchData);
      console.log("Data fetched successfully");
    } else if (response.status === 404) {
      console.log("Data not found");
      toast.warning("Data not found");
      setRowData([]);
    } else {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message || "Failed to get data");
      console.error(errorResponse.details || errorResponse.message);
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    toast.error('An error occurred while fetching data: ' + error.message);
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async () => {
  const selectedRows = gridApi.getSelectedRows();

  if (selectedRows.length === 0) {
    toast.warning("Please select at least one row to delete");
    return;
  }

  const modified_by = sessionStorage.getItem('selectedUserCode');
  const keyfieldToDelete = selectedRows.map((row) => row.keyfield);

  showConfirmationToast(
    "Are you sure you want to delete the selected rows?",
    async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.apiBaseUrl}/deleteVoterList`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Modified-By": modified_by
          },
          body: JSON.stringify({ keyfieldToDelete, user:sessionStorage.getItem("selectedUserCode") })
        });

        if (response.ok) {
          toast.success("Data deleted successfully", {
            autoClose: 1000,
            onClose: () => handleSearch() // Refresh the data or grid
          });
        } else {
          const errorResponse = await response.json();
          toast.warning(errorResponse.message || "Failed to delete data");
        }
      } catch (error) {
        console.error("Error deleting rows:", error);
        toast.error('Error deleting data: ' + error.message);
      } finally {
        setLoading(false);
      }
    },
    () => {
      toast.info("Data delete cancelled.");
    }
  );
};

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report.");
      return;
    }

    const reportData = selectedRows.map((row) => {
      const formattedDate = new Date(row.dol).toISOString().split("T")[0];
      return {
        "S.No": row.serialno,
        "DOL": formattedDate,
        "State": row.state,
        "District": row.district,
        "Constituency": row.constituency,
        "Booth No": row.boothno,
        "Name": row.name,
        "Husband/Parent Name": row.husband_parent_name,
        "House No": row.houseno,
        "Age": row.age,
        "Sex": row.sex,
        "Voter Id": row.voterid,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Voter List</title>");
    reportWindow.document.write("<style>");
    reportWindow.document.write(`
      body {
          font-family: Arial, sans-serif;
          margin: 20px;
      }
      h1 {
          color: maroon;
          text-align: center;
          font-size: 24px;
          margin-bottom: 30px;
          text-decoration: underline;
      }
      table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
      }
      th, td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
          vertical-align: top;
      }
      th {
          background-color: maroon;
          color: white;
          font-weight: bold;
      }
      td {
          background-color: #fdd9b5;
      }
      tr:nth-child(even) td {
          background-color: #fff0e1;
      }
      .report-button {
          display: block;
          width: 150px;
          margin: 20px auto;
          padding: 10px;
          background-color: maroon;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 16px;
          text-align: center;
          border-radius: 5px;
      }
      .report-button:hover {
          background-color: darkred;
      }
      @media print {
          .report-button {
              display: none;
          }
          body {
              margin: 0;
              padding: 0;
          }
      }
    `);
    reportWindow.document.write("</style></head><body>");
    reportWindow.document.write("<h1><u>Voter List</u></h1>");

    // Create table with headers
    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");

    // Populate the rows
    reportData.forEach((row) => {
      reportWindow.document.write("<tr>");
      Object.values(row).forEach((value) => {
        reportWindow.document.write(`<td>${value}</td>`);
      });
      reportWindow.document.write("</tr>");
    });

    reportWindow.document.write("</tbody></table>");

    reportWindow.document.write(
      '<button class="report-button" onclick="window.print()">Print</button>'
    );
    reportWindow.document.write("</body></html>");
    reportWindow.document.close();
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/gender`)
      .then((data) => data.json())
      .then((val) => setSexDrop(val));
  }, []);

  const filteredOptionSex = sexDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeSex = (selectedGender) => {
    setSelectedSex(selectedGender);
    setSex(selectedGender ? selectedGender.value : "");
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const saveEditedData = async () => {
    const selectedRowsData = editedData
      .filter(row => selectedRows.some(selectedRow => selectedRow.keyfield === row.keyfield))

    if (selectedRowsData.length === 0) {
      toast.warning("Please select and modify at least one row to update its data");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const modified_by = sessionStorage.getItem('selectedUserCode');

          const response = await fetch(`${config.apiBaseUrl}/updateVoterList`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by
            },
            body: JSON.stringify({ editedData: selectedRowsData, user:sessionStorage.getItem("selectedUserCode") }), // Send only the selected rows for saving
            "modified_by": modified_by
          });

          if (response.status === 200) {
            toast.success("Data Updated Successfully", {
              onClose: () => handleSearch(),
              autoClose: 1000,
            });
            return;
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to Updating data");
          }
        } catch (error) {
          console.error("Error Updating data:", error);
          toast.error("Error Updating Data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };


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

    const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.keyfield === params.data.keyfield
    );
  
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);
  
      setEditedData((prevData) => {
        const existingIndex = prevData.findIndex(
          (item) => item.keyfield === params.data.keyfield
        );
  
        if (existingIndex !== -1) {
          const updatedEdited = [...prevData];
          updatedEdited[existingIndex] = updatedRowData[rowIndex];
          return updatedEdited;
        } else {
          return [...prevData, updatedRowData[rowIndex]];
        }
      });
    }
  };

    const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };


  return (
    <div class="main-content">
      {loading && <LoadingPopup />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2 ">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="me-5 ms-4 fs-2 mt-1">Voter List</h1>
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
                    <li className="dropdown-item" onClick={handleNavigate}>
                      <FontAwesomeIcon icon={faUserPlus} style={{ color: "black" }} />
                    </li>
                  )}
                  {['delete', 'all permission'].some(permission => uploadedPatientPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={handleDelete}>
                      <FontAwesomeIcon icon={faUserMinus} style={{ color: "red" }} />
                    </li>
                  )}
                  {['all permission', 'update'].some(permission => uploadedPatientPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={saveEditedData}>
                      <FontAwesomeIcon icon={faFloppyDisk}  style={{ color: " green" }} />
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="d-none d-md-flex  justify-content-end">
              {['add', 'all permission'].some(permission => uploadedPatientPermission.includes(permission)) && (
                <savebutton title='Add Voter List' className="purbut" onClick={handleNavigate}>
                  <FontAwesomeIcon icon={faUserPlus} />
                </savebutton>
              )}
              {['delete', 'all permission'].some(permission => uploadedPatientPermission.includes(permission)) && (
                <delbutton title='Delete' className="purbut" onClick={handleDelete}>
                  <FontAwesomeIcon icon={faUserMinus} />
                </delbutton>
              )}
              {["update", "all permission"].some((permission) => uploadedPatientPermission.includes(permission)) && (
                <savebutton className="purbut me-2" onClick={saveEditedData} title="Update">
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </savebutton>
              )}
              {['all permission', 'Report'].some(permission => uploadedPatientPermission.includes(permission)) && (
                <printbutton className="purbut me-2" onClick={generateReport} title="Generate Report">
                  <FontAwesomeIcon icon={faPrint} />
                </printbutton>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded-3 mb-2 mt-2">
        <div className="row ms-4 me-4 mt-3">
          {/* <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="locno" class="exp-form-labels">
                DOL
              </label>
              <input
                id="date"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                autoComplete='off'
                required
                value={dol}
                onChange={(e) => setdol(e.target.value)}
                title="Please fill the checkup date here"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div> */}
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
                className="exp-input-field"
                placeholder=""
                required
                data-tip="Please select a payment type"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                className="exp-input-field"
                placeholder=""
                required
                data-tip="Please select a payment type"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
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
                className="exp-input-field"
                placeholder=""
                required
                data-tip="Please select a payment type"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
             <div>
              <label for="state" class="exp-form-labels">
                Booth No
              <span className="text-danger">*</span></label>
              </div>
              <input
                id="Gender"
                value={boothno}
                onChange={(e) => setboothno(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Name
              </label>
              <input
                id="Gender"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Husband/Parent Name
              </label>
              <input
                id="Gender"
                value={husband_parent_name}
                onChange={(e) => sethusband_parent_name(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
               onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                House No
              </label>
              <input
                id="Gender"
                value={houseno}
                onChange={(e) => sethouseno(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Age
              </label>
              <input
                id="Gender"
                value={age}
                onChange={(e) => setage(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                type="Number"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Sex
              </label>
              <Select
                id="Gender"
                value={selectedSex}
                onChange={handleChangeSex}
                options={filteredOptionSex}
                className="exp-input-field"
                placeholder=""
                required
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Voter Id
              </label>
              <input
                id="Gender"
                value={voterid}
                onChange={(e) => setvoterid(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div class="col-md-2 form-group mt-4 justify-content-end mb-3">
            <button className="p-2 me-3 ps-3 pe-3" title="Search" onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
            <button className="p-2 me-3 ps-3 pe-3" onClick={reloadGridData} title="Refresh">
              <FontAwesomeIcon icon={faArrowRotateRight} />
            </button>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-4 bg-body-tertiary rounded-3 mb-2 mt-2"> 
        <div className="ag-theme-alpine" style={{ height: 437, width: "100%" }}>
          <AgGridReact
            onGridReady={onGridReady}
            columnDefs={columnDefs}
            rowData={rowData}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
            pagination={true}
            paginationAutoPageSize={true}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </div>
    </div>
  );
}

export default Report