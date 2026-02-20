    import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import '../Css/AddReport.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFloppyDisk, faFileExcel, faXmark, faListUl } from '@fortawesome/free-solid-svg-icons'; // Import icons
import { AgGridReact } from 'ag-grid-react';
import { useNavigate } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import '../Css/Report.css'
//import { AddBoothWiseStatistics } from '../../backend/controllers/dataController';
const config = require('../ApiConfig');

const AddBoothStatistics = () => {

    const navigate = useNavigate();
    const [rowData, setRowData] = useState([]);

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const uploadPatientPermission = permissions
        .filter(permission => permission.screen_type === 'AddBoothStatistics')
        .map(permission => permission.permission_type.toLowerCase());

    const selectedUserCode = sessionStorage.getItem('selectedUserCode');

    const fileInputRef = useRef(null);

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

// Utility function to convert Excel date number to JS date string
const excelDateToJSDate = (serial) => {
    const utcDays = Math.floor(serial - 25569);
    const utcValue = utcDays * 86400;
    const dateInfo = new Date(utcValue * 1000);
    const date = dateInfo.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    return date;
};

// Reset file input helper
const resetFileInput = (inputElement) => {
    if (inputElement) inputElement.value = '';
};

// Main handler
const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const [headers, ...rows] = jsonData;

            if (!headers || headers.length === 0) {
                toast.warning("Invalid File: Missing headers.");
                resetFileInput(event.target);
                return;
            }

            // Normalize headers to lowercase for comparison
            const normalizedHeaders = headers.map(header => header?.toString().trim().toLowerCase());

            // Expected headers from your image
            const expectedHeaders = [
                 "Booth No", "Booth Name", "Constituency","District","State","ADMK+", "DMK+", "ADMK+ %", "DMK+ %",
                "Target", "Target %", "Status", "Observation", "Remarks", "Total"
            ];
            const expectedHeadersLower = expectedHeaders.map(h => h.toLowerCase());

            // Check for missing headers
            const missingHeaders = expectedHeadersLower.filter(
                header => !normalizedHeaders.includes(header)
            );

            if (missingHeaders.length > 0) {
                const displayMissing = expectedHeaders.filter((_, i) =>
                    !normalizedHeaders.includes(expectedHeadersLower[i])
                );
                toast.warning(`Invalid File: Missing headers: ${displayMissing.join(', ')}`);
                resetFileInput(event.target);
                return;
            }

            // Create header index map
            const headerIndexMap = {};
            expectedHeaders.forEach((header, i) => {
                headerIndexMap[header] = normalizedHeaders.indexOf(expectedHeadersLower[i]);
            });

            const currentLength = rowData.length; // Make sure rowData is defined in your component state

            // Convert rows to objects
            const newData = rows
                .filter(row => row.some(cell => cell && cell.toString().trim() !== ''))
                .map((row, index) => ({
                   
                    boothno: row[headerIndexMap["Booth No"]] || '',
                    boothname: row[headerIndexMap["Booth Name"]] || '',
                    constituency: row[headerIndexMap["Constituency"]] || '',
                    district: row[headerIndexMap["District"]] || '',
                    state: row[headerIndexMap["State"]] || '',
                    ADMK: row[headerIndexMap["ADMK+"]] || '',
DMK: row[headerIndexMap["DMK+"]] || '',
ADMK_per: row[headerIndexMap["ADMK+ %"]] || '',
DMK_per: row[headerIndexMap["DMK+ %"]] || '',

                    Target: row[headerIndexMap["Target"]] || '',
                    Target_per: row[headerIndexMap["Target %"]] || '',
                    Status: row[headerIndexMap["Status"]] || '',
                    Observation: row[headerIndexMap["Observation"]] || '',
                    Remarks: row[headerIndexMap["Remarks"]] || '',
                    Total: row[headerIndexMap["Total"]] || ''
                }));

            // Update state with new data
            setRowData(prev => [...prev, ...newData]);

        } catch (error) {
            console.error("Error processing file:", error);
            toast.error("Error processing the file. Please check format.");
        } finally {
            resetFileInput(event.target);
        }
    };

    reader.readAsArrayBuffer(file);
};



    const handleDelete = (params) => {
        const serialNumberToDelete = params.data.serialNumber;

        const updatedRowData = rowData.filter(row => row.serialNumber !== serialNumberToDelete);

        setRowData(updatedRowData);

        const updatedRowDataWithNewSerials = updatedRowData.map((row, index) => ({
            ...row,
            serialNumber: index + 1
        }));
        setRowData(updatedRowDataWithNewSerials);

    };

    const columnDefs = [
        // {
        //     headerName: 'S.No',
        //     field: 'serialno',
        //     maxWidth: 70,
        //     sortable: false,
        //     editable: false,
        // },
        {
            headerName: '',
            field: 'delete',
            editable: false,
            maxWidth: 40,
            tooltipValueGetter: () => "Delete",
            onCellClicked: handleDelete,
            cellRenderer: () => (
                <FontAwesomeIcon icon={faTrash} style={{ cursor: 'pointer', marginRight: "12px" }} />
            ),
            cellStyle: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
            sortable: false
        },
         {
            headerName: 'State',
            field: 'state',
            editable: false,
            
            sortable: false
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
            sortable: false,
          
        },
        {
            headerName: 'Booth Name',
            field: 'boothname',
            editable: false,
            
            sortable: false,
        },
        
       
       
        {
            headerName: 'ADMK+',
            field: 'ADMK',
            editable: true,
        },
        {
            headerName: 'DMK+',
            field: 'DMK',
            editable: true,
        },
        
        {
            headerName: 'ADMK+ %',
             field: 'ADMK_per',
            editable: true,
        },
        {
            headerName: 'DMK+ %',
              field: 'DMK_per',
            editable: true,
        },
          {
            headerName: 'Total',
            field: 'Total',
            editable: true,
        },
        {
            headerName: 'Target',
            field: 'Target',
            editable: true,
        },
        {
            headerName: 'Target %',
            field: 'Target_per',
            editable: true,
        },
        {
            headerName: 'Status',
            field: 'Status',
            editable: true,
        },
        {
            headerName: 'Observation',
            field: 'Observation',
            editable: true,
        },
        {
            headerName: 'Remarks',
            field: 'Remarks',
            editable: true,
        },
      
    ];

