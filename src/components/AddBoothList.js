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
const config = require('../ApiConfig');

const AddBoothList = () => {

    const navigate = useNavigate();
    const [rowData, setRowData] = useState([]);

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const uploadPatientPermission = permissions
        .filter(permission => permission.screen_type === 'UploadPatient')
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
                "S.No", "Name", "Address", "Age", "Qualification", "Caste", "Posting",
                "Mobile No", "DOJ", "Member ID", "Voter Serial No", "Aadhar No", "State",
                "District", "Constituency", "Booth No"
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
                    serialno: row[headerIndexMap["S.No"]] || currentLength + index + 1,
                    dojparty: typeof row[headerIndexMap["DOJ"]] === 'number'
                        ? excelDateToJSDate(row[headerIndexMap["DOJ"]])
                        : row[headerIndexMap["DOJ"]] || '',
                    name: row[headerIndexMap["Name"]] || '',
                    address: row[headerIndexMap["Address"]] || '',
                    age: row[headerIndexMap["Age"]] || '',
                    qualification: row[headerIndexMap["Qualification"]] || '',
                    caste: row[headerIndexMap["Caste"]] || '',
                    posting: row[headerIndexMap["Posting"]] || '',
                    mobileno: row[headerIndexMap["Mobile No"]] || '',
                    memberid: row[headerIndexMap["Member ID"]] || '',
                    voterserialno: row[headerIndexMap["Voter Serial No"]] || '',
                    aadharno: row[headerIndexMap["Aadhar No"]] || '',
                    state: row[headerIndexMap["State"]] || '',
                    district: row[headerIndexMap["District"]] || '',
                    constituency: row[headerIndexMap["Constituency"]] || '',
                    boothno: row[headerIndexMap["Booth No"]] || ''
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
        {
            headerName: 'S.No',
            field: 'serialno',
            maxWidth: 70,
            sortable: false,
            editable: false,
        },
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

            headerName: 'Name',
            field: 'name',
            sortable: false,
          
        },
        {
            headerName: 'Address',
            field: 'address',
            editable: false,
            filter: true,
            sortable: false,
        },
        {
            headerName: 'Age',
            field: 'age',
            editable: false,
            filter: true,
            sortable: false
        },
        {
            headerName: 'Qualification',
            field: 'qualification',
            editable: false,
            filter: true,
            sortable: false
        },
        {
            headerName: 'Caste',
            field: 'caste',
            editable: false,
            filter: true,
            sortable: false
        },
        {
            headerName: 'Posting',
            field: 'posting',
            editable: true,
        },
        {
            headerName: 'Mobile No',
            field: 'mobileno',
            editable: true,
        },
        {
            headerName: 'DOJ',
            field: 'dojparty',
            editable: true,
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
            headerName: 'Member ID',
            field: 'memberid',
            editable: true,
        },
        {
            headerName: 'Voter Serial No',
            field: 'voterserialno',
            editable: true,
        },
        {
            headerName: 'Aadhar No',
            field: 'aadharno',
            editable: true,
        },
        {
            headerName: 'State',
            field: 'state',
            editable: true,
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
        },
        {
            headerName: 'Booth No',
            field: 'boothno',
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
            const formattedDate = new Date(row.dol).toISOString().split('T')[0];

            const Details = {
                created_by: String(selectedUserCode),
                dojparty: String(formattedDate),
                name: String(row.name || ''),
                address: String(row.address || ''),
                age: String(row.age || ''),
                qualification: String(row.qualification || ''),
                caste: String(row.caste || ''),
                posting: String(row.posting || ''),
                mobileno: String(row.mobileno || ''),
                memberid: String(row.memberid || ''),
                voterserialno: String(row.voterserialno || ''),
                aadharno: String(row.aadharno || ''),
                state: String(row.state || ''),
                district: String(row.district || ''),
                constituency: String(row.constituency || ''),
                boothno: String(row.boothno || ''),
            };

            const response = await fetch(`${config.apiBaseUrl}/AddBoothWiseList`, {
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
                        <h1 className="me-5 ms-4 fs-2 mt-1">Upload Voter List</h1>
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

export default AddBoothList;
