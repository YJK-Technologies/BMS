import Reactm, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AgGridReact } from "ag-grid-react";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useNavigate } from "react-router-dom";
import './Attribute.css';
import LoadingPopup from './components/LoadingPopup';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from '../src/components/ToastConfirmation';
import { faMinus, faPlus, faFloppyDisk, faPrint, faListUl } from '@fortawesome/free-solid-svg-icons';
const config = require('./ApiConfig');

const AttriDetGrid = () => {
  const [attributeheader_code, setattributeheader_code] = useState("");
  const [attributedetails_code, setattributedetails_code] = useState("");
  const [attributedetails_name, setattributedetails_name] = useState("");
  const [descriptions, setdescriptions] = useState("");
  const navigate = useNavigate();
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const AttributeDetailPermission = permissions
    .filter(permission => permission.screen_type === 'Master')
    .map(permission => permission.permission_type.toLowerCase());


  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  const columnDefs = [

    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "Code",
      field: "attributeheader_code",
      cellStyle: { textAlign: "center" },
      minWidth: 250,
      maxWidth: 250,
      cellEditorParams: {
        maxLength: 18,
      },
    },
    {
      headerName: "Sub Code",
      field: "attributedetails_code",
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Detail Name",
      field: "attributedetails_name",
      editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
    {
      headerName: "Description",
      field: "descriptions",
      editable: true,
      cellStyle: { textAlign: "center" },
      minWidth: 150,
      cellEditorParams: {
        maxLength: 250,
      },
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    flex: 1,
  };
  const handleNavigatesToForm = () => {
    navigate("/MasterDetails", { state: { mode: "create" } }); // Pass selectedRows as props to the Input component
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/getattributeSearchdata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ attributeheader_code, attributedetails_code, attributedetails_name, descriptions, user:sessionStorage.getItem("selectedUserCode"), }) // Send as search criteria
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


  const reloadGridData = () => {
    window.location.reload();
  };


  const deleteSelectedRows = async () => {
    const selectedRows = gridApi.getSelectedRows();

    if (selectedRows.length === 0) {
      toast.warning("Please select atleast One row to delete")
      return;
    }

    const company_code = sessionStorage.getItem('selectedCompanyCode');
    const modified_by = sessionStorage.getItem('selectedUserCode');

    const attributeheader_codesToDelete = selectedRows.map((row) => row.attributeheader_code);
    const attributedetails_codeToDelete = selectedRows.map((row) => row.attributedetails_code);

    showConfirmationToast(
      "Are you sure you want to Delete the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/deleteAttriDetailData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "Modified-By": modified_by
            },
            body: JSON.stringify({ attributeheader_codesToDelete, attributedetails_codeToDelete, user:sessionStorage.getItem("selectedUserCode"), }),
            "company_code": company_code,
            "modified_by": modified_by
          });
          if (response.ok) {
            console.log("Rows deleted successfully:", attributeheader_codesToDelete, attributedetails_codeToDelete);
            toast.success("Data Deleted Successfully")
          }
          else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to Delete data");
            console.error(errorResponse.details || errorResponse.message);
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

  const onCellValueChanged = (params) => {
    const updatedRowData = [...rowData];
    const rowIndex = updatedRowData.findIndex(
      (row) => row.attributeheader_code === params.data.attributeheader_code && row.attributedetails_code === params.data.attributedetails_code
    );
    if (rowIndex !== -1) {
      updatedRowData[rowIndex][params.colDef.field] = params.newValue;
      setRowData(updatedRowData);
      setEditedData((prevData) => [...prevData, updatedRowData[rowIndex]]);
    }
  };

  const saveEditedData = async () => {
    const selectedRowsData = editedData.filter(row =>
      selectedRows.some(selectedRow =>
        selectedRow.attributeheader_code === row.attributeheader_code &&
        selectedRow.attributedetails_code === row.attributedetails_code
      )
    );

    if (selectedRowsData.length === 0) {
      toast.warning("Please select and modify at least one row to update its data.");
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const company_code = sessionStorage.getItem('selectedCompanyCode');
          const modified_by = sessionStorage.getItem('selectedUserCode');
          const response = await fetch(`${config.apiBaseUrl}/updattridetData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "company_code": company_code,
              "Modified-By": modified_by
            },
            body: JSON.stringify({
              attributeheader_codesToUpdate: selectedRowsData.map(row => row.attributeheader_code),
              attributedetails_codesToUpdate: selectedRowsData.map(row => row.attributedetails_code),
              updatedData: selectedRowsData,
              company_code: company_code,
              modified_by: modified_by,
              user:sessionStorage.getItem("selectedUserCode"),
            })
          });
          if (response.status === 200) {
            console.log("Data Updated successfully");
            toast.success("Data updated successfully!");
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to update data.");
            console.error(errorResponse.details || errorResponse.message);
          }
        } catch (error) {
          console.error("Error updating data:", error);
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

  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };


  const generateReport = () => {
    const selectedRows = gridApi.getSelectedRows();
    if (selectedRows.length === 0) {
      toast.warning("Please select at least one row to generate a report");
      return;
    }
    const reportData = selectedRows.map((row) => {
      return {
        "Code": row.attributeheader_code,
        "Sub Code": row.attributedetails_code,
        "Detail Name": row.attributedetails_name,
        "Description": row.descriptions,
      };
    });
    const reportWindow = window.open("", "_blank");
    reportWindow.document.write("<html><head><title>Master</title>");
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
    reportWindow.document.write("<h1><u>Master</u></h1>");

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



  return (
    <div className="main-content" >
      {loading && <LoadingPopup />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2">
        <div className=" d-flex justify-content-between">
          <div class="d-flex justify-content-start">
            <h1 className="me-5 ms-4 fs-2 mt-1">Master</h1>
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
                  {['add', 'all permission'].some(permission => AttributeDetailPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={handleNavigatesToForm}>
                      <FontAwesomeIcon icon={faPlus} style={{ color: "black" }} />
                    </li>
                  )}
                  {['delete', 'all permission'].some(permission => AttributeDetailPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={deleteSelectedRows}>
                      <FontAwesomeIcon icon={faMinus} style={{ color: "red" }} />
                    </li>
                  )}
                  {['all permission', 'update'].some(permission => AttributeDetailPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={saveEditedData}>
                      <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "green" }} />
                    </li>
                  )}
                  <li className="dropdown-item">
                    <FontAwesomeIcon icon={faPrint} style={{ color: "black" }} />
                  </li>
                </ul>
              )}
            </div>
            <div className="d-none d-md-flex  justify-content-end">
              {['add', 'all permission'].some(permission => AttributeDetailPermission.includes(permission)) && (
                <printbutton title='Add' className="purbut" onClick={handleNavigatesToForm}>
                  <FontAwesomeIcon icon={faPlus} />
                </printbutton>
              )}
              {['delete', 'all permission'].some(permission => AttributeDetailPermission.includes(permission)) && (
                <delbutton title='Delete' className="purbut" onClick={deleteSelectedRows}>
                  <FontAwesomeIcon icon={faMinus} />
                </delbutton>
              )}
              {['all permission', 'update'].some(permission => AttributeDetailPermission.includes(permission)) && (
                <savebutton title="Update" className="purbut" onClick={saveEditedData}>
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </savebutton>
              )}
              <printbutton title="Generate Report" className="purbut" onClick={generateReport}>
                <FontAwesomeIcon icon={faPrint} />
              </printbutton>
            </div>
          </div>
          {/* <div className="d-flex justify-content-end">
              <div className='desktop mt-2'>
              {['add', 'all permission'].some(permission => AttributeDetailPermission.includes(permission)) && (
                <savebutton
                  className="purbut"
                  title="Add Attribute"
                  onClick={handleNavigatesToForm}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </savebutton>
                    )}
                     {['delete', 'all permission'].some(permission => AttributeDetailPermission.includes(permission)) && (
                <delbutton
                  className="purbut"
                  required
                  title="Delete"
                  onClick={deleteSelectedRows}
                  
                >
                  <FontAwesomeIcon icon={faMinus} />
                </delbutton>
                     )}
                      {["update", "all permission"].some((permission) =>
                         AttributeDetailPermission.includes(permission)
                        ) && (
                <updatebutton
                  className="purbut"
                  title="Update"
                  onClick={saveEditedData}
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </updatebutton>
                      )}
                         {['all permission', 'Report'].some(permission => AttributeDetailPermission.includes(permission)) && (
                <printbutton
                  className="purbut"
                  title="Generate Report"
                >
                  <FontAwesomeIcon icon={faPrint} />
                </printbutton>
                     )}
              </div>
              <div className="button-container">
                <div className="dropdown d-md-none rounded-end">
                  <div
                    className="btn btn-primary p-2 rounded-0 dropdown-toggle"
                    type="button"
                    onClick={toggleDropdown}
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </div>
                  {isOpen && (
                    <ul className="dropdown-menu show ">
                       {['add', 'all permission'].some(permission => AttributeDetailPermission.includes(permission)) && (
                      <li className="dropdown-item" onClick={handleNavigatesToForm}>
                        <FontAwesomeIcon icon={faPlus} style={{ color: "green" }} />
                      </li>
                        )}
                        {['delete', 'all permission'].some(permission => AttributeDetailPermission.includes(permission)) && (
                      <li className="dropdown-item" onClick={deleteSelectedRows}>
                        <FontAwesomeIcon icon={faMinus} style={{ color: "red" }} />
                      </li>
                        )}
                         {["update", "all permission"].some((permission) =>
                         AttributeDetailPermission.includes(permission)
                        ) && (
                        <li className="dropdown-item" onClick={saveEditedData}>
                        <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "" }} />
                      </li>
                                   )}
                      <li className="dropdown-item">
                        <FontAwesomeIcon icon={faPrint} style={{ color: "black" }} />
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div> */}
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded-3  mb-2 mt-2">
        <div className="row ms-4 me-4 mt-3 mb-3">
          <div className="col-md-3 form-group mb-2">
            <div class="exp-form-floating">
              <label for="locno" class="exp-form-labels">Code</label>
              <input
                id="locno"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please fill the header code here"
                value={attributeheader_code}
                autoComplete='off'
                maxLength={18}
                onChange={(e) => setattributeheader_code(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="lname" class="exp-form-labels">Subcode</label>
              <input
                id="lname"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please fill the sub code here"
                value={attributedetails_code}
                autoComplete='off'
                maxLength={18}
                onChange={(e) => setattributedetails_code(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="Detail" class="exp-form-labels">Detail Name</label>
              <input
                id="city"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please fill the detail name here"
                value={attributedetails_name}
                autoComplete='off'
                maxLength={250}
                onChange={(e) => setattributedetails_name(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-3 form-group">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">Description</label>
              <input
                id="state"
                className="exp-input-field form-control"
                type="text"
                placeholder=""
                required
                title="Please fill the description here"
                value={descriptions}
                autoComplete='off'
                maxLength={250}
                onChange={(e) => setdescriptions(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
        <div class="ag-theme-alpine" style={{ height: 450, width: "100%" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            onGridReady={onGridReady}
            onCellValueChanged={onCellValueChanged}
            onSelectionChanged={onSelectionChanged}
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </div>
    </div>
  )
}

export default AttriDetGrid;