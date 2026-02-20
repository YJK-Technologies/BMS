import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import '../App.css';
import '../Css/AddReport.css'
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LoadingPopup from "./LoadingPopup";
import Select from "react-select";
import { faUserPlus, faUserMinus, faFloppyDisk, faPrint, faListUl } from '@fortawesome/free-solid-svg-icons'
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddUser from './AddUser';
import UserImagePopup from './UserImageHelp';
import { showConfirmationToast } from './ToastConfirmation';
const config = require("../ApiConfig");

function UserGrid() {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const navigate = useNavigate();
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [drop, setDrop] = useState([]);
  const [user_code, setuser_code] = useState("");
  const [user_name, setuser_name] = useState("");
  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [user_status, setuser_status] = useState("");
  const [user_type, setuser_type] = useState("");
  const [dob, setdob] = useState("");
  const [gender, setgender] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [error, setError] = useState("");
  const [statusdrop, setStatusdrop] = useState([]);
  const [Usertypedrop, setUsertypedrop] = useState([]);
  const [Genderdrop, setGenderdrop] = useState([]);
  const [statusgriddrop, setStatusGriddrop] = useState([]);
  const [usergriddrop, setUserGriddrop] = useState([]);
  const [gendergriddrop, setGenderGriddrop] = useState([]);
  const [loggriddrop, setLogGriddrop] = useState([]);
  const [hasValueChanged, setHasValueChanged] = useState(false);
  const [user, setUser] = useState(null);
  const [userImage, setUserImage] = useState(null)
  const [open, setOpen] = React.useState(false);
  const [open1, setOpen1] = React.useState(false);
  const [loading, setLoading] = useState(false);

  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const UserPermission = permissions
    .filter(permission => permission.screen_type === 'User')
    .map(permission => permission.permission_type.toLowerCase());




  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`)
      .then((response) => response.json())
      .then((data) => {
        // Extract city names from the fetched data
        const statusOption = data.map((option) => option.attributedetails_name);
        setStatusGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/UserRole`)
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => option.role_id);
        setUserGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/gender`)
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => option.attributedetails_name);
        setGenderGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/Loginorout`)
      .then((response) => response.json())
      .then((data) => {
        const statusOption = data.map((option) => option.attributedetails_name);
        setLogGriddrop(statusOption);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/status`)
      .then((data) => data.json())
      .then((val) => setStatusdrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/UserRole`)
      .then((data) => data.json())
      .then((val) => setUsertypedrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/gender`)
      .then((data) => data.json())
      .then((val) => setGenderdrop(val));
  }, []);

  const filteredOptionStatus = statusdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionUser = Usertypedrop.map((option) => ({
    value: option.role_id,
    label: option.role_name,
  }));

  const filteredOptionGender = Genderdrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeStatus = (selectedStatus) => {
    setSelectedStatus(selectedStatus);
    setuser_status(selectedStatus ? selectedStatus.value : "");
    setError(false);
    setHasValueChanged(true);
  };

  const handleChangeUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    setuser_type(selectedUser ? selectedUser.value : "");
    setError(false);
    setHasValueChanged(true);
  };

  const handleChangeGender = (selectedGender) => {
    setSelectedGender(selectedGender);
    setgender(selectedGender ? selectedGender.value : "");
    setError(false);
    setHasValueChanged(true);
  };

  const handleNavigateToForm = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setOpen1(false);
  };



  const reloadGridData = () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error("Error reloading grid data:", error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/usersearchcriteria`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_code,
          user_name,
          first_name,
          last_name,
          user_status,
          role_id: user_type,
          dob,
          gender,
          user:sessionStorage.getItem("selectedUserCode"),
        }),
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
    } finally {
      setLoading(false);
    }
  };



  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const handleClickOpen = (params) => {
    const userCode = params.data.user_code;
    const userImage = params.data.user_images;
    setUser(userCode);
    setUserImage(userImage)
    setOpen1(true);
  };

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "User Code",
      field: "user_code",
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      // maxWidth: 150,
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "User Name",
      field: "user_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "First Name",
      field: "first_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      // maxWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Last Name",
      field: "last_name",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "User Image",
      field: "user_images",
      editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
      cellRenderer: (params) => {
        if (params.value) {
          const base64Image = arrayBufferToBase64(params.value.data);
          return (
            <img src={`data:image/jpeg;base64,${base64Image}`}
              alt="Item Image"
              style={{ width: " 50px", height: "50px" }}
            />
          );
        } else {
          return "";
        }
      },
      onCellClicked: (params) => handleClickOpen(params),
    },
    {
      headerName: "User Status",
      field: "user_status",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: statusgriddrop,
      },
    },
    {
      headerName: "Log In/Out",
      field: "log_in_out",
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      editable: true,
      // valueFormatter: (params) =>
      //   params.value
      //     ? params.value
      //       .toLowerCase()
      //       .split(' ')
      //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      //       .join(' ')
      //     : '',
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: loggriddrop,
        maxLength: 150,
      },
    },
    {
      headerName: "Role Id",
      field: "role_id",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      // valueFormatter: (params) =>
      //   params.value
      //     ? params.value
      //       .toLowerCase()
      //       .split(' ')
      //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      //       .join(' ')
      //     : '',
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        maxLength: 50,
        values: usergriddrop,
      },
    },
    {
      headerName: "Email",
      field: "email_id",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => {
        return params.value ? params.value.toLowerCase() : "";
      },
      cellEditorParams: {
        maxLength: 150,
      },
    },
    {
      headerName: "DOB",
      field: "dob",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      valueFormatter: (params) => {
        if (!params.value) return ""; // Return an empty string if the value is null or undefined
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, "0"); // Get day (padStart ensures double-digit format)
        const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Get month (+1 because months are zero-indexed)
        const year = date.getFullYear();
        return `${day}/${month}/${year}`; // Return formatted date string with day, month, and year
      },
    },
    {
      headerName: "Gender",
      field: "gender",
      editable: true,
      cellStyle: { textAlign: "left" },
      minWidth: 150,
      // valueFormatter: (params) =>
      //   params.value
      //     ? params.value
      //       .toLowerCase()
      //       .split(' ')
      //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      //       .join(' ')
      //     : '',
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        maxLength: 10,
        values: gendergriddrop,
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    flex: 1,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return;
    }

    const reportData = selectedRows.map((row) => {
      const formattedDate = new Date(row.dob).toISOString().split("T")[0];
      return {
        "User Code": row.user_code,
        "User Name": row.user_name,
        "First Name": row.first_name,
        "Last Name": row.last_name,
        "User Status": row.user_status,
        "Log In/Out": row.log_in_out,
        "User Id": row.role_id,
        "Email Id": row.email_id,
        DOB: formattedDate,
        Gender: row.gender,
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>User</title>");
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
    reportWindow.document.write("<h1><u>User Report</u></h1>");

    reportWindow.document.write("<table><thead><tr>");
    Object.keys(reportData[0]).forEach((key) => {
      reportWindow.document.write(`<th>${key}</th>`);
    });
    reportWindow.document.write("</tr></thead><tbody>");

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


  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };
  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.user_code === params.data.user_code
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);

      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };

  const saveEditedData = async () => {
    const selectedRowsData = editedData.filter(row =>
      selectedRows.some(
        selectedRow => selectedRow.user_code === row.user_code
      )
    )
      .map(({ user_images, ...rest }) => rest);

    if (selectedRowsData.length === 0) {
      toast.warning("Please select and modify at least one row to update its data");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const response = await fetch(`${config.apiBaseUrl}/userupdate`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by,
            },
            body: JSON.stringify({ editedData: selectedRowsData, user:sessionStorage.getItem("selectedUserCode"), }),
          });

          if (response.ok) {
            console.log("Data saved successfully!");
            toast.success("Data updated successfully!");
            return;
          } else {
            if (response.status === 400) {
              const errorResponse = await response.json();
              toast.warning(errorResponse.message || "Failed to update data.");
              console.error(errorResponse.details || errorResponse.message);
            } else {
              console.error("Failed to update rows");
            }
          }
        } catch (error) {
          console.error("Error updating rows:", error);
          toast.error("Error updating data: " + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to delete");
      return;
    }

    const modified_by = sessionStorage.getItem("selectedUserCode");

    const user_codesToDelete = selectedRows.map((row) => row.user_code);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/userdelete`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Modified-By": modified_by,
            },
            body: JSON.stringify({ user_codesToDelete, user:sessionStorage.getItem("selectedUserCode"), }),
            modified_by: modified_by,
          });

          if (response.ok) {
            toast.success("Data Deleted Successfully")
             window.location.reload();
            // handleSearch();
          } else {
            if (response.status === 400) {
              const errorResponse = await response.json();
              toast.warning(errorResponse.message || "Failed to delete data");
              console.error(errorResponse.details || errorResponse.message);
            } else {
              console.error("Failed to delete rows");
            }
          }
        } catch (error) {
          console.error("Error while Deleting data:", error);
          toast.error('Error while Deleting data: ' + error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast.info("Data Delete cancelled.");
      }
    );
  };

  const handleKeyDownStatus = async (e) => {
    if (e.key === "Enter" && hasValueChanged) {
      await handleSearch();
      setHasValueChanged(false);
    }
  };


  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div class="main-content">
      {loading && <LoadingPopup />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2">
        <div className=" d-flex justify-content-between">
          <div class="d-flex justify-content-start">
            <h1 className="me-5 ms-4 fs-2 mt-1">User</h1>
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
                  {['add', 'all permission'].some(permission => UserPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={handleNavigateToForm}>
                      <FontAwesomeIcon icon={faUserPlus} style={{ color: "black" }} />
                    </li>
                  )}
                  {['delete', 'all permission'].some(permission => UserPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={deleteSelectedRows}>
                      <FontAwesomeIcon icon={faUserMinus} style={{ color: "red" }} />
                    </li>
                  )}
                  {["update", "all permission"].some((permission) =>
                    UserPermission.includes(permission)
                  ) && (
                      <li className="dropdown-item" onClick={saveEditedData}>
                        <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "green" }} />
                      </li>
                    )}
                  {['all permission', 'Report'].some(permission => UserPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={generateReport}>
                      <FontAwesomeIcon icon={faPrint} style={{ color: "black" }} />
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="d-none d-md-flex justify-content-end">
              {['add', 'all permission'].some(permission => UserPermission.includes(permission)) && (
                <printbutton className="purbut" onClick={handleNavigateToForm} title="Add User" required>
                  <FontAwesomeIcon icon={faUserPlus} />
                </printbutton>
              )}
              {['delete', 'all permission'].some(permission => UserPermission.includes(permission)) && (
                <delbutton className="purbut" onClick={deleteSelectedRows} title="Delete" required>
                  <FontAwesomeIcon icon={faUserMinus} />
                </delbutton>
              )}
              {["update", "all permission"].some((permission) =>
                UserPermission.includes(permission)
              ) && (
                  <savebutton className="purbut" onClick={saveEditedData} title="Update" required>
                    <FontAwesomeIcon icon={faFloppyDisk} />
                  </savebutton>
                )}
              {['all permission', 'Report'].some(permission => UserPermission.includes(permission)) && (
                <printbutton className="purbut" onClick={generateReport} title="Generate Report" required>
                  <FontAwesomeIcon icon={faPrint} />
                </printbutton>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded-3 mb-2 mt-2">
        <div className="row  mt-3 mb-3 ms-4 me-4">
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="usercode" class="exp-form-labels">User Code</label>
              <input
                id="usercode"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                autoComplete='off'
                title="Please fill the user code here"
                value={user_code}
                onChange={(e) => setuser_code(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={18}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="username" class="exp-form-labels">User Name</label>
              <input
                id="username"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please fill the user name here"
                value={user_name}
                autoComplete='off'
                onChange={(e) => setuser_name(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={250}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="firstname" class="exp-form-labels">First Name</label>
              <input
                id="firstname"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please fill the first name here"
                value={first_name}
                onChange={(e) => setfirst_name(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={250}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="lastname" class="exp-form-labels">Last Name</label>
              <input
                id="lastname"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                autoComplete='off'
                required
                title="Please fill the last name here"
                value={last_name}
                onChange={(e) => setlast_name(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                maxLength={250}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="usts" class="exp-form-labels">User Status</label>
              <Select
                id="status"
                value={selectedStatus}
                onChange={handleChangeStatus}
                onKeyDown={handleKeyDownStatus}
                options={filteredOptionStatus}
                className="exp-input-field"
                placeholder=""
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="utype" class="exp-form-labels">User Type</label>
              <Select
                id="usertype"
                value={selectedUser}
                onChange={handleChangeUser}
                onKeyDown={handleKeyDownStatus}
                options={filteredOptionUser}
                className="exp-input-field"
                placeholder=""
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="dob" class="exp-form-labels">DOB</label>
              <input
                id="dob"
                className="exp-input-field form-control"
                type="date"
                placeholder=""
                required
                title="Please fill the DOB here"
                value={dob}
                autoComplete='off'
                onChange={(e) => setdob(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="gender" class="exp-form-labels">Gender</label>
              <Select
                id="gender"
                value={selectedGender}
                onChange={handleChangeGender}
                onKeyDown={handleKeyDownStatus}
                options={filteredOptionGender}
                className="exp-input-field"
                placeholder=""
                autoComplete='off'
              />
            </div>
          </div>
          <div className="form-group mt-4 justify-content-end">
            <button className="p-2 me-3 ps-3 pe-3" onClick={handleSearch} title="Search">
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <button className="p-2 me-3 ps-3 pe-3" onClick={reloadGridData} title="Refresh">
              <FontAwesomeIcon icon={faArrowRotateRight} />
            </button>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-4 bg-body-tertiary rounded-3  mb-2 mt-2">
        <div class="ag-theme-alpine " style={{ height: 520, width: "100%", }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            rowSelection="multiple"
            onSelectionChanged={onSelectionChanged}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </div>
      <div>
        <AddUser open={open} handleClose={handleClose} />
        <UserImagePopup open={open1} handleClose={handleClose} userCode={user} userImage={userImage} />
      </div>
    </div>
  );
}

export default UserGrid;
