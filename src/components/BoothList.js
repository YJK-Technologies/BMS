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
const config = require('../ApiConfig');


const BoothList = () => {

  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [SIDNo, setSIDNo] = useState("");
  const [Plan, setPlan] = useState("");
  const [checkupDate, setCheckupDate] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [selectGender, setSelectGender] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [Gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [Genderdrop, setGenderdrop] = useState([]);
  const [selectedMsgStatus, setSelectMsgStatus] = useState('');
  const [selectedplandrop, setSelectplandrop] = useState('');
  const [msgStatus, setMsgStatus] = useState("");
  const [plandropStatus, setplandropStatus] = useState("");
  const [msgDrop, setMsgDrop] = useState([]);
  const [plandrop, setplandrop] = useState([]);
  const [SIDdrop, setSIDdrop] = useState([]);
  const [SelectSIDdrop, setSelectSIDdrop] = useState('');
  const [SIDdropStatus, setSIDdropStatus] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState([]);


  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const uploadedPatientPermission = permissions
    .filter(permission => permission.screen_type === 'BoothList')
    .map(permission => permission.permission_type.toLowerCase());


  const selectedUserCode = sessionStorage.getItem('selectedUserCode');

  const onGridReady = (params) => {
    setGridApi(params.api);
  };
  const currentLength = rowData.length;

  const columnDefs = [
    // {
    //   headerCheckboxSelection: true,
    //   checkboxSelection: true,
    //   headerName: 'S.No',
    //   field: 'serialno',
    //   valueGetter: (params) => {
    //     return params.node.rowIndex + 1;
    //   },
    //   maxWidth: 100,
    //   sortable: false,
    //   editable: false,
    // },
    {
      headerName: 'Name',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      field: 'name',
      maxWidth: 100,
      sortable: false,
    },
    {
      headerName: 'Address',
      field: 'address',
      maxWidth: 100,
      sortable: false,
    },
    {
      headerName: 'Age',
      field: 'age',
      maxWidth: 100,
      sortable: false,
    },
    {
      headerName: 'Qualification',
      field: 'qualification',
      maxWidth: 100,
      sortable: false,
    },
    {
      headerName: 'Caste',
      field: 'caste',
      maxWidth: 100,
      sortable: false,
    },
    {
      headerName: 'Posting',
      field: 'posting',
      maxWidth: 100,
      sortable: false,
    },
    {
      headerName: 'Mobile No',
      field: 'mobileno',
      maxWidth: 100,
      sortable: false,
    },

    {
      headerName: 'DOJ',
      field: 'dojparty',
      editable: true,
      minWidth: 120,
      maxWidth: 120,
      filter: true,
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
      minWidth: 210,
      filter: true,
      sortable: false
    },
    {
      headerName: 'Voter Serial No',
      field: 'phone_no',
      editable: true,
      minWidth: 150,
      filter: true,
      sortable: false
    },
    {
      headerName: 'Aadhar No',
      field: 'aadharno',
      editable: true,
      minWidth: 110,
      filter: true,
      sortable: false
    },
    {
      headerName: 'State',
      field: 'state',
      editable: true,
      maxWidth: 410,
      minWidth: 410,
      filter: true,
      sortable: false,
      hide: true
    },
    {
      headerName: 'District',
      field: 'district',
      editable: true,
      maxWidth: 150,
      minWidth: 150,

    },
    {
      headerName: 'Constituency',
      field: 'constituency',
      editable: true,
      maxWidth: 200,
      minWidth: 200,
      filter: true,
      sortable: false,
    },
    {
      headerName: 'Booth No',
      field: 'boothno',
      editable: true,
      maxWidth: 200,
      minWidth: 200,
      filter: true,
      sortable: false,
    },
    {
      headerName: 'Keyfield',
      field: 'Keyfield',
      editable: true,
      maxWidth: 410,
      minWidth: 410,
      filter: true,
      sortable: false,
      hide: true
    },
  ];

  const handleNavigate = () => {
    navigate("/AddBoothList");
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/GetBoothWiseList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          SID_no: SIDdropStatus,
          plans: plandropStatus,
          patient_name: patientName,
          checkup_date: checkupDate,
          gender: Gender,
          phone_no: phoneNo,
          msg_status: msgStatus,
          user:sessionStorage.getItem("selectedUserCode"),
        })
      });
      if (response.ok) {
        const searchData = await response.json();
        setRowData(searchData);
        console.log("Data fetched successfully");
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found")
        setRowData([]);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to get data");
        console.error(errorResponse.details || errorResponse.message);
      }
    } catch (error) {
      console.error("Error while Deleting data:", error);
      toast.error('An error occurred while fetching data: ' + error.message);
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
        try {
          const response = await fetch(`${config.apiBaseUrl}/DeleteBoothList`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": selectedUserCode,
            },
            body: JSON.stringify({
              keyfieldToDelete: keyfieldToDelete,
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
      const formattedDate = new Date(row.checkup_date).toISOString().split("T")[0];
      return {
        "Name": row.name,
        "Address": row.address,
        "DOJ": formattedDate,
        "Member ID": row.memberid,
        "Mobile No": row.mobileno,
        "Posting": row.posting
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Master Health Checkup</title>");
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
    reportWindow.document.write("<h1><u>Master Health Checkup</u></h1>");

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

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/gender`)
  //     .then((data) => data.json())
  //     .then((val) => setGenderdrop(val));
  // }, []);

  // const filteredOptionGender = Genderdrop.map((option) => ({
  //   value: option.attributedetails_name,
  //   label: option.attributedetails_name,
  // }));

  // const handleChangeGender = (selectedGender) => {
  //   setSelectedGender(selectedGender);
  //   setGender(selectedGender ? selectedGender.value : "");
  //   setError(false);
  // };

  const reloadGridData = () => {
    window.location.reload();
  };

  const saveEditedData = async () => {
        const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.role_id === row.role_id));
    
        if (selectedRowsData.length === 0) {
            toast.warning("Please select and modify at least one row to update its data");
            return;
        }
    
        showConfirmationToast(
            "Are you sure you want to update the data in the selected rows?",
            async () => {
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
                }
            },
            () => {
                toast.info("Data updated cancelled.");
            }
        );
    };


  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getMsgStatus`)
  //     .then((data) => data.json())
  //     .then((val) => setMsgDrop(val));
  // }, []);

  // const filteredOptionMsgStatus = msgDrop.map((option) => ({
  //   value: option.attributedetails_name,
  //   label: option.attributedetails_name,
  // }));

  // const handleChangeMsgStatus = (selectedStatus) => {
  //   setSelectMsgStatus(selectedStatus);
  //   setMsgStatus(selectedStatus ? selectedStatus.value : '');
  //   setError(false);
  // };

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getPlan`)
  //     .then((data) => data.json())
  //     .then((val) => setplandrop(val));
  // }, []);

  // const filteredOptionPlanStatus = plandrop.map((option) => ({
  //   value: option.attributedetails_name,
  //   label: option.attributedetails_name,
  // }));

  // const dropPlan = (plandropStatus) => {
  //   setSelectplandrop(plandropStatus);
  //   setplandropStatus(plandropStatus ? plandropStatus.value : '');
  //   setError(false);
  // };

  // useEffect(() => {
  //   fetch(`${config.apiBaseUrl}/getSID`)
  //     .then((data) => data.json())
  //     .then((val) => setSIDdrop(val));
  // }, []);

  // const filteredOptionSIDStatus = SIDdrop.map((option) => ({
  //   value: option.SID_no,
  //   label: option.SID_no,
  // }));

  // const SIDDropdown = (SelectSIDdrop) => {
  //   setSelectSIDdrop(SelectSIDdrop);
  //   setSIDdropStatus(SelectSIDdrop ? SelectSIDdrop.value : '');
  //   setError(false);
  // };


  return (
    <div class="main-content">
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2 ">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="me-5 ms-4 fs-2 mt-1">Uploaded Booth List</h1>
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
                <savebutton title='Add' className="purbut" onClick={handleNavigate}>
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
              <label for="locno" class="exp-form-labels">
                Date
              </label>
              <input
                id="date"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                autoComplete='off'
                required
                value={checkupDate}
                onChange={(e) => setCheckupDate(e.target.value)}
                title="Please fill the checkup date here"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          {/* <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                SID No
              </label>
              <Select
                id="Gender"
                value={SelectSIDdrop}
                onChange={SIDDropdown}
                options={filteredOptionSIDStatus}
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
                Patient Name
              </label>
              <input
                id="lname"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                autoComplete='off'
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                title="Please fill the patient name here"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="Detail" class="exp-form-labels">
                Phone No
              </label>
              <input
                id="city"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                autoComplete='off'
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                title="Please fill the phone no here"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Gender
              </label>
              <Select
                id="Gender"
                value={selectedGender}
                onChange={handleChangeGender}
                options={filteredOptionGender}
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
              <label for="state" class="exp-form-labels">
                Plan
              </label>
              <Select
                id="Gender"
                value={selectedplandrop}
                onChange={dropPlan}
                options={filteredOptionPlanStatus}
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
                Sent SMS
              </label>
              <Select
                id="Gender"
                value={selectedMsgStatus}
                onChange={handleChangeMsgStatus}
                options={filteredOptionMsgStatus}
                className="exp-input-field"
                placeholder=""
                required
                data-tip="Please select a payment type"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div> */}

          <div class="col-md-2 form-group mt-4 justify-content-end mb-3">
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
        <div class="d-flex justify-content-between">
          <div align="left" class="d-flex justify-content-start">
            <purButton
              type="button">
              Patient
            </purButton>
          </div>
        </div>
        <div className="ag-theme-alpine" style={{ height: 437, width: "100%" }}>
          <AgGridReact
            onGridReady={onGridReady}
            columnDefs={columnDefs}
            rowData={rowData}
            rowSelection="multiple"
            pagination={true}
            paginationAutoPageSize={true}
            getRowStyle={(params) => {
    if (params.data && params.data.valid === 0) {
      return { backgroundColor: '#FFCCCC' }; // light red
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