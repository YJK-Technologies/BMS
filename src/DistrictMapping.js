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
import AddDistrictMapping from './AddDistrictMapping'
import { showConfirmationToast } from './ToastConfirmation';
const config = require('../ApiConfig');

function DistrictMapping() {
    const [rowData, setRowData] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [editedData, setEditedData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [stateDrop, setStateDrop] = useState([]);
    const [districtDrop, setDistrictDrop] = useState([]);
    const [constituencyDrop, setConstituencyDrop] = useState([]);
    const [statusDrop, setStatusDrop] = useState([]);
    const [userCodeDrop, setUserCodeDrop] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedConstituency, setSelectedConstituency] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedUserCode, setSelectedUserCode] = useState('');
    const [state, setState] = useState('');
    const [district, setDistrict] = useState('');
    const [constituency, setConstituency] = useState('');
    const [status, setStatus] = useState('');
    const [userCode, setUserCode] = useState('');

    const reloadGridData = () => {
        window.location.reload();
    };

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const DistrictMappingPermission = permissions
        .filter(permission => permission.screen_type === 'DistrictMapping')
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
        setState(SelectSIDdrop ? SelectSIDdrop.value : "");
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
        setDistrict(SelectSIDdrop ? SelectSIDdrop.value : "");
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
        setConstituency(SelectSIDdrop ? SelectSIDdrop.value : "");
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/status`)
            .then((data) => data.json())
            .then((val) => setStatusDrop(val));
    }, []);

    const filteredOptionStatus = statusDrop.map((option) => ({
        value: option.attributedetails_name,
        label: option.attributedetails_name,
    }));

    const handleChangeStatus = (selectedStatus) => {
        setSelectedStatus(selectedStatus);
        setStatus(selectedStatus ? selectedStatus.value : "");
    };

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/status`)
            .then((response) => response.json())
            .then((data) => {
                const Screens = data.map(option => option.attributedetails_name);
                setStatusDrop(Screens);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getConstituency`)
            .then((response) => response.json())
            .then((data) => {
                const Permissions = data.map(option => option.attributedetails_name);
                setConstituencyDrop(Permissions);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    useEffect(() => {
        fetch(`${config.apiBaseUrl}/getDistrict`)
            .then((response) => response.json())
            .then((data) => {
                const Permissions = data.map(option => option.attributedetails_name);
                setDistrictDrop(Permissions);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleSearch = async () => {
        setLoading(true);
        try {

            const response = await fetch(`${config.apiBaseUrl}/DistrictMappingSearchCretria`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify({ user_code:userCode, state, district, constituency, status })
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


    const columnDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            headerName: "User Code",
            field: "user_code",
            editable: false,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
        },
        {
            headerName: "State",
            field: "state",
            editable: false,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
        },
        {
            headerName: "District",
            field: "district",
            editable: true,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: districtDrop,
            },
        },
        {
            headerName: "Constituency",
            field: "constituency",
            editable: true,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: constituencyDrop,
            },
        },
        {
            headerName: "Status",
            field: "status",
            editable: true,
            cellStyle: { textAlign: "left" },
            minWidth: 150,
            cellEditor: "agSelectCellEditor",
            cellEditorParams: {
                values: statusDrop,
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
                "State": row.state,
                "District": row.district,
                "Constituency": row.constituency,
                "Status": row.status,
            };
        });

        const reportWindow = window.open("", "_blank");
        reportWindow.document.write("<html><head><title>District Mapping</title>");
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
        reportWindow.document.write("<h1><u>District Mapping Information</u></h1>");

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

    const saveEditedData = async () => {
        const selectedRowsData = editedData.filter(row => selectedRows.some(selectedRow => selectedRow.keyfield === row.keyfield));
        if (selectedRowsData.length === 0) {
            toast.warning("Please select a row to update its data");
            return;
        }

        showConfirmationToast(
            "Are you sure you want to update the data in the selected rows?",
            async () => {

                try {
                    const modified_by = sessionStorage.getItem('selectedUserCode');

                    const response = await fetch(`${config.apiBaseUrl}/updateDistrictMapping`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "modified-by": modified_by
                        },
                        body: JSON.stringify({ editedData: selectedRowsData }),
                    });

                    if (response.ok) {
                        console.log("Data saved successfully!");
                        toast.success("Data Updated Successfully!");
                        return;
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Failed to insert sales data");
                    }
                } catch (error) {
                    console.error("Error saving data:", error);
                    toast.error("Error Updating Data: " + error.message);
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
            toast.warning("Please select atleast One Row to Delete");
            return;
        }

        const modified_by = sessionStorage.getItem('selectedUserCode');

        const keyfieldsToDelete = selectedRows.map((row) => row.keyfield);
        showConfirmationToast(
            "Are you sure you want to Delete the data in the selected rows?",
            async () => {

                try {
                    const response = await fetch(`${config.apiBaseUrl}/deleteDistrictMapping`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Modified-By": modified_by

                        },
                        body: JSON.stringify({ keyfield:keyfieldsToDelete }),
                        "modified_by": modified_by

                    });

                    if (response.ok) {
                        toast.success("Data Deleted Successfully")
                    } else {
                        const errorResponse = await response.json();
                        toast.warning(errorResponse.message || "Failed to insert sales data");
                    }
                } catch (error) {
                    console.error("Error saving data:", error);
                    toast.error("Error Deleting Data: " + error.message);
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

        useEffect(() => {
        fetch(`${config.apiBaseUrl}/getUserCode`)
            .then((data) => data.json())
            .then((val) => setUserCodeDrop(val));
    }, []);

    const filteredOptionUserCode = userCodeDrop.map((option) => ({
        value: option.user_code,
        label: option.user_code,
    }));

    const handleChangeUserCode = (SelectSIDdrop) => {
        setSelectedUserCode(SelectSIDdrop);
        setUserCode(SelectSIDdrop ? SelectSIDdrop.value : "");
    };

    return (
        <div class="main-content">
            {loading && <LoadingPopup />}
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2">
                <div className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start">
                        <h1 className="me-5 ms-4 fs-2 mt-1">District Mapping</h1>
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
                                    {['add', 'all permission'].some(permission => DistrictMappingPermission.includes(permission)) && (
                                        <li className="dropdown-item" onClick={handleNavigatesToForm}>
                                            <FontAwesomeIcon icon={faUserPlus} style={{ color: "black" }} />
                                        </li>
                                    )}
                                    {['delete', 'all permission'].some(permission => DistrictMappingPermission.includes(permission)) && (
                                        <li className="dropdown-item" onClick={deleteSelectedRows}>
                                            <FontAwesomeIcon icon={faUserMinus} style={{ color: "red" }} />
                                        </li>
                                    )}
                                    {["update", "all permission"].some((permission) =>
                                        DistrictMappingPermission.includes(permission)
                                    ) && (
                                            <li className="dropdown-item" onClick={saveEditedData}>
                                                <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "Green" }} />
                                            </li>
                                        )}
                                    {['all permission', 'Report'].some(permission => DistrictMappingPermission.includes(permission)) && (
                                        <li className="dropdown-item" onClick={generateReport}>
                                            <FontAwesomeIcon icon={faPrint} style={{ color: "black" }} />
                                        </li>
                                    )}
                                </ul>
                            )}
                        </div>
                        <div className="d-none d-md-flex justify-content-end">
                            {['add', 'all permission'].some(permission => DistrictMappingPermission.includes(permission)) && (
                                <printbutton className="purbut me-2" onClick={handleNavigatesToForm} title="Add Role Rights">
                                    <FontAwesomeIcon icon={faUserPlus} />
                                </printbutton>
                            )}
                            {['delete', 'all permission'].some(permission => DistrictMappingPermission.includes(permission)) && (
                                <delbutton className="purbut me-2" onClick={deleteSelectedRows} title="Delete">
                                    <FontAwesomeIcon icon={faUserMinus} />
                                </delbutton>
                            )}
                            {["update", "all permission"].some((permission) =>
                                DistrictMappingPermission.includes(permission)
                            ) && (
                                    <savebutton className="purbut me-2" onClick={saveEditedData} title="Update">
                                        <FontAwesomeIcon icon={faFloppyDisk} />
                                    </savebutton>
                                )}
                            {['all permission', 'Report'].some(permission => DistrictMappingPermission.includes(permission)) && (
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
                            <label for="tcode" class="exp-form-labels">User Code</label>
                            <Select
                                id="wcode"
                                className="exp-input-field"
                                type="text"
                                placeholder=""
                                required title="Please Select the Role ID here"
                                value={selectedUserCode}
                                onChange={handleChangeUserCode}
                                options={filteredOptionUserCode}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                maxLength={18}
                                autoComplete='off'
                            />
                        </div>
                    </div>
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="tcode" class="exp-form-labels">State</label>
                            <Select
                                id="wcode"
                                className="exp-input-field"
                                type="text"
                                placeholder=""
                                required title="Please Select the Role ID here"
                                value={selectedState}
                                onChange={handleChangeState}
                                options={filteredOptionState}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                maxLength={18}
                                autoComplete='off'
                            />
                        </div>
                    </div>
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="tcode" class="exp-form-labels">District</label>
                            <Select
                                id="wcode"
                                className="exp-input-field "
                                type="text"
                                placeholder=""
                                required title="Please fill the screen type here"
                                value={selectedDistrict}
                                autoComplete='off'
                                onChange={handleChangeDistrict}
                                options={filteredOptionDistrict}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                maxLength={50}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="tcode" class="exp-form-labels">Constituency</label>
                            <Select
                                id="wcode"
                                className="exp-input-field "
                                type="text"
                                placeholder=""
                                required title="Please allow the permission here"
                                value={selectedConstituency}
                                autoComplete='off'
                                onChange={handleChangeConstituency}
                                options={filteredOptionConstituency}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                maxLength={50}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 form-group">
                        <div class="exp-form-floating">
                            <label for="tcode" class="exp-form-labels">Status</label>
                            <Select
                                id="wcode"
                                className="exp-input-field "
                                type="text"
                                placeholder=""
                                required title="Please allow the permission here"
                                value={selectedStatus}
                                autoComplete='off'
                                onChange={handleChangeStatus}
                                options={filteredOptionStatus}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                maxLength={50}
                            />
                        </div>
                    </div>
                    <div className="col-md-3 form-group mt-4 justify-content-end">
                        <button className="p-2 me-3 ps-3 pe-3" onClick={handleSearch}>
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
                <AddDistrictMapping open={open} handleClose={handleClose} />
            </div>
        </div>
    );
}

export default DistrictMapping;