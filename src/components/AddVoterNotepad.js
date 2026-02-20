import React, { useState, useRef, useEffect } from 'react';
import '../App.css';
import '../Css/AddReport.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faFloppyDisk, faFileLines, faXmark, faListUl } from '@fortawesome/free-solid-svg-icons'; // Import icons
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

const AddVoterNotepad = () => {

    const navigate = useNavigate();
    const [rowData, setRowData] = useState([]);
    const [downloadNotepad, setDowloadNotePad] = useState("");


    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const uploadPatientPermission = permissions
        .filter(permission => permission.screen_type === 'AddVoterNotepad')
        .map(permission => permission.permission_type.toLowerCase());

    const selectedUserCode = sessionStorage.getItem('selectedUserCode');

    const fileInputRef = useRef(null);

    const handleFileUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleNotepadFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
reader.onload = (e) => {
    const rawLines = e.target.result
        .split('\n')
        .map(line =>
            line
                .replace(/photo\s+is/gi, '') // Remove 'photo is'
                .trim()
        );
    const lines = [];



            for (let i = 0; i < rawLines.length; i++) {
                const line = rawLines[i];

                const startsWithDate = line.startsWith('வயது 01-01-2025');
                const endsWithWard = /\(வார்டு\s*-\d+\)$/.test(line);
                const isFullMetadataLine = startsWithDate && endsWithWard;

                const containsPhotoOrAvailable = /photo\s+is/i.test(line) || /available/i.test(line);
                const isConstituencyLine = line.startsWith('சட்டமன்றத் தொகுதியின் எண் மற்றும் பெயர்');
                const containsMatrum = line.includes('மற்றும்');

                if (!isFullMetadataLine && !containsPhotoOrAvailable && !containsMatrum && line !== '') {
                    lines.push(line);
                }
            }

            const newRows = lines.map((line, index) => ({
                serialNumber: index + 1,
                text: line,
            }));
            setRowData(newRows);

            const nameArray = [];
            const fatherOrHusbandArray = [];
            const houseNoArray = [];
            const ageArray = [];
            const genderArray = [];
            const voterIdArray = [];

            lines.forEach((line) => {
                const voterIds = line.match(/\b[A-Z]{1,3}\d{6,9}\b/g);
                if (voterIds) {
                    voterIds.forEach(id => voterIdArray.push(id));
                }

                if (line.includes("பெயர்")) {
                    const nameSegments = line.split(/பெயர்\s*[:：]?\s*/).filter(Boolean);
                    nameSegments.forEach((segment, index) => {
                        const beforeWord = index === 0 ? '' : nameSegments[index - 1].trim();
                        const isNotFatherOrHusband = !/(தந்தை|தந்தையின்|கணவர்|கணவர்பெயர்|தந்தையின்பெயர்|தாயின்|இதர)/.test(beforeWord);
                        if (isNotFatherOrHusband) {
                            const cleanName = segment
                                .replace(/^[^\u0B80-\u0BFFa-zA-Z0-9]+/, '')
                                .split(/தந்தை|தந்தையின்|கணவர்|கணவர்பெயர்|தந்தையின்பெயர்|தாயின்|இதர|வீட்டு|வயது|பாலினம்|[-|]/)[0]
                                .replace(/[-|]/g, '')
                                .trim();
                            if (cleanName) nameArray.push(cleanName);
                        }
                    });
                }

                if (
                    line.includes("தந்தையின் பெயர்") ||
                    line.includes("தந்தை பெயர்") ||
                    line.includes("தந்தையின்பெயர்") ||
                    line.includes("கணவர் பெயர்") ||
                    line.includes("கணவர்பெயர்") ||
                    line.includes("தாயின் பெயர்") ||
                    line.includes("தாயின்பெயர்") ||
                    line.includes("இதரர் பெயர்") ||
                    line.includes("இதரர்பெயர்")
                ) {
                    const fatherHusbandMatches = [...line.matchAll(
                        /(?:தந்தையின் பெயர்|தந்தை பெயர்|தந்தையின்பெயர்|கணவர் பெயர்|கணவர்பெயர்|தாயின் பெயர்|தாயின்பெயர்|இதரர் பெயர்|இதரர்பெயர்)\s*[:：\-]*\s*([^\|\n\r]*)/g
                    )];

                    fatherHusbandMatches.forEach(match => {
                        let cleanFHName = match[1]
                            .split(/வீட்டு|வயது|பாலினம்/)[0]
                            .trim();
                        if (cleanFHName === '' || cleanFHName === '-' || cleanFHName === '--') {
                            fatherOrHusbandArray.push("-");
                        } else {
                            cleanFHName = cleanFHName.replace(/[^\u0B80-\u0BFFa-zA-Z\s]/g, '').trim();
                            fatherOrHusbandArray.push(cleanFHName || "-");
                        }
                    });
                }

                if (line.includes("வீட்டு எண்") || line.includes("வீட்டுஎண்")) {
                    const houseNoMatches = [...line.matchAll(
                        /(?:வீட்டு\s*எண்|வீட்டுஎண்)\s*[:：\-]*\s*(?:எண்[.\s]*)?([A-Za-z0-9\u0B80-\u0BFF\-\/,]+)/g
                    )];
                    houseNoMatches.forEach(match => {
                        if (match[1]) houseNoArray.push(match[1].trim());
                    });
                }

           if (line.includes("வயது")) {
    const ageMatches = [...line.matchAll(/வயது\s*[:：]{1,2}\s*(\d+)/g)];
    ageMatches.forEach(match => {
        if (match[1]) ageArray.push(match[1].trim());
    });
}


                if (line.includes("பாலினம்")) {
                    const genderMatches = [...line.matchAll(/பாலினம்\s*[:：]?\s*(பெண்|ஆண்)/g)];
                    genderMatches.forEach(match => {
                        if (match[1]) genderArray.push(match[1].trim());
                    });
                }
            });

            const finalDataArray = [];
            const maxLength = Math.max(
                voterIdArray.length,
                nameArray.length,
                fatherOrHusbandArray.length,
                houseNoArray.length,
                ageArray.length,
                genderArray.length
            );

            for (let i = 0; i < maxLength; i++) {
                finalDataArray.push({
                    "வாக்காளர் ஐடி": voterIdArray[i] || "",
                    "பெயர்": nameArray[i] || "",
                    "தந்தை/கணவர்": fatherOrHusbandArray[i] || "",
                    "வீட்டு எண்": houseNoArray[i] || "",
                    "வயது": ageArray[i] || "",
                    "பாலினம்": genderArray[i] || ""
                });
            }

            console.log("✅ Final structured array:", finalDataArray);
            setDowloadNotePad(finalDataArray);
        };

        reader.readAsText(file);
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
            field: 'serialNumber',
            editable: false,
            sortable: false,
            minWidth: 80,
            maxWidth: 80
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
            headerName: 'Text',
            field: 'text',
            editable: true,
            sortable: false,
            flex: true
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
                    dol: String(formattedDate),
                    state: String(row.state || ''),
                    district: String(row.district || ''),
                    constituency: String(row.constituency || ''),
                    boothno: String(row.boothno || ''),
                    serialno: String(row.serialno || ''),
                    name: String(row.name || ''),
                    husband_parent_name: String(row.husband_parent_name || ''),
                    houseno: String(row.houseno || ''),
                    age: String(row.age || ''),
                    sex: String(row.sex || ''),
                    voterid: String(row.voterid || '')
                };

                const response = await fetch(`${config.apiBaseUrl}/addVoterList`, {
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

    const downloadFinalDataAsText = (data) => {
        const textContent = data.map((item, index) => (
            `${index + 1} ${item["வாக்காளர் ஐடி"]}
பெயர்: ${item["பெயர்"]}
தந்தைகணவர்: ${item["தந்தை/கணவர்"]}
வீட்டு எண்: ${item["வீட்டு எண்"]}
வயது: ${item["வயது"]}
பாலினம்: ${item["பாலினம்"]}
`
        )).join('\n');

        const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'FinalVoterData.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2 ">
                <div className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start">
                        <h1 className="me-5 ms-4 fs-2 mt-1">Add Voter List</h1>
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
                                            <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "green" }} onClick={() => downloadFinalDataAsText(downloadNotepad)} />
                                        </li>
                                    )}
                                    <li className="dropdown-item">
                                        <FontAwesomeIcon icon={faFileLines} style={{ color: "black" }} onClick={handleFileUploadClick} />
                                    </li>
                                    <li className="dropdown-item">
                                        <FontAwesomeIcon icon={faXmark} style={{ color: "red" }} onClick={handleNavigate} />
                                    </li>
                                </ul>
                            )}
                        </div>
                        <div className="d-none d-md-flex justify-content-end me-3">
                            {['add', 'all permission'].some(permission => uploadPatientPermission.includes(permission)) && (
                                <savebutton className="purbut" title='Generate Notepad' onClick={() => downloadFinalDataAsText(downloadNotepad)}>
                                    <FontAwesomeIcon icon={faFloppyDisk} />
                                </savebutton>
                            )}
                            <printbutton className="purbut" title='Upload Notepad' onClick={handleFileUploadClick}>
                                <FontAwesomeIcon icon={faFileLines} />
                            </printbutton>
                            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".txt" onChange={handleNotepadFile} />
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
            {/* <div className="shadow-lg p-4 bg-body-tertiary rounded-3 mb-2 mt-2">
                <div className="ag-theme-alpine" style={{ height: 400, width: "100%" }}>
                    <AgGridReact
                        columnDefs={columnDefsArray}
                        rowData={rowDataArray}
                    />
                </div>
            </div> */}
        </div>
    );
}

export default AddVoterNotepad;
