import React, { useState, useEffect } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faMagnifyingGlass,
  faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingPopup from "./LoadingPopup";
const config = require("../ApiConfig");

const Report = () => {
  const [boothno, setboothno] = useState("");
  const [serialno, setserialno] = useState("");
  const [name, setname] = useState("");
  const [husband_parent_name, sethusband_parent_name] = useState("");
  const [houseno, sethouseno] = useState("");
  const [age, setage] = useState("");
  const [voterid, setvoterid] = useState("");
  const [party_info, setparty_info] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [constituency, setConstituency] = useState("");
  const [sex, setSex] = useState("");
  const [contact_no, setcontact_no] = useState("");
  const [first_time_voter, setfirst_time_voter] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedConstituency, setSelectedConstituency] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [selectedVoter, setSelectedVoter] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [stateDrop, setStateDrop] = useState([]);
  const [districtDrop, setDistrictDrop] = useState([]);
  const [constituencyDrop, setConstituencyDrop] = useState([]);
  const [partyDrop, setPartyDrop] = useState([]);
  const [voterDrop, setVoterDrop] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedData, setEditedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cast, setcast] = useState('');
  const [Desired_Union_Secretary, setDesired_Union_Secretary] = useState('');
  const [status, setStatus] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('');
  const [statusDrop, setStatusDrop] = useState([]);
  const [casteDrop, setCasteDrop] = useState([]);
  const [selectedCaste, setSelectedCaste] = useState('');

  const permissions = JSON.parse(sessionStorage.getItem("permissions")) || {};
  const uploadedPatientPermission = permissions
    .filter((permission) => permission.screen_type === "VoterList")
    .map((permission) => permission.permission_type.toLowerCase());

  const columnDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      headerName: "DOL",
      field: "dol",
      sortable: false,
      valueFormatter: (params) => {
        if (params.value) {
          const date = new Date(params.value);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${day}-${month}-${year}`;
        }
        return "";
      },
    },
    {
      headerName: "State",
      field: "state",
      editable: false,
      sortable: false,
    },
    {
      headerName: "District",
      field: "district",
      editable: false,
      sortable: false,
    },
    {
      headerName: "Constituency",
      field: "constituency",
      editable: false,
      sortable: false,
    },
    {
      headerName: "Booth No",
      field: "boothno",
      editable: false,
      sortable: false,
    },
    {
      headerName: "S.No",
      field: "serialno",
      maxWidth: 100,
      sortable: false,
      editable: false,
    },
    {
      headerName: "Name",
      field: "name",
      editable: true,
    },
    {
      headerName: "Husband/Parent Name",
      field: "husband_parent_name",
      editable: true,
    },
    {
      headerName: "House No",
      field: "houseno",
      editable: true,
    },
    {
      headerName: "Age",
      field: "age",
      editable: true,
    },
    {
      headerName: "Sex",
      field: "sex",
      editable: true,
    },
    {
      headerName: "Voter Id",
      field: "voterid",
      editable: true,
    },
    {
      headerName: "Keyfield", field: "keyfield",
      editable: true,
      hide: true,
    },
  ];

  const handleSearch = async () => {
    if (!serialno) {
      toast.warning("Please Enter the constituency, booth no and serial no");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/searchVoter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          constituency: sessionStorage.getItem("selectedUserContituency"),
          user:sessionStorage.getItem("selectedUserCode"),
          boothno:sessionStorage.getItem("selectedBoothno"),
          serialno,
        }),
      });

      if (response.ok) {
        const searchData = await response.json();

        if (Array.isArray(searchData) && searchData.length > 0) {
          const {
            age,
            houseno,
            husband_parent_name,
            name,
            sex,
            voterid,
            serialno,
            party_info,
            first_time_voter,
            contact_no,
            cast,
            status,
          } = searchData[0];

          // basic fields
          setname(name || "");
          setage(age || "");
          sethouseno(houseno || "");
          sethusband_parent_name(husband_parent_name || "");
          setSex(sex || "");
          setvoterid(voterid || "");
          setserialno(serialno || "");
          setcontact_no(contact_no || "");

          // dropdowns - find selected options safely
          const selectedParty = filteredOptionParty.find(
            (option) => option.value === party_info
          );
          if (selectedParty) {
            setSelectedParty(selectedParty);
            setparty_info(selectedParty.value);
          }

          const selectedVoter = filteredOptionVoter.find(
            (option) => option.value === first_time_voter
          );
          if (selectedVoter) {
            setSelectedVoter(selectedVoter);
            setfirst_time_voter(selectedVoter.value);
          }

          const selectedStatus = filteredOptionStatus.find(
            (option) => option.value === status
          );
          if (selectedStatus) {
            setSelectedStatus(selectedStatus);
            setStatus(selectedStatus.value);
          }

          const selectedCaste = filteredOptionCaste.find(
            (option) => option.value === cast
          );
          if (selectedCaste) {
            setSelectedCaste(selectedCaste);
            setcast(selectedCaste.value);
          }

          console.log("Fetched voter:", searchData[0]);
        } else {
          toast.warning("No data returned");
        }
      } else if (response.status === 404) {
        console.log("Data not found");
        toast.warning("Data not found");
        resetFormFields();
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to get data");
        console.error(errorResponse.details || errorResponse.message);
        resetFormFields();
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
      toast.error("An error occurred while fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetFormFields = () => {
    setname("");
    setage("");
    sethouseno("");
    sethusband_parent_name("");
    setSex("");
    setvoterid("");
    setserialno("");
    setcontact_no("");
    setfirst_time_voter("");
    setparty_info("");
    setStatus("");
    setcast("");
    setSelectedParty(null);
    setSelectedVoter(null);
    setSelectedStatus(null);
    setSelectedCaste(null);
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const reloadGridData = () => {
    window.location.reload();
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl}/addVoterAdditionalData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: sessionStorage.getItem('selectedUserState'),
          district: sessionStorage.getItem('selectedUserDistrict'),
          constituency: sessionStorage.getItem('selectedUserContituency'),
          boothno:sessionStorage.getItem("selectedBoothno"),
          serialno,
          name,
          husband_parent_name,
          houseno,
          age,
          sex,
          voterid,
          party_info,
          first_time_voter,
          contact_no,
          cast,
          Desired_Union_Secretary,
          status
        }),
      });

      if (response.ok) {
        toast.success("Data inserted successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorResponse = await response.json();
        toast.warning(errorResponse.message || "Failed to get data");
        console.error(errorResponse.details || errorResponse.message)
      }
    } catch (error) {
      console.error("Error while Deleting data:", error);
      toast.error("An error occurred while fetching data: " + error.message);
    } finally {
      setLoading(false);
    }
  };


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
    fetch(`${config.apiBaseUrl}/getParty`)
      .then((data) => data.json())
      .then((val) => setPartyDrop(val));
  }, []);

  const filteredOptionParty = partyDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeParty = (SelectSIDdrop) => {
    setSelectedParty(SelectSIDdrop);
    setparty_info(SelectSIDdrop ? SelectSIDdrop.value : "");
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getVoter`)
      .then((data) => data.json())
      .then((val) => setVoterDrop(val));
  }, []);

  const filteredOptionVoter = voterDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeVoter = (SelectSIDdrop) => {
    setSelectedVoter(SelectSIDdrop);
    setfirst_time_voter(SelectSIDdrop ? SelectSIDdrop.value : "");
  };

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/getVoterStatus`)
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
    fetch(`${config.apiBaseUrl}/getCaste`)
      .then((data) => data.json())
      .then((val) => setCasteDrop(val));
  }, []);

  const filteredOptionCaste = casteDrop.map((option) => ({
    value: option.attributedetails_name,
    label: option.attributedetails_name,
  }));

  const handleChangeCaste = (selectedStatus) => {
    setSelectedCaste(selectedStatus);
    setcast(selectedStatus ? selectedStatus.value : "");
  };

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
            <h1 className="me-5 ms-4 fs-2 mt-1">
              Voter Additional Information
            </h1>
          </div>
          <div className="button-container">
            <div className="d-none d-md-flex justify-content-end">
              {["add", "all permission"].some((permission) =>
                uploadedPatientPermission.includes(permission)
              ) && (
                  <savebutton
                    className="purbut me-2"
                    onClick={handleSave}
                    title="Update"
                  >
                    <FontAwesomeIcon icon={faFloppyDisk} />
                  </savebutton>
                )}
            </div>
          </div>
        </div>
      </div>
      <div className="shadow-lg p-1 bg-body-tertiary rounded-3 mb-2 mt-2">
        <div className="row ms-4 me-4 mt-3">
          {/* <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                State/மாநிலம்
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
          </div> */}
          {/* <div className="col-md-2 form-group mb-2">
            <div class="exp-form-floating">
              <label for="lname" class="exp-form-labels">
                District/மாவட்டம்
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
          </div> */}
          {/* <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="Detail" class="exp-form-labels">
                Constituency/தொகுதி
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
          </div> */}
          {/* <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Booth No/சாவடி எண்
              </label>
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
          </div> */}
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                S.No/தொடர் எண்
              <span className="text-danger">*</span></label>
              <input
                id="Gender"
                value={serialno}
                onChange={(e) => setserialno(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
          <div class="col-md-6 form-group mt-4 justify-content-end mb-3">
            <button
              className="p-2 me-3 ps-3 pe-3"
              title="Search"
              onClick={handleSearch}
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
        <div className="row ms-4 me-4 mt-3">
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Name/பெயர்
              </label>
              <input
                id="Gender"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Husband/Parent Name/கணவர்/பெற்றோர் பெயர்
              </label>
              <input
                id="Gender"
                value={husband_parent_name}
                onChange={(e) => sethusband_parent_name(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                House No/வீட்டு எண்
              </label>
              <input
                id="Gender"
                value={houseno}
                onChange={(e) => sethouseno(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Sex/பாலினம்
              </label>
              <input
                id="Gender"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Age/வயது
              </label>
              <input
                id="Gender"
                value={age}
                onChange={(e) => setage(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
                readOnly
              />
            </div>
          </div>
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Voter ID/வாக்காளர் அடையாள அட்டை
              </label>
              <input
                id="Gender"
                value={voterid}
                onChange={(e) => setvoterid(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              />
            </div>
          </div>
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="Detail" class="exp-form-labels">
                Party Info/கட்சியின் தகவல்
              </label>
              <Select
                id="Gender"
                value={selectedParty}
                onChange={handleChangeParty}
                options={filteredOptionParty}
                className="exp-input-field"
                placeholder=""
                required
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="Detail" class="exp-form-labels">
                First Time Voter/முதல் முறை வாக்காளர்
              </label>
              <Select
                id="Gender"
                value={selectedVoter}
                onChange={handleChangeVoter}
                options={filteredOptionVoter}
                className="exp-input-field"
                placeholder=""
                required
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          {/* <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Contact No/தொடர்பு எண்
              </label>
              <input
                id="Gender"
                value={contact_no}
                onChange={(e) => setcontact_no(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              />
            </div>
          </div> */}
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Caste/சாதி
              </label>
              <Select
                id="Gender"
                value={selectedCaste}
                onChange={handleChangeCaste}
                options={filteredOptionCaste}
                className="exp-input-field"
                placeholder=""
                required
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          {/* <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Interested Union Secretary/விருப்பமுள்ள ஒன்றிய செயலாளர்
              </label>
              <input
                id="Gender"
                value={Desired_Union_Secretary}
                onChange={(e) => setDesired_Union_Secretary(e.target.value)}
                className="exp-input-field form-control"
                placeholder=""
                required
              />
            </div>
          </div> */}
          <div className="col-md-6 form-group mb-2">
            <div class="exp-form-floating">
              <label for="state" class="exp-form-labels">
                Status/நிலை
              </label>
              <Select
                id="Gender"
                value={selectedStatus}
                onChange={handleChangeStatus}
                options={filteredOptionStatus}
                className="exp-input-field"
                placeholder=""
                required
                data-tip="Please select a payment type"
              />
            </div>
          </div>
          <div className="d-block d-flex d-md-none mt-2 justify-content-center">
            {["add", "all permission"].some((permission) =>
              uploadedPatientPermission.includes(permission)
            ) && (
                <button
                  className="btn btn-primary w-50 rounded"
                  onClick={handleSave}
                  title="Update"
                >
                  <FontAwesomeIcon icon={faFloppyDisk} /> Save
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;
