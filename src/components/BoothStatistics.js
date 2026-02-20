import React, { useState, useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faUserPlus,
  faListUl,
  faMagnifyingGlass,
  faUserMinus,
  faPrint,
  faEnvelope,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import { AgGridReact } from "ag-grid-react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showConfirmationToast } from "./ToastConfirmation";
//import AddBoothWiseStatistics from "./AddBoothStatistics";
import LoadingPopup from "./LoadingPopup";
const config = require("../ApiConfig");

const BoothStatistics = () => {
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [state, setState] = useState("");
  const [stateDrop, setStateDrop] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [constituency, setConstituency] = useState("");
  const [constituencyDrop, setConstituencyDrop] = useState([]);
  const [boothno, setboothno] = useState("");
  const [boothname, setname] = useState("");
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState("");
  const [districtDrop, setDistrictDrop] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState([]);

  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const uploadedPatientPermission = permissions
    .filter((permission) => permission.screen_type === "BoothStatistics")
    .map((permission) => permission.permission_type.toLowerCase());

  const selectedUserCode = sessionStorage.getItem("selectedUserCode");

  const handleChangeState = (SelectSIDdrop) => {
    setSelectedState(SelectSIDdrop);
    setState(SelectSIDdrop ? SelectSIDdrop.value : "");
  };

  const handleChangeDistrict = (SelectSIDdrop) => {
    setSelectedDistrict(SelectSIDdrop);
    setDistrict(SelectSIDdrop ? SelectSIDdrop.value : "");
  };

  const handleChangeConstituency = (SelectSIDdrop) => {
    setSelectedConstituency(SelectSIDdrop);
    setConstituency(SelectSIDdrop ? SelectSIDdrop.value : "");
  };

  const filteredOptionState = stateDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionConstituency = constituencyDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionDistrict = districtDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getState`)
      .then((data) => data.json())
      .then((val) => setStateDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getDistrict`)
      .then((data) => data.json())
      .then((val) => setDistrictDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getConstituency`)
      .then((data) => data.json())
      .then((val) => setConstituencyDrop(val));
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
  };
  const currentLength = rowData.length;

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "State",
      field: "state",
      sortable: false,
    },
    {
      headerName: "District",
      field: "district",
      sortable: false,
    },
    {
      headerName: "Constituency",
      field: "constituency",
      sortable: false,
    },
    {
      headerName: "Booth No",
      field: "boothno",
      sortable: false,
      editable: true,
    },
    {
      headerName: "Booth Name",
      field: "boothname",
      sortable: false,
      editable: true,
    },
    {
      headerName: "ADMK+",
      field: "ADMK",
      sortable: false,
      editable: true,
    },
    {
      headerName: "DMK+",
      field: "DMK",
      sortable: false,
      editable: true,
    },
    {
      headerName: "ADMK+ %",
      field: "ADMK_per",
      editable: true,
      sortable: false,
    },
    {
      headerName: "DMK+ %",
      field: "DMK_per",
      editable: true,
      sortable: false,
    },
    {
      headerName: "Total",
      field: "Total",
      editable: true,
      sortable: false,
    },
    {
      headerName: "Target",
      field: "Target",
      editable: true,
      sortable: false,
    },
    {
      headerName: "Target %",
      field: "Target_per",
      editable: true,
      sortable: false,
    },
    {
      headerName: "Status",
      field: "Status",
      editable: true,
    },
    {
      headerName: "Observation",
      field: "Observation",
      editable: true,
      sortable: false,
    },
    {
      headerName: "Remarks",
      field: "Remarks",
      editable: true,
      sortable: false,
    },
    {
      headerName: "Keyfield",
      field: "keyfield",
      editable: true,
      sortable: false,
      hide: true,
    },
  ];

  const handleNavigate = () => {
    navigate("/AddBoothStatistics");
  };

  // const handleSearch = async () => {
  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/SearchBoothStatics`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({

  //       })
  //     });
  //     if (response.ok) {
  //       const searchData = await response.json();
  //       setRowData(searchData);
  //       console.log("Data fetched successfully");
  //     } else if (response.status === 404) {
  //       console.log("Data not found");
  //       toast.warning("Data not found")
  //       setRowData([]);
  //     } else {
  //       const errorResponse = await response.json();
  //       toast.warning(errorResponse.message || "Failed to get data");
  //       console.error(errorResponse.details || errorResponse.message);
  //     }
  //   } catch (error) {
  //     console.error("Error while Deleting data:", error);
  //     toast.error('An error occurred while fetching data: ' + error.message);
  //   }
  // };

const handleSearch = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${config.apiBaseUrl}/SearchBoothStatics`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state,
        district,
        constituency,
        boothno,
        boothname,
        user:sessionStorage.getItem("selectedUserCode"),
      }),
    });

    if (response.ok) {
      const searchData = await response.json();
      const newRows = searchData.map((matchedItem) => ({
        state: matchedItem.state,
        district: matchedItem.district,
        constituency: matchedItem.constituency,
        boothno: matchedItem.boothno,
        boothname: matchedItem.boothname,
        ADMK: matchedItem["ADMK_+"],
        DMK: matchedItem["DMK_+"],
        ADMK_per: matchedItem["%_ADMK_+"],
        DMK_per: matchedItem["%_DMK_+"],
        Target: matchedItem["Target"],
        Target_per: matchedItem["Target_%"],
        Status: matchedItem["Status"],
        Observation: matchedItem["Observation"],
        Remarks: matchedItem["Remarks"],
        Total: matchedItem["Total"],
        keyfield: matchedItem["keyfield"],
      }));
      setRowData(newRows);
      console.log("Data fetched successfully");
    } else if (response.status === 404) {
      console.log("Data not found");
      toast.warning("Data not found");
      setRowData([]);
    } else {
      const errorResponse = await response.json();
      toast.warning(errorResponse.message || "Failed to get data");
      console.error(errorResponse.details || errorResponse.message);
    }
  } catch (error) {
    console.error("Error while fetching data:", error);
    toast.error("An error occurred while fetching data: " + error.message);
  } finally {
    setLoading(false);
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
        setLoading(true);
        try {
          const response = await fetch(
            `${config.apiBaseUrl}/DeleteBoothWiseStatistics`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Modified-By": selectedUserCode,
              },
              body: JSON.stringify({
                keyfieldToDelete: keyfieldToDelete,
                user:sessionStorage.getItem("selectedUserCode"),
              }),
            }
          );
          if (response.ok) {
            console.log("Rows deleted successfully:", keyfieldToDelete);
            // handleSearch();
            toast.success("Rows deleted successfully");
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to delete data");
            console.error(errorResponse.details || errorResponse.message);
          }
        } catch (error) {
          console.error("Error deleting rows:", error);
          toast.error("Error inserting data: " + error.message);
        } finally {
          setLoading(false);
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
      // const formattedDate = new Date(row.checkup_date)
      //   .toISOString()
      //   .split("T")[0];
      return {
        State: row.state,
        District: row.district,
        Constituency: row.constituency,
        "Booth No": row.boothno,
        "Booth Name": row.boothname,
        "ADMK+": row.ADMK,
        "DMK+": row.DMK,
        "ADMK+ %": row.ADMK_per,
        "DMK+ %": row.DMK_per,
        "Total": row.Total,
        "Target": row.Target,
        "Target %": row.Target_per,
        "Status": row.Status,
        "Observation": row.Observation,
        "Remarks": row.Remarks
      };
    });

    const reportWindow = window.open("", "_blank");
    reportWindow.document.write(
      "<html><head><title>Booth Wise Statistics</title>"
    );
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
    reportWindow.document.write("<h1><u>Booth Wise Statistics</u></h1>");

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
    const selectedRowsData = gridApi
      .getSelectedNodes()
      .map((node) => node.data);

    if (selectedRowsData.length === 0) {
      toast.warning(
        "Please select and modify at least one row to update its data"
      );
      return;
    }

    showConfirmationToast(
      "Are you sure you want to update the data in the selected rows?",
      async () => {
        setLoading(true);
        try {
          const modified_by = sessionStorage.getItem("selectedUserCode");

          const response = await fetch(
            `${config.apiBaseUrl}/UpdateBoothWiseStatistics`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Modified-By": modified_by,
              },
              body: JSON.stringify({ editedData: selectedRowsData, user:sessionStorage.getItem("selectedUserCode"), }),
            }
          );

          if (response.ok) {
            toast.success("Data Updated Successfully");
          } else {
            const errorResponse = await response.json();
            toast.warning(errorResponse.message || "Failed to update data.");
            console.error(errorResponse.details || errorResponse.message);
          }
        } catch (error) {
          console.error("Error inserting data:", error);
          toast.error("Error inserting data: " + error.message);
        } finally {
          setLoading(false);
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
      {loading && <LoadingPopup />}
      <ToastContainer
        position="top-right"
        className="toast-design"
        theme="colored"
      />
      <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2 ">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="me-5 ms-4 fs-2 mt-1"> Booth Statistics</h1>
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
                  {["add", "all permission"].some((permission) =>
                    uploadedPatientPermission.includes(permission)
                  ) && (
                    <li className="dropdown-item" onClick={handleNavigate}>
                      <FontAwesomeIcon
                        icon={faUserPlus}
                        style={{ color: "black" }}
                      />
                    </li>
                  )}
                  {["delete", "all permission"].some((permission) =>
                    uploadedPatientPermission.includes(permission)
                  ) && (
                    <li className="dropdown-item" onClick={handleDelete}>
                      <FontAwesomeIcon
                        icon={faUserMinus}
                        style={{ color: "red" }}
                      />
                    </li>
                  )}
                  {["all permission", "view"].some((permission) =>
                    uploadedPatientPermission.includes(permission)
                  ) && (
                    <li className="dropdown-item" onClick={generateReport}>
                      <FontAwesomeIcon
                        icon={faPrint}
                        style={{ color: " green" }}
                      />
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="d-none d-md-flex  justify-content-end">
              {["add", "all permission"].some((permission) =>
                uploadedPatientPermission.includes(permission)
              ) && (
                <savebutton
                  title="Add Booth Statistics"
                  className="purbut"
                  onClick={handleNavigate}
                >
                  <FontAwesomeIcon icon={faUserPlus} />
                </savebutton>
              )}
              {["delete", "all permission"].some((permission) =>
                uploadedPatientPermission.includes(permission)
              ) && (
                <delbutton
                  title="Delete"
                  className="purbut"
                  onClick={handleDelete}
                >
                  <FontAwesomeIcon icon={faUserMinus} />
                </delbutton>
              )}
              {["update", "all permission"].some((permission) =>
                uploadedPatientPermission.includes(permission)
              ) && (
                <savebutton
                  className="purbut me-2"
                  onClick={saveEditedData}
                  title="Update"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </savebutton>
              )}
              {["all permission", "Report"].some((permission) =>
                uploadedPatientPermission.includes(permission)
              ) && (
                <printbutton
                  className="purbut me-2"
                  onClick={generateReport}
                  title="Generate Report"
                >
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
              <label for="state" class="exp-form-labels">
                State
              </label>
              <Select
                id="Gender"
                value={selectedState}
                onChange={handleChangeState}
                options={filteredOptionState}
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
                District
              </label>
              <Select
                id="Gender"
                value={selectedDistrict}
                onChange={handleChangeDistrict}
                options={filteredOptionDistrict}
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
              <label for="Detail" class="exp-form-labels">
                Constituency
              </label>
              <Select
                id="Gender"
                value={selectedConstituency}
                onChange={handleChangeConstituency}
                options={filteredOptionConstituency}
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
            <div>
              <label for="state" class="exp-form-labels">
                Booth No
              <span className="text-danger">*</span></label>
              </div>
              <input
                id="Gender"
                value={boothno}
                onChange={(e) => setboothno(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Booth Name
              </label>
              <input
                id="Gender"
                value={boothname}
                onChange={(e) => setname(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div class="col-md-2 form-group mt-4 justify-content-end mb-3">
            <button
              className="p-2 me-3 ps-3 pe-3"
              onClick={handleSearch}
              title="Search"
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
            <button
              className="p-2 me-3 ps-3 pe-3"
              onClick={reloadGridData}
              title="Refresh"
            >
              <FontAwesomeIcon icon={faArrowRotateRight} />
            </button>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-4 bg-body-tertiary rounded-3 mb-2 mt-2">
        <div className="ag-theme-alpine" style={{ height: 437, width: "100%" }}>
          <AgGridReact
            onGridReady={onGridReady}
            columnDefs={columnDefs}
            rowData={rowData}
            rowSelection="multiple"
            pagination={true}
            paginationAutoPageSize={true}
          />
        </div>
      </div>
    </div>
  );
};

export default BoothStatistics;