const handleSaveClick = async () => {
    if (rowData.length === 0) {
        toast.warning("Please import the Excel file first.");
        return;
    }

    try {
        let allSuccess = true;

        for (const row of rowData) {

            const Details = {
                created_by: String(selectedUserCode),
                boothno: String(row.boothno || ''),
                boothname: String(row.boothname || ''),
                constituency: String(row.constituency || ''),
                district: String(row.district || ''),
                state: String(row.state || ''),
                ADMK: String(row.ADMK || ''),
                DMK: String(row.DMK || ''),
                ADMK_per: String(row.ADMK_per || ''),
                DMK_per: String(row.DMK_per || ''),
                Target: String(row.Target || ''),
                Target_per: String(row.Target_per || ''),
                Status: String(row.Status || ''),
                Observation: String(row.Observation || ''),
                Remarks: String(row.Remarks || ''),
                Total: String(row.Total || ''),
            };

            const response = await fetch(`${config.apiBaseUrl}/AddBoothWiseStatistics`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(Details),
            });

            if (!response.ok) {
                allSuccess = false;
                const errorResponse = await response.json();
                toast.warning(errorResponse.message || "Failed to insert data for a row.");
                console.error(errorResponse.details || errorResponse.message);
            }
        }

        if (allSuccess) {
            toast.success("All data inserted successfully!");
        }

    } catch (error) {
        console.error("Error inserting data:", error);
        toast.error('Error inserting data: ' + error.message);
    }
};


    const handleNavigate = () => {
        navigate(-1);
    };

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2 ">
                <div className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start">
                        <h1 className="me-5 ms-4 fs-2 mt-1">Add Booth Statistics</h1>
                    </div>
                    <div className="button-container">
                        <div className="dropdown d-md-none rounded-end">
                            <div
                                className="btn btn-primary p-2 rounded-end dropdown-toggle"
                                type="button"
                                onClick={toggleDropdown}
                            >
                                <FontAwesomeIcon icon={faListUl} />
                            </div>
                            {isOpen && (
                                <ul className="dropdown-menu show ">
                                    {['add', 'all permission'].some(permission => uploadPatientPermission.includes(permission)) && (
                                        <li className="dropdown-item">
                                            <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "green" }} onClick={handleSaveClick} />
                                        </li>
                                    )}
                                    <li className="dropdown-item">
                                        <FontAwesomeIcon icon={faFileExcel} style={{ color: "black" }} onClick={handleFileUploadClick} />
                                    </li>
                                    <li className="dropdown-item">
                                        <FontAwesomeIcon icon={faXmark} style={{ color: "red" }} onClick={handleNavigate} />
                                    </li>
                                </ul>
                            )}
                        </div>
                        <div className="d-none d-md-flex justify-content-end me-3">
                            {['add', 'all permission'].some(permission => uploadPatientPermission.includes(permission)) && (
                                <savebutton className="purbut" title='Save' onClick={handleSaveClick}>
                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                </savebutton>
                            )}
                            <printbutton className="purbut" title='Upload Excel' onClick={handleFileUploadClick}>
                                <FontAwesomeIcon icon={faFileExcel} />
                            </printbutton>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
                            <button onClick={handleNavigate} className="btn btn-danger rounded-end h-70 fs-5" required title="Close">
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="shadow-lg p-4 bg-body-tertiary rounded-3 mb-2 mt-2 ">
                <div className="ag-theme-alpine" style={{ height: 437, width: "100%" }}>
                    <AgGridReact
                        columnDefs={columnDefs}
                        rowData={rowData}
                    />
                </div>
            </div>
        </div>
    );
}

export default AddBoothStatistics;
