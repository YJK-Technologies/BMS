import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faFloppyDisk, faPrint, faListUl, faMagnifyingGlass, faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import LoadingPopup from "./LoadingPopup";
import Select from "react-select";
import '../App.css';
import '../Css/AddReport.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddRoleRights from './AddRoleRights'
import {showConfirmationToast}  from './ToastConfirmation'; 
const config = require('../ApiConfig');

function UserScreenMapGrid() {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const navigate = useNavigate();
    const [selectedRows, setSelectedRows] = useState([]);
    const [screensdrop, setscreensdrop] = useState([]);
  
    const [userdrop, setuserdrop] = useState([]);
    const [role_id, setrole_id] = useState("");
    const [screen_type, setscreen_type] = useState("");
    const [attributedetails_name, setattributedetails_name] = useState("");
    const [editedData, setEditedData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [roleType, setRoleType] = useState("");
    const [roleDrop, setRoleDrop] = useState([]);
    const [screenDrop, setscreenDrop] = useState([]); 
    const [permissionDrop, setpermissionDrop] = useState([]);
    const [permission, setpermission] = useState("");
    const [permissionsdrop, setpermissionsdrop] = useState([]);
    const [Selectedper, setSelectedper] = useState("");
    const [Selectedscreen, setSelectedscreen] = useState("");
    const [loading, setLoading] = useState(false);


    const reloadGridData = () => {
        window.location.reload();
    };

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const RolerightsPermission = permissions
      .filter(permission => permission.screen_type === 'RoleRights')
      .map(permission => permission.permission_type.toLowerCase());
  
      useEffect(() => {
        fetch(`${config.apiBaseUrl}/getRoleIDdrop`)
          .then((data) => data.json())
          .then((val) => setRoleDrop(val));
      }, []);

      const handleChangeRoleType = (selectedUser) => {
        setSelectedRole(selectedUser);
        setRoleType(selectedUser ? selectedUser.value : "");
      };

      const filteredOptionRoleType = roleDrop.map((option) => ({
        value: option.role_id,
        label: `${option.role_id} - ${option.role_name}`,
      }));

      
      useEffect(() => {
        fetch(`${config.apiBaseUrl}/getRoleRights`)
          .then((data) => data.json())
          .then((val) => setscreenDrop(val));
      }, []);

      const handleChangeScreenType = (selectedUser) => {
        setSelectedscreen(selectedUser);
        setscreen_type(selectedUser ? selectedUser.value : "");
      };

      const filteredOptionScreenType = screenDrop.map((option) => ({
        value: option.screen_type,
        label: option.screen_type,
      }));


      useEffect(() => {
        fetch(`${config.apiBaseUrl}/getpermission`)
          .then((data) => data.json())
          .then((val) => setpermissionDrop(val));
      }, []);

      const handleChangepertype = (selectedUser) => {
        setSelectedper(selectedUser);
        setpermission(selectedUser ? selectedUser.value : "");
      };

      const filteredOptionpertype = permissionDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
      }));


  

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getScreens`)
            .then((response) => response.json())
            .then((data) => {
                const Screens = data.map(option => option.attributedetails_name);
                setscreensdrop(Screens);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getpermission`)
            .then((response) => response.json())
            .then((data) => {
                const Permissions = data.map(option => option.attributedetails_name);
                setpermissionsdrop(Permissions);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/usercode`)
            .then((response) => response.json())
            .then((data) => {
                const usercode = data.map(option => option.user_code);
                setuserdrop(usercode);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);


    const handleSearch = async () => {
        setLoading(true);
        try {
           
            const response = await fetch(`${config.apiBaseUrl}/getuserscreensearchdata`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    
                },
                body: JSON.stringify({  role_id: roleType, screen_type: screen_type, permission_type: permission, user:sessionStorage.getItem("selectedUserCode"),  })
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
            }catch (error) {
              console.error("Error while Deleting data:", error);
              toast.error('An error occurred while fetching data: ' + error.message);
          } finally {
            setLoading(false);
          }
          };


    const columnDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            headerName: "Role Id",
            field: "role_id",
            editable: false,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
            // cellEditor: "agSelectCellEditor",
            // cellEditorParams: {
            //     values: userdrop,
            // },
        },
        {
            headerName: "Screen Type",
            field: "screen_type",
            editable: true,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: screensdrop,
            },
        },
        {
            headerName: "Permission Type",
            field: "permission_type",
            editable: true,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: permissionsdrop,
            },
        },
        {
            headerName: "Keyfield",
            field: "keyfield",
            editable: true,
            cellStyle: { textAlign: "left" },
            minWidth: 350,
            editable: false,
            hide: true
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
            return {
                "User Code": row.role_id,
                "Screen Type": row.screen_type,
                "Permission Type": row.permission_type,
            };
        });

        const reportWindow = window.open("", "_blank");
        reportWindow.document.write("<html><head><title>User Role Rights</title>");
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
        reportWindow.document.write("<h1><u> RoleRights Information </u></h1>");

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

    const handleNavigatesToForm = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);
    };

    const onCellValueChanged = (params) => {
        const updatedRowData = [...rowData];
        const rowIndex = updatedRowData.findIndex(
            (row) => row.keyfield === params.data.keyfield
        );
        if (rowIndex !== -1) {
            updatedRowData[rowIndex][params.colDef.field] = params.newValue;
            setRowData(updatedRowData);

            setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
        }
    };


    const saveEditedData = async () => {
        const modified_by = sessionStorage.getItem('selectedUserCode');
        const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.keyfield === row.keyfield));

        if (selectedRowsData.length === 0) {
            toast.warning("Please select and modify at least one row to update its data.");
            return;
          }

        showConfirmationToast(
            "Are you sure you want to update the data in the selected rows?",
            async () => {
                setLoading(true);
        try {
          
            const response = await fetch(`${config.apiBaseUrl}/saveEditeduserscreenmap`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Modified-By": modified_by
                },
                body: JSON.stringify({ editedData: selectedRowsData, user:sessionStorage.getItem("selectedUserCode"), }),
                "modified_by": modified_by
            });

            if (selectedRowsData.length === 0) {
                toast.warning("Please Select atleast one row to Update")
                return;
            }
            if (response.status === 200) {
                toast.success("Data Updated Successfully")
                return;

            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to Update data");
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


    const deleteSelectedRows = async () => {
        const selectedRows = gridApi.getSelectedRows();

        if (selectedRows.length === 0) {
            toast.warning("Please select at least one row to delete");
            return;
        }
        const modified_by = sessionStorage.getItem('selectedUserCode');
        const keyfieldsToDelete = selectedRows.map((row) => row.keyfield);

        showConfirmationToast(
            "Are you sure you want to Delete the data in the selected rows?",
            async () => {
                setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/userscreenmapdeleteData`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Modified-By": modified_by
                },
                body: JSON.stringify({ keyfieldsToDelete, user:sessionStorage.getItem("selectedUserCode"), }),
                "modified_by": modified_by
            });

            if (response.ok) {
               
                // handleSearch();
                toast.success("Rows deleted successfully")
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
            console.error("Error deleting rows:", error);
            toast.error('Error inserting data: ' + error.message);
          } finally {
            setLoading(false);
          }
        },
        () => {
            toast.info("Data Delete cancelled.");
        }
    );
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
                <div className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start">
                        <h1 className="me-5 ms-4 fs-2 mt-1">Role Rights</h1>
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
                                         {['add', 'all permission'].some(permission => RolerightsPermission.includes(permission)) && (
                                    <li className="dropdown-item" onClick={handleNavigatesToForm}>
                                        <FontAwesomeIcon icon={faUserPlus} style={{ color: "black" }} />
                                    </li>
                                        )}
                                         {['delete', 'all permission'].some(permission => RolerightsPermission.includes(permission)) && (
                                    <li className="dropdown-item" onClick={deleteSelectedRows}>
                                        <FontAwesomeIcon icon={faUserMinus} style={{ color: "red" }} />
                                    </li>
                                     )}
                                     {["update", "all permission"].some((permission) =>
                         RolerightsPermission.includes(permission)
                        ) && (
                                    <li className="dropdown-item" onClick={saveEditedData}>
                                        <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "Green" }} />
                                    </li>
                                      )}
                                       {['all permission', 'Report'].some(permission => RolerightsPermission.includes(permission)) && (
                                    <li className="dropdown-item" onClick={generateReport}>
                                        <FontAwesomeIcon icon={faPrint} style={{ color: "black" }} />
                                    </li>
                                         )}
                                </ul>
                            )}
                        </div>
                        <div className="d-none d-md-flex justify-content-end">
                        {['add', 'all permission'].some(permission => RolerightsPermission.includes(permission)) && (
                            <printbutton className="purbut me-2" onClick={handleNavigatesToForm} title="Add Role Rights">
                                <FontAwesomeIcon icon={faUserPlus} />
                            </printbutton>
                                   )}
                                   {['delete', 'all permission'].some(permission => RolerightsPermission.includes(permission)) && (
                            <delbutton className="purbut me-2" onClick={deleteSelectedRows} title="Delete">
                                <FontAwesomeIcon icon={faUserMinus} />
                            </delbutton>
                                             )}
                                              {["update", "all permission"].some((permission) =>
                                       RolerightsPermission.includes(permission)
                                       ) && (
                            <savebutton className="purbut me-2" onClick={saveEditedData} title="Update">
                                <FontAwesomeIcon icon={faFloppyDisk} />
                            </savebutton>
                                     )}
                                      {['all permission', 'Report'].some(permission => RolerightsPermission.includes(permission)) && (
                            <printbutton className="purbut" onClick={generateReport} title="Generate Report">
                                <FontAwesomeIcon icon={faPrint} />
                            </printbutton>
                                )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="shadow-lg p-1 bg-body-tertiary rounded  mb-2 mt-2">
                <div className="row ms-4 mb-3  mt-3 me-4">
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="tcode" class="exp-form-labels">Role Id</label>
                            <Select
                                id="wcode"
                                className="exp-input-field "
                                type="text"
                                placeholder=""
                                required title="Please Select the Role ID here"
                                value={selectedRole}
                                onChange={handleChangeRoleType}
                                options={filteredOptionRoleType}
                                onKeyDown={(e) => e.key === 'Enter' && screen_type}
                                maxLength={18}
                                autoComplete='off'
                            />
                        </div>
                    </div>
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="tcode" class="exp-form-labels">Screen Type</label>
                            <Select
                                id="wcode"
                                className="exp-input-field "
                                type="text"
                                placeholder=""
                                required title="Please fill the screen type here"
                                value={Selectedscreen}
                                autoComplete='off'
                                onChange={handleChangeScreenType}
                                options={filteredOptionScreenType}
                                onKeyDown={(e) => e.key === 'Enter' && attributedetails_name}
                                maxLength={50}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="tcode" class="exp-form-labels">Permission Type</label>
                            <Select
                                id="wcode"
                                className="exp-input-field "
                                type="text"
                                placeholder=""
                                required title="Please allow the permission here"
                                value={Selectedper}
                                autoComplete='off'
                                onChange={handleChangepertype}
                                options={filteredOptionpertype}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                maxLength={50}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 form-group mt-4 justify-content-end">
                        <button className="p-2 me-3 ps-3 pe-3" onClick={handleSearch}  required title="Search">
                            <FontAwesomeIcon icon={faMagnifyingGlass} />
                        </button>
                        <button className="p-2 me-3 ps-3 pe-3" onClick={reloadGridData} required title="Refresh">
                            <FontAwesomeIcon icon={faArrowRotateRight} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="shadow-lg p-4 bg-body-tertiary rounded-3  mb-2 mt-2">
                <div class="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
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
                <AddRoleRights open={open} handleClose={handleClose} />
            </div>
        </div>
    );
}

export default UserScreenMapGrid;