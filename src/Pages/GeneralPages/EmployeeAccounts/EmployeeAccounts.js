import React from "react";
import { useState, useEffect, useRef } from "react";
import './EmployeeAccounts.css'
import "react-datepicker/dist/react-datepicker.css";
import Nav from "../../../Components/Nav/Nav";
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import { Form } from 'react-bootstrap'
import { Button } from 'rsuite'
import { API_URL, get, post } from "../../../Utils/API";
import EditButton from '../../../Components/Buttons/EditButton'
import DeleteButton from '../../../Components/Buttons/DeleteButton'
import CommonButton from '../../../Components/Buttons/CommonButton'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom'
import AccountInfoHandeler from "../../../Components/AccountInfoHandeler/AccountInfoHandeler";
import Accordion from 'react-bootstrap/Accordion';
import MobileEmpCard from '../../../Components/EmpCards/MobileEmpCard';
import UserProfile from "../../../Components/UserProfile/UserProfile";
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Exporter from "../../../Components/Exporter/Exporter";
import { AG_THEME_CLASS } from "../../../Utils/AG-Grid";

export default function EmployeeAccounts({ autoLogin }) {
  const [accounts, setAccounts] = useState([])
  const gridRef = useRef();
  const [rowData, setRowData] = useState();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [adshow, setadShow] = useState(false);
  const handleadClose = () => {
    setadShow(false);
    autoLogin();
    getAccounts();
  };
  const handleadShow = () => setadShow(true);

  const [formData, setFormData] = useState({
    userID: "",
    firstName: "",
    lastName: "",
    collegeId: "",
    dob: "",
    email: "",
    userName: "",

  })
  function inputChangeHandleracc(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    // console.log(e.target.name)
  }


  const [userID, setUserID] = useState('')


  function checkMessage() {
    if (!(localStorage.getItem("message") === null)) {
      toast.success(String(localStorage.getItem("message")));
      localStorage.removeItem("message");
    }
  }


  const View_columnDefs = [
    { field: 'position', headerName: 'Position', cellStyle: { 'textAlign': 'center' } },
    { field: 'status', headerName: 'Status', cellStyle: { 'textAlign': 'center' } },
    { field: 'lastName', headerName: 'Last Name', cellStyle: { 'textAlign': 'center' } },
    { field: 'firstName', headerName: 'First Name', cellStyle: { 'textAlign': 'center' } },
    // {field: 'dob', headerName: ' DOB' ,cellStyle: { 'textAlign': 'center' }},
    // {field: 'collegeId', headerName: 'IC ID' ,cellStyle: { 'textAlign': 'center' }},
    { field: 'email', headerName: 'Email', cellStyle: { 'textAlign': 'center' } },
    {
      field: 'id',
      headerName: '',
      cellRenderer: CommonButton,
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function (field) {
          showUserProfile(field)
        },
        buttonText: "View Profile",
        variant: "outline-info",
      }
    },
  ]
  const [userAcc, setUserAcc] = useState({})

  const defaultColDef = { resizable: true }
  function showUserProfile(userID) {
    setUserAcc(userID)

    handleadShow()
  }








  const [commonColDef, setCommonColDef] = useState([]);


  async function getAccounts() {
    let response = await get(API_URL + "/getAccounts?token=" + localStorage.getItem("token") + "&org=" + thisFeaturePerms.org
      + "&email=" + empSearchData.email
      + "&firstName=" + empSearchData.firstName
      + "&lastName=" + empSearchData.lastName
      + "&ICID=" + empSearchData.ICID
      + "&status=" + empSearchData.status
    )
    if (response.status == 200) {
      response = response.accounts

      for (let x = 0; x < response.length; x++) {
        if (response[x].status === true) {
          response[x].status = "Active"
        } else {
          response[x].status = "Deactivated"
        }
      }
    }
    else {
      toast.warning(response.message)
    }
    let tempColDef = []
    if (thisFeaturePerms.access) {
      tempColDef = View_columnDefs
    }
    setCommonColDef(tempColDef)
    setRowData(response)
    setAccounts(response)
    resize()
    return response
  }
  function resize() {
    if (gridRef !== "null") {
      gridRef.current.api.sizeColumnsToFit();
    }
  }



  const [regshow, setregShow] = useState(false);
  const handlregClose = () => { setregShow(false); setregisterBool(false); };
  const handlregeShow = () => setregShow(true);
  const [registerBool, setregisterBool] = useState(false);
  const [addToOrg, setAddToOrg] = useState(false);
  const [accountFoundData, setAccountFoundData] = useState({
    firstName: "",
    lastName: "",
    collegeId: "",
    dob: "",

  })

  const [email, setEmail] = useState();
  async function register() {
    // console.log(email!= null && emailref.current.validity.valid )
    for (let x = 0; x < accounts.length; x++) {
      if (accounts[x].email == email) {
        toast.warning("Account already exists!");
        return
      }
      let response = await post(API_URL + "/checkAccount", { email: email, token: localStorage.getItem("token") });
      if (response.status == 200) {
        if (response.accountFound) {
          // add to organization
          setAccountFoundData(response.UserAcc)
          setAddToOrg(true)
          setregisterBool(true)
        } else {
          setregisterBool(true)
        }
      } else {
        toast.warning(response.message);
      }
    }

  }
  const location = useLocation()
  const { thisFeaturePerms } = location.state


  function showMobileViewEmpCards() {

    return (
      accounts.map(element => {
        return (
          <MobileEmpCard keyNum={accounts.indexOf(element)} data={element} showUserProfile={showUserProfile} permisions={thisFeaturePerms} />
        )
      }))
  }

  function searchInputHandeler(e) {
    setEmpSearchData({ ...empSearchData, [e.target.name]: e.target.value })
  }
  const [empSearchData, setEmpSearchData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    ICID: "",
    status: "",
  })
  function search() {
    console.log(empSearchData)
    getAccounts()
  }


  useEffect(() => {
    autoLogin()
    getAccounts()


    // console.log(thisFeaturePerms)

  }, [])



  return (
    <div className="incident-page">
      <ToastContainer />
      <h1>Employee Accounts</h1>
      <Form className="incident-form">
        {thisFeaturePerms.create ? <Button appearance="primary" color="cyan" onClick={() => handlregeShow()}>Add Account</Button> : null}
      </Form>
      <Modal
        show={regshow}
        onHide={handlregClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Register Account</Modal.Title>
        </Modal.Header>
        {registerBool ?
          <Modal.Body>
            <AccountInfoHandeler email={email} handlregClose={() => handlregClose()} mode={"register"} thisFeaturePerms={thisFeaturePerms} getAccounts={getAccounts} accountFoundData={accountFoundData} addToOrg={addToOrg} />
          </Modal.Body>
          :
          <>
            <Modal.Body>
              <Form>
                <Form.Label className=" d-flex justify-content-start">Email</Form.Label>
                <Form.Control type="email" placeholder="example@email.com" name="password" onChange={(e) => setEmail(e.target.value)} />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={() => register()}>Check Account</Button>
            </Modal.Footer></>
        }
      </Modal>






      {/* search */}
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="row" id="location-form">

              <div className="col" id="searchFormElement">
                <Form.Label className=" d-flex justify-content-start">Email</Form.Label>
                <Form.Control type="email" placeholder="" name="email" onChange={(e) => searchInputHandeler(e)} />
              </div>

              <div className="col" id="searchFormElement">
                <Form.Label className=" d-flex justify-content-start">First name</Form.Label>
                <Form.Control type="text" placeholder="" name="firstName" onChange={(e) => searchInputHandeler(e)} />
              </div>

              <div className="col" id="searchFormElement">
                <Form.Label className=" d-flex justify-content-start">Last name</Form.Label>
                <Form.Control type="text" placeholder="" name="lastName" onChange={(e) => searchInputHandeler(e)} />
              </div>

              <div className="col" id="searchFormElement">
                <Form.Label className=" d-flex justify-content-start">ICID</Form.Label>
                <Form.Control type="number" placeholder="" name="ICID" onChange={(e) => searchInputHandeler(e)} />
              </div>

              <div className="col" id="searchFormElement">
                <Form.Label className=" d-flex justify-content-start">Status</Form.Label>
                <Form.Select aria-label="Default select example" name="status" onChange={(e) => searchInputHandeler(e)}>
                  <option value=''></option>
                  <option value='Active'>Active</option>
                  <option value='Deactivated'>Deactivated</option>
                </Form.Select>
              </div>


              <div className="col" id="searchFormElement">
                <div className="row ">
                  <Button appearance="primary" color="blue" onClick={() => search()}>Search</Button>

                </div>
                <Exporter {...{
                  gridRef: gridRef,
                  columnHeaders: ["Position\t", "Status\t", "Last Name\t", "First Name\t", "DOB\t", "IC ID\t", "Email\t"],
                  rowData: rowData,
                  keys: ["position", "status", "lastName", "firstName", "dob", "collegeId", "email"]
                }} />
                {/* {(allTC.length > 0)? 
                                <div className="row">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-black" id="dropdown-basic">
                                            Export File
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="text-center">
                                            <Dropdown.Item onClick={()=>SaveAsCSV()}>CSV <img src="https://cdn-icons-png.flaticon.com/512/6133/6133884.png" alt="CSV" className="csv-logo"/></Dropdown.Item>
                                            <Dropdown.Item >PDF <img src="https://cdn-icons-png.flaticon.com/512/3143/3143460.png" className="pdf-logo" alt=""/></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown> 
                                </div>
                                : null} */}
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* desktop view */}
      <div className="d-none d-xxl-block" >
        <div className={AG_THEME_CLASS("incident-grid")}>
          <AgGridReact
            ref={gridRef}
            columnDefs={commonColDef}
            defaultColDef={defaultColDef}
            rowData={rowData}
          >
          </AgGridReact>
        </div>
      </div>

      {/* Mobile View */}
      <div className="d-block d-xxl-none" >
        <div className="ag-theme-alpine incident-grid">

          <Accordion defaultActiveKey="0">
            {showMobileViewEmpCards()}

          </Accordion>
        </div>
      </div>





      <Modal
        show={adshow}
        onHide={handleadClose}
        backdrop="static"
        keyboard={false}
        fullscreen={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Account Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserProfile autoLogin={autoLogin} thisFeaturePerms={thisFeaturePerms} getAccounts={getAccounts} handleadClose={handleadClose} userAcc={userAcc} />
        </Modal.Body>
      </Modal>

    </div>
  )
}