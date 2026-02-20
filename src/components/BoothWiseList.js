import React, { useState, useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faUserPlus, faListUl, faMagnifyingGlass, faUserMinus, faPrint, faEnvelope, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { AgGridReact } from 'ag-grid-react';
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
import { useLocation } from "react-router-dom";
import { faSquareCheck, faSquare } from "@fortawesome/free-regular-svg-icons";
import LoadingPopup from "./LoadingPopup";
const config = require('../ApiConfig');


const BoothList = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const passedState = location.state || {};
  const [rowData, setRowData] = useState([]);
  const [boothno, setboothno] = useState("");
  const [name, setname] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [stateDrop, setStateDrop] = useState([]);
  const [districtDrop, setDistrictDrop] = useState([]);
  const [constituencyDrop, setConstituencyDrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [shouldSearch, setShouldSearch] = useState(false);
const [checked, setChecked] = useState(false);
const [fullData, setFullData] = useState([]);
const [loading, setLoading] = useState(false);

  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const uploadedPatientPermission = permissions
    .filter(permission => permission.screen_type === 'BoothWiseList')
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

  const selectedUserCode = sessionStorage.getItem('selectedUserCode');

  const onGridReady = (params) => {
    setGridApi(params.api);
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

  const columnDefs = [
    // {
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    //   headerName: 'S.No',
    //   field: 'serialno',
    //   valueGetter: (params) => {
    //     return params.node.rowIndex + 1;
    //   },
     
    //   sortable: false,
    //   editable: false,
    // },
     {
       headerCheckboxSelection: true,
       checkboxSelection: true,
      headerName: 'State',
      field: 'state',
      editable: true,
     
      sortable: false,
    },
    {
      headerName: 'District',
      field: 'district',
      editable: true,
    },
    {
      headerName: 'Constituency',
      field: 'constituency',
      editable: true,
      
      sortable: false,
    },
    {
      headerName: 'Booth No',
      field: 'boothno',
      editable: true,
    
      sortable: false,
    },
    {
      headerName: 'Name',
      field: 'name',
      sortable: false,
      editable: true,
    },
    {
      headerName: 'Address',
      field: 'address',
      sortable: false,
      editable: true,
    },
     {
      headerName: 'Posting',
      field: 'posting',
      sortable: false,
      editable: true,
    },
    {
      headerName: 'Age',
      field: 'age',
      sortable: false,
      editable: true,
    },
    {
      headerName: 'Qualification',
      field: 'qualification',
      sortable: false,
      editable: true,
    },
    {
      headerName: 'Caste',
      field: 'caste',
      sortable: false,
      editable: true,
    },
   
    {
      headerName: 'Mobile No',
      field: 'mobileno',
      sortable: false,
      editable: true,
    },

    {
      headerName: 'DOJ Party',
      field: 'dojparty',
      editable: true,
     
      sortable: false,
      valueFormatter: (params) => {
        const value = params.value;
        if (!value) return '';

        const isDateFormatted = /^\d{2}-\d{2}-\d{4}$/.test(value);
        if (isDateFormatted) {
          return value;
        }

        const date = new Date(value);
        if (isNaN(date)) return '';

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
      }
    },
    {
      headerName: 'Member ID',
      field: 'memberid',
      editable: true,
     
      sortable: false
    },
    {
      headerName: 'Voter Serial No',
      field: 'voterserialno',
      editable: true,
     
      sortable: false
    },
    {
      headerName: 'Aadhar No',
      field: 'aadharno',
      editable: true,
   
      sortable: false
    },
  
    {
      headerName: 'Keyfield',
      field: 'Keyfield',
      editable: true,
     
      sortable: false,
      hide: true
    },
  ];

  const handleNavigate = () => {
    navigate("/AddBoothWise");
  };

  const handleSearch = async () => {
  if (!boothno || boothno.trim() === "") {
    toast.warning("Must Enter The Booth No");
    return;
  }
  setLoading(true);
  try {
    const response = await fetch(`${config.apiBaseUrl}/searchBoothWiseList`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        state: selectedState?.value || "",
        district: selectedDistrict?.value || "",
        constituency: selectedConstituency?.value || "",
        boothno,
        name,
      })
    });

    if (response.ok) {
      const searchData = await response.json();
      setFullData(searchData); // Save all data
      setRowData(checked ? searchData.filter(row => row.valid === 0) : searchData);
      console.log("Data fetched successfully");
    } else if (response.status === 404) {
      toast.warning("Data not found");
      setFullData([]);
      setRowData([]);
    } else {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message || "Failed to get data");
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    toast.error("An error occurred: " + error.message);
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
    const keyfieldToDelete = selectedRows.map((row) => row.keyfield);
    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/DeleteBoothList`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": selectedUserCode,
            },
            body: JSON.stringify({
              keyfields: keyfieldToDelete,
              user:sessionStorage.getItem("selectedUserCode"),
            }),
          });
          if (response.ok) {
            console.log("Rows deleted successfully:", keyfieldToDelete);
            // handleSearch();
            toast.success("Rows deleted successfully")
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
            console.error(errorResponse.details || errorResponse.message);
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error('Error inserting data: ' + error.message);
        } finally {
          setLoading(false)
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
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
      const formattedDate = new Date(row.dojparty).toISOString().split("T")[0];
      return {
        "Name": row.name,
        "Address": row.address,
        "Age": row.age,
        "Qualification": row.qualification,
        "Caste": row.caste,
        "Posting": row.posting,
        "Mobile No": row.mobileno,
        "DOJ Party": formattedDate,
        "Member ID": row.memberid,
        "Voter Serial No": row.voterserialno,
        "Aadhar No": row.aadharno,
        "State": row.state,
        "District": row.district,
        "Constituency": row.constituency,
        "Booth No": row.boothno,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Booth Wise List</title>");
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
    reportWindow.document.write("<h1><u>Booth Wise List</u></h1>");

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


  const reloadGridData = () => {
    window.location.reload();
  };

  const saveEditedData = async () => {
    const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.keyfield === row.keyfield))

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

          const response = await fetch(`${config.apiBaseUrl}/UpdateBoothWiseList`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by
            },
            body: JSON.stringify({ editedData: selectedRowsData, user:sessionStorage.getItem("selectedUserCode"), })
          });

          if (response.ok) {
            toast.success("Data Updated Successfully");
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to update data.");
            console.error(errorResponse.details || errorResponse.message);
          }
        } catch (error) {
          console.error("Error inserting data:", error);
          toast.error('Error inserting data: ' + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
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

  const handleToggle = () => {
  const newChecked = !checked;
  setChecked(newChecked);

  if (newChecked) {
    // Show only records where valid === 0
    setRowData(fullData.filter(row => row.valid === 0));
  } else {
    // Show all data again
    setRowData(fullData);
  }
};


  return (
    <div class="main-content">
      {loading && <LoadingPopup />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2 ">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="me-5 ms-4 fs-2 mt-1">Booth Wise List</h1>
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
                  {['all permission', 'view'].some(permission => uploadedPatientPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={generateReport}>
                      <FontAwesomeIcon icon={faPrint} style={{ color: " green" }} />
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="d-none d-md-flex  justify-content-end">
              {['add', 'all permission'].some(permission => uploadedPatientPermission.includes(permission)) && (
                <savebutton title='Add Booth Wise List' className="purbut" onClick={handleNavigate}>
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
          <div class="col-md-2 form-group mt-4 justify-content-end mb-3">
             <button
      className="p-2 me-3 ps-3 pe-3"
      onClick={handleToggle}
      title="Not Valid"
    >
      <FontAwesomeIcon icon={checked ? faSquareCheck : faSquare} />
    </button>
            <button className="p-2 me-3 ps-3 pe-3" onClick={handleSearch} title="Search">
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
            getRowStyle={(params) => {
            if (params.data && params.data.valid === 0) {
              return { backgroundColor: '#ffcccc' }; // light red
            }
            return null;
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default BoothList