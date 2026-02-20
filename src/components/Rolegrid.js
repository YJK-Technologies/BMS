import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import '../App.css';
import '../Css/AddReport.css'
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import LoadingPopup from "./LoadingPopup";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'react-toastify';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus, faUserMinus, faFloppyDisk, faPrint, faListUl } from '@fortawesome/free-solid-svg-icons'
import AddRole from './AddRole'
import Select from "react-select";
import {showConfirmationToast}  from './ToastConfirmation'; 
const config = require('../ApiConfig');


function RoleGrid() {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const navigate = useNavigate();
    const [editedData, setEditedData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [role_name, setrole_name] = useState("");
    const [open, setOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [roleType, setRoleType] = useState("");
    const [roleDrop, setRoleDrop] = useState([]); 
    const [loading, setLoading] = useState(false);  

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const Rolegridpermission = permissions
      .filter(permission => permission.screen_type === 'Role')
      .map(permission => permission.permission_type.toLowerCase());

      useEffect(() => {
        fetch(`${config.apiBaseUrl}/getRoleIDDrop`)
          .then((data) => data.json())
          .then((val) => setRoleDrop(val));
      }, []);

      const handleChangeRoleType = (selectedUser) => {
        setSelectedRole(selectedUser);
        setRoleType(selectedUser ? selectedUser.value : "");
      };

      const filteredOptionRoleType = roleDrop.map((option) => ({
        value: option.role_id,
        label: `${option.role_name} - ${option.role_id}`,
      }));

    const handleSearch = async () => {
        setLoading(true);
        try {
        
            const response = await fetch(`${config.apiBaseUrl}/getRolesearchdata`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ role_id:roleType, role_name, user:sessionStorage.getItem("selectedUserCode") }) // Send company_no and company_name as search criteria
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

    const reloadGridData = () => {
        window.location.reload();
    };


    const handleNavigateToForm = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    const columnDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            headerName: "Role ID",
            field: "role_id",
            cellStyle: { textAlign: "left" },
            minWidth: 250,
            maxWidth: 250,
            cellEditorParams: {
                maxLength: 18,
            },
            valueFormatter: (params) => {
                return params.value ? params.value.toUpperCase() : '';
            },
        },
        {
            headerName: "Role Name",
            field: "role_name",
            editable: true,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
            cellEditorParams: {
                maxLength: 50,
            },
            valueFormatter: (params) => {
                return params.value ? params.value.toUpperCase() : '';
            },
        },
        {
            headerName: "Description",
            field: "description",
            editable: true,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
            maxWidth: 150,
            cellEditorParams: {
                maxLength: 255,
            },
            valueFormatter: (params) => {
                return params.value ? params.value.toUpperCase() : '';
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
            return {
                "Role ID": row.role_id,
                "Role Name": row.role_name,
                "Description": row.description,

            };
        });

        const reportWindow = window.open("", "_blank");
        reportWindow.document.write("<html><head><title>Role</title>");
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
        reportWindow.document.write("<h1><u>Role Information</u></h1>");

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

    const onSelectionChanged = () => {
        const selectedNodes = gridApi.getSelectedNodes();
        const selectedData = selectedNodes.map((node) => node.data);
        setSelectedRows(selectedData);
    };
    // Assuming you have a unique identifier for each row, such as 'id'
    const onCellValueChanged = (params) => {
        const updatedRowData = [...rowData];
        const rowIndex = updatedRowData.findIndex(
            (row) => row.role_id === params.data.role_id // Use the unique identifier 
        );
        if (rowIndex !== -1) {
            updatedRowData[rowIndex][params.colDef.field] = params.newValue;
            setRowData(updatedRowData);

            setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
        }
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
                setLoading(true);
                try {
                    const modified_by = sessionStorage.getItem('selectedUserCode');
    
                    const response = await fetch(`${config.apiBaseUrl}/RolesaveEditedData`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Modified-By": modified_by
                        },
                        body: JSON.stringify({ editedData: selectedRowsData, user:sessionStorage.getItem("selectedUserCode") })
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


    const deleteSelectedRows = async () => {
        const selectedRows = gridApi.getSelectedRows();

        if (selectedRows.length === 0) {
            toast.warning("Please select at least one row to delete");
            return;
        }

        const modified_by = sessionStorage.getItem('selectedUserCode');

        const role_idsToDelete = selectedRows.map((row) => row.role_id);

        showConfirmationToast(
            "Are you sure you want to Delete the data in the selected rows?",
            async () => {
                setLoading(true);
        try {
            const response = await fetch(`${config.apiBaseUrl}/roledeleteData`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Modified-By": modified_by

                },
                body: JSON.stringify({ role_idsToDelete, user:sessionStorage.getItem("selectedUserCode") }),
                "modified_by": modified_by

            });


            if (response.ok) {
                toast.success("Data Deleted Successfully")
                
                 window.location.reload();
            } else {
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to Delete data");
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
                <div className="d-flex justify-content-between ">
                    <div class="d-flex justify-content-start">
                        <h1 align="left" className="me-5 ms-4 fs-2 mt-1">Role</h1>
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
                                       {['add', 'all permission'].some(permission => Rolegridpermission.includes(permission)) && (
                                    <li className="dropdown-item" onClick={handleNavigateToForm} title="Add Role">
                                        <FontAwesomeIcon icon={faUserPlus} style={{ color: " black" }} />
                                    </li>
                                          )}
                                           {['delete', 'all permission'].some(permission => Rolegridpermission.includes(permission)) && (
                                    <li className="dropdown-item" onClick={deleteSelectedRows} title="Delete">
                                        <FontAwesomeIcon icon={faUserMinus} style={{ color: "red" }} />
                                    </li>
                                                        )}
                                        {["update", "all permission"].some((permission) =>
                                       Rolegridpermission.includes(permission)
                                       ) && (
                                    <li className="dropdown-item" onClick={saveEditedData} title="Update">
                                        <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "green" }} />
                                    </li>
                                        )}
                                           {['all permission', 'Report'].some(permission => Rolegridpermission.includes(permission)) && (
                                    <li className="dropdown-item" onClick={generateReport} title="Generate Report">
                                        <FontAwesomeIcon icon={faPrint} style={{ color: "black" }} />
                                    </li>
                                         )}
                                </ul>
                            )}
                        </div>
                        <div className="d-none d-md-flex justify-content-end">
                        {['add', 'all permission'].some(permission => Rolegridpermission.includes(permission)) && (
                            <printbutton className="purbut me-2" onClick={handleNavigateToForm} title="Add Role">
                                <FontAwesomeIcon icon={faUserPlus} />
                            </printbutton>
                                  )}
                                  {['delete', 'all permission'].some(permission => Rolegridpermission.includes(permission)) && (
                            <delbutton className="purbut me-2" onClick={deleteSelectedRows} title="Delete">
                                <FontAwesomeIcon icon={faUserMinus} />
                            </delbutton>
                             )}
                              {["update", "all permission"].some((permission) =>
                                       Rolegridpermission.includes(permission)
                                       ) && (
                            <savebutton className="purbut me-2" onClick={saveEditedData} title="Update">
                                <FontAwesomeIcon icon={faFloppyDisk} />
                            </savebutton>
                                                         )}
                                                               {['all permission', 'Report'].some(permission => Rolegridpermission.includes(permission)) && (
                            <printbutton className="purbut me-2" onClick={generateReport} title="Generate Report">
                                <FontAwesomeIcon icon={faPrint} />
                            </printbutton>
                                         )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="shadow-lg p-1 bg-body-tertiary rounded-3  mb-2 mt-2">
                <div className="row ms-4 mt-3 mb-3 me-4">
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="rolid" class="exp-form-labels">Role ID</label>
                            <Select
                                id="rolid"
                                className="exp-input-field"
                                type="text"
                                placeholder=""
                                required title="Please fill the role ID here"
                                value={selectedRole}
                                autoComplete='off'
                                maxLength={18}
                                onChange={handleChangeRoleType}
                                options={filteredOptionRoleType}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="rolid" class="exp-form-labels">Role Name</label>
                            <input
                                id="rolid"
                                className="exp-input-field form-control"
                                type="text"
                                placeholder=""
                                required title="Please fill the role name here"
                                value={role_name}
                                autoComplete='off'
                                maxLength={18}
                                onChange={(e) => setrole_name(e.target.value)} 
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    </div>
                    <div class="col-md-3 form-group mt-4 justify-content-end">
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
                <div class="ag-theme-alpine" style={{ height: 520, width: "100%", }}>
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
                <AddRole open={open} handleClose={handleClose} />
            </div>
        </div>
    );
}

export default RoleGrid;
