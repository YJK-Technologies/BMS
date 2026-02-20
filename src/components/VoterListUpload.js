import React, { useState, useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import '../App.css';
import { AgGridReact } from "ag-grid-react";
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faListUl, faFileLines } from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showConfirmationToast } from './ToastConfirmation';
import { useNavigate } from 'react-router-dom';
import LoadingPopup from "./LoadingPopup";
const config = require('../ApiConfig');


const VoterListUpload = () => {
  const [age, setage] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [SelectedMovedList, setSelectedMovedList] = useState("");
  const [MovedList, setMovedList] = useState("");
  const [MovedListDrop, setMovedListDrop] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [ward_no, setward_no] = useState("");
  const [booth_no, setbooth_no] = useState("");
  const [file_name, setfile_name] = useState("");
  const [filepath, setfilepath] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [stateDrop, setStateDrop] = useState([]);
  const [districtDrop, setDistrictDrop] = useState([]);
  const [constituencyDrop, setConstituencyDrop] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [fileNameDrop, setFileNameDrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [fileName, setfileName] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const permissions = JSON.parse(sessionStorage.getItem('permissions')) || {};
  const uploadedPatientPermission = permissions
    .filter(permission => permission.screen_type === 'VoterListUpload')
    .map(permission => permission.permission_type.toLowerCase());

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getState`)
      .then((data) => data.json())
      .then((val) => setStateDrop(val));
  }, []);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getFileName`)
      .then((data) => data.json())
      .then((val) => setFileNameDrop(val));
  }, []);

  const filteredOptionState = stateDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const filteredOptionFileName = fileNameDrop.map((option) => ({
    value: option.file_name,
    label: option.file_name,
  }));

  const handleChangeFileName = (SelectSIDdrop) => {
    setSelectedFileName(SelectSIDdrop);
    setfileName(SelectSIDdrop ? SelectSIDdrop.value : '');
  };

  const handleChangeState = (SelectSIDdrop) => {
    setSelectedState(SelectSIDdrop);
    setState(SelectSIDdrop ? SelectSIDdrop.value : '');
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
    setDistrict(SelectSIDdrop ? SelectSIDdrop.value : '');
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
    setConstituency(SelectSIDdrop ? SelectSIDdrop.value : '');
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getSettings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_code: sessionStorage.getItem('selectedUserCode'),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || data.length === 0) return;

        const {
          state,
          district,
          constituency,
        } = data[0];

        const setDefault = (type, setType, options, setSelected) => {
          if (type !== undefined && type !== null) {
            const typeStr = type.toString();
            setType(typeStr);
            setSelected(options.find((opt) => opt.value === typeStr) || null);
          }
        };

        setDefault(state, setState, filteredOptionState, setSelectedState);
        setDefault(district, setDistrict, filteredOptionDistrict, setSelectedDistrict);
        setDefault(constituency, setConstituency, filteredOptionConstituency, setSelectedConstituency);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [stateDrop, districtDrop, constituencyDrop]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/AddVoterListTest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ward_no,
          booth_no,
          constituence: constituency,
          file_name,
          filepath,
          user:sessionStorage.getItem("selectedUserCode"),
        })
      });
      if (response.ok) {
        toast.success("Data inserted successfully")
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

  const onSelectionChanged = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);
  };

  const columnDefs = [
    {
      // headerCheckboxSelection: true,
      // checkboxSelection: true,
      headerName: 'Constituency',
      field: 'constituency',
      editable: false,

      sortable: false
    },
    {
      headerName: 'Booth No',
      field: 'boothno',
      editable: false,
      sortable: false
    },
    {
      headerName: 'S.No',
      field: 'serialno',
      maxWidth: 100,
      sortable: false,
      editable: false,
    },
    {
      headerName: 'Name',
      field: 'name',
      editable: true,
    },
    {
      headerName: 'Husband/Parent Name',
      field: 'husband_parent_name',
      editable: true,
    },
    {
      headerName: 'House No',
      field: 'houseno',
      editable: true,
    },
    {
      headerName: 'Age',
      field: 'age',
      editable: true,
    },
    {
      headerName: 'Sex',
      field: 'sex',
      editable: true,
    },
    {
      headerName: 'Voter Id',
      field: 'voterid',
      editable: true,
    },
    {
      headerName: 'File Name',
      field: 'file_name',
      editable: true,
    },
    {
      headerName: 'Live Status',
      field: 'live_moved',
      editable: true,
    },
  ];

  const defaultColDef = {
    resizable: true,
    wrapText: true,
    flex: 1,
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  // const handleSearch = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${config.apiBaseUrl}/searchVoterListTest`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         file_name: fileName,
  //         Lived_moved: SelectedMovedList,
  //       }),
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
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSearch = async () => {
  setLoading(true);
  try {
    const payload = {
      file_name: fileName,
      Live_moved: MovedList,
      user:sessionStorage.getItem("selectedUserCode")
    };

    // ✅ Log the data you're sending
    console.log("Sending payload to API:", payload);

    const response = await fetch(`${config.apiBaseUrl}/searchVoterListTest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const searchData = await response.json();
      setRowData(searchData);
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
    toast.error('An error occurred while fetching data: ' + error.message);
  } finally {
    setLoading(false);
  }
};


  const reloadGridData = () => {
    window.location.reload()
  };

  const handleUpdate = async () => {
    showConfirmationToast(
      "Are you sure you want to move to original table  file name?",
      async () => {
        setLoading(true);
        try {
          const response = await fetch(`${config.apiBaseUrl}/moveVoterListLiveTest`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              file_name: fileName,
              created_by: sessionStorage.getItem('selectedUserCode')
            })
          });
          if (response.ok) {
            toast.success("Data inserted successfully")
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
      },
      () => {
        toast.info("Data updated cancelled.");
      }
    );
  };

  const handleNotepadUpload = () => {
    navigate("/AddVoterNotepad");
  };



    useEffect(() => {
    fetch(`${config.apiBaseUrl}/getMovedList`)
      .then((data) => data.json())
      .then((val) => setMovedListDrop(val));
  }, []);

  const filteredOptionMovedList = MovedListDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeMovedList = (SelectSIDdrop) => {
    setSelectedMovedList(SelectSIDdrop);
    setMovedList(SelectSIDdrop ? SelectSIDdrop.value : '');
  };

  return (
    <div class="main-content">
      {loading && <LoadingPopup />}
      <ToastContainer position="top-right" className="toast-design" theme="colored" />
      <div className="shadow-lg p-0 bg-body-tertiary rounded-3 mb-2 mt-2 ">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h1 className="me-5 ms-4 fs-2 mt-1">Voter List Upload</h1>
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
                  {['add', 'all permission'].some(permission => uploadedPatientPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={handleSave}>
                      <FontAwesomeIcon icon={faFloppyDisk} style={{ color: "black" }} />
                    </li>
                  )}
                  {['all permission', 'view'].some(permission => uploadedPatientPermission.includes(permission)) && (
                    <li className="dropdown-item" onClick={handleNotepadUpload}>
                      <FontAwesomeIcon icon={faFileLines} style={{ color: " green" }} />
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="d-none d-md-flex  justify-content-end">
              {['add', 'all permission'].some(permission => uploadedPatientPermission.includes(permission)) && (
                <savebutton title='Save' className="purbut" onClick={handleSave}>
                  <FontAwesomeIcon icon={faFloppyDisk} />
                </savebutton>
              )}
              {['all permission', 'Report'].some(permission => uploadedPatientPermission.includes(permission)) && (
                <printbutton className="purbut me-2" onClick={handleNotepadUpload} title="Voter Notepad">
                  <FontAwesomeIcon icon={faFileLines} />
                </printbutton>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded-3 mb-2 mt-2">
        <div className="row ms-4 me-4 mt-3">
          <div className="col-md-1 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Ward No
              </label>
              <input
                id="Gender"
                value={ward_no}
                onChange={(e) => setward_no(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          <div className="col-md-1 form-group mb-2">
            <div class="exp-form-floating">
              <label for="lname" class="exp-form-labels">
                Booth No
              </label>
              <input
                id="Gender"
                value={booth_no}
                onChange={(e) => setbooth_no(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                data-tip="Please select a payment type"
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
                className=""
                placeholder=""
                required
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                File Name
              </label>
              <input
                id="Gender"
                value={file_name}
                onChange={(e) => setfile_name(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="col-md-5 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                File Path
              </label>
              <input
                id="Gender"
                value={filepath}
                onChange={(e) => setfilepath(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              />
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded-3 mb-2 mt-2">
        <div className="d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <h5 className="me-5 ms-4 mt-1">Search Criteria</h5>
          </div>
        </div>
        <div className="row ms-4 me-4 mt-3">
          <div className="col-md-3 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                File Name
              </label>
              <Select
                id="Gender"
                value={selectedFileName}
                onChange={handleChangeFileName}
                options={filteredOptionFileName}
                className="exp-input-field"
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="col-md-3 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Files Status
              </label>
              <Select
                id="Gender"
                value={SelectedMovedList}
                onChange={handleChangeMovedList}
                options={filteredOptionMovedList}
                className="exp-input-field"
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="col-md-4 mt-4 form-group mb-2">
            <button className="p-2 me-3 ps-3 pe-3" title="Search" onClick={handleSearch}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
            <button className="p-2 me-3 ps-3 pe-3" title="Refresh" onClick={reloadGridData}>
              <FontAwesomeIcon icon={faArrowRotateRight} />
            </button>
            <button className="p-2 me-3 ps-3 pe-3" title="Move to server" onClick={handleUpdate}>
              <FontAwesomeIcon icon={faFloppyDisk} />
            </button>
          </div>
          <div class="ag-theme-alpine" style={{ height: 450, width: "100%" }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              onGridReady={onGridReady}
              onSelectionChanged={onSelectionChanged}
              pagination={true}
              paginationAutoPageSize={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoterListUpload;