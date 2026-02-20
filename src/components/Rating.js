import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate, useLocation } from "react-router-dom";

const config = require('../ApiConfig');

const Rating = () => {
    const [rowData, setRowData] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { checkup_date, department } = location.state || {};

    const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
    const Rating = permissions
      .filter(permission => permission.screen_type === 'Rating')
      .map(permission => permission.permission_type.toLowerCase());

    // console.log(selectedRow);

    useEffect(() => {
        const fetchRatingData = async () => {
            if (!department || !checkup_date) {
                console.error("Required data is missing.");
                toast.error("Required data is missing.");
                return;
            }

            try {
                const body = { department, date: checkup_date };
                const response = await fetch(`${config.apiBaseUrl}/getratingdetails`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

                if (response.ok) {
                    const searchData = await response.json();
                    setRowData(searchData);
                    console.log(searchData);
                } else {
                    console.log("Data not found or bad request");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchRatingData();
    }, [department, checkup_date]);

    const columns = [
        {
            headerName: 'Date',
            field: 'checkup_date',
            maxWidth: 120,
            minWidth: 120,
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
        { headerName: 'Patient Name', field: 'patient_name', maxWidth: 200, minWidth: 200 },
        { headerName: 'Phone No', field: 'phone_no', maxWidth: 250, minWidth: 250 },
        { headerName: 'Department', field: 'department', maxWidth: 500, minWidth: 500 },
        { headerName: 'Rating', field: 'rating', maxWidth: 225, minWidth: 225 },
    ];

    const handleNavigate = () => {
        navigate("/Dashboard");
    };

    return (
        <div>
            <ToastContainer position="top-right" className="toast-design" theme="colored" />
            <div className="row">
                <div className="col-md-12 text-center">
                    <div className="shadow-lg p-0 bg-body-tertiary rounded">
                        <div className="mb-0 d-flex justify-content-between">
                            <h1 className="me-5 ms-4 fs-2 mt-1">Rating</h1>
                            <button onClick={handleNavigate} className="btn btn-danger shadow-none rounded-0 h-70 fs-5" title="Close">
                                <FontAwesomeIcon icon={faSquareXmark} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="pt-2 mb-4">
                    <div className="shadow-lg p-3 bg-body-tertiary rounded mb-2">
                        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                            <AgGridReact columnDefs={columns} rowData={rowData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Rating;
