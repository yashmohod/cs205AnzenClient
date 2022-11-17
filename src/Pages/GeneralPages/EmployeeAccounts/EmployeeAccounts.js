import React from "react";
import { useState, useEffect, useRef } from "react";
import './EmployeeAccounts.css'
import "react-datepicker/dist/react-datepicker.css";
import Nav from "../../../Components/Nav/Nav";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import {Form, Button} from 'react-bootstrap'
import { API_URL, get, post } from "../../../Utils/API";
import EditButton from '../../../Components/Buttons/EditButton'
import DeleteButton from '../../../Components/Buttons/DeleteButton'
import CommonButton from '../../../Components/Buttons/CommonButton'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function EmployeeAccounts({setLoggedIn, loggedInUser, autoLogin}) {
    const [accounts, setAccounts] = useState("")
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState();
    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [editshow, seteditShow] = useState(false);
    const handleditClose = () => seteditShow(false);
    const handlediteShow = () => seteditShow(true);

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
    setFormData({...formData,  [e.target.name] : e.target.value})
    // console.log(e.target.name)
}
async function registerHandler() {

  let response = await post(API_URL + "/editAccountDetails", {
    token: localStorage.getItem("token"),
    userID: formData.userID,
    email: formData.email,
    userName: formData.userName,
    firstName: formData.firstName,
    lastName: formData.lastName,
    collegeId: formData.collegeId,
    dob: formData.dob,
    })
  if(response.status === 200){
    toast.success(response.message)
    getAccounts()
    handleditClose()
  }else{
    toast.warning(response.message)
  }

}

    const [userID, setUserID] = useState('')
    const [passwords, setPassword] = useState({
      password:'',
      password_confirm:''
    })
    async function passwordChangeSubmit(){
      if(passwords.password === passwords.password_confirm){
        let response = await post(API_URL + "/editAccountPassword",  {userID: userID,password:passwords.password,token: localStorage.getItem("token")});
        if(response.status === 200){
          toast.success(response.message);
          handleClose()
        }else{
          toast.warning(response.message);
        }
      }else{
        toast.warning("Passwords do not match!")
      }
    }

    function inputChangeHandler(e){
      setPassword({...passwords,  [e.target.name] : e.target.value})
    }

    function checkMessage(){
      if(!(localStorage.getItem("message") === null)){
          toast.success(String(localStorage.getItem("message")));
          localStorage.removeItem("message");
      }
  }


    const columnDefs = [
        {field: 'position', headerName: 'Position' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'status', headerName: 'Status' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'lastName', headerName: 'Last Name' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'firstName', headerName: 'First Name' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'dob', headerName: ' DOB' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'collegeId', headerName: 'IC ID' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'email', headerName: 'Email' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'id', 
        headerName: '' ,
        cellRenderer: EditButton,
        cellStyle: { 'textAlign': 'center' }, 
        cellRendererParams: {
          clicked: function(field) {
            editAccount(field);
          }
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: DeleteButton, 
        cellStyle: { 'textAlign': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            deleteAccount(field)
          }
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: CommonButton, 
        cellStyle: { 'textAlign': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            promoteAccount(field)
          },
          buttonText: "Promote",
          variant:"outline-success",
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: CommonButton, 
        cellStyle: { 'textAlign': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            demoteAccount(field)
          },
          buttonText: "Demote",
          variant:"outline-danger",
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: CommonButton, 
        cellStyle: { 'textAlign': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            changeAccountStatue(field)
          },
          buttonText: "Change Status",
          variant:"outline-info",

        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: CommonButton, 
        cellStyle: { 'textAlign': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            setUserID(field)
            handleShow()
          },
          buttonText: "Change Password",
          variant:"outline-dark",
        }},
        ]
        const defaultColDef= { resizable: true}


    async function editAccount(accountId) {
      let curAccount = {}
      accounts.map((acc)=>{
        if (accountId == acc.id){
          curAccount= acc
        }
      })

      // console.log(curAccount)
      const oldData = {
        userID:accountId,
        firstName: curAccount.firstName,
        lastName: curAccount.lastName,
        collegeId: curAccount.collegeId,
        dob: curAccount.dob,
        email: curAccount.email,
        userName: curAccount.userName,
  
    }
    setFormData(oldData)
      
      handlediteShow(true)

    }
    async function deleteAccount(accountId) {
      commonApiRequest("/deleteAccount",accountId)
    }
    async function promoteAccount(accountId) {
      commonApiRequest("/promoteAccount",accountId)
    }
    async function demoteAccount(accountId) {
      commonApiRequest("/demoteAccount",accountId)
    }
    async function changeAccountStatue(accountId) {
      commonApiRequest("/changeAccountStatus",accountId)
    }
 

    async function commonApiRequest(endpoint,accountId){
      let response = await post(API_URL + endpoint,  {userID: accountId,token: localStorage.getItem("token")});

      if(response.status === 200){
        toast.success(response.message);
      }else{
        toast.warning(response.message);
      }
      getAccounts()
    }


  

  

    async function getAccounts() {
        let response = await get(API_URL + "/getAllAccounts?token=" +  localStorage.getItem("token"))
        if(response.status==200){
          response = response.accounts
        
        for(let x =0; x< response.length; x++){
          if(response[x].status === true){
            response[x].status = "Active"
          }else{
            response[x].status = "Deactive"
          }
        }
        }
        else{
          toast.warning(response.message)
        }


        setRowData(response)
        setAccounts(response)
        gridRef.current.api.sizeColumnsToFit();
        return response
    }


    // const [dimensions, setDimensions] = React.useState({ 
    //   height: window.innerHeight,
    //   width: window.innerWidth
    // })
    
    // function handleResize() {
    //   setDimensions({
    //     height: window.innerHeight,
    //     width: window.innerWidth
    //   })
    //   if(window.innerHeight !== dimensions.height || window.innerWidth !== dimensions.width){
    //     gridRef.current.api.sizeColumnsToFit();
    //   }
    // }

    useEffect(() => {
        autoLogin()
        getAccounts()
        checkMessage()
        
    }, [])


    // window.addEventListener('resize', handleResize)

    return (
        <div className="incident-page">
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
             <ToastContainer />
            <h1>Employee Accounts</h1>
            <Form className="incident-form">
                <Button variant="outline-dark" onClick={() => navigate("/register-accounts")}>Add Account</Button>
                {/* <Button variant="primary" onClick={handleShow}>
                  Launch static backdrop modal
                </Button> */}
            </Form>


            <div className="ag-theme-alpine incident-grid">
        
              <AgGridReact
                ref={gridRef}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowData={rowData}
                >
              </AgGridReact>


			      </div>



            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>New Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                <Form.Label className=" d-flex justify-content-start">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" name="password" onChange={(e) => inputChangeHandler(e)}/>
                <Form.Label className=" d-flex justify-content-start">Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Re-enter Password" name="password_confirm" onChange={(e) => inputChangeHandler(e)}/>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={()=>passwordChangeSubmit()}>Submit</Button>
              </Modal.Footer>
            </Modal>


            <Modal
              show={editshow}
              onHide={handleditClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Account Details</Modal.Title>
              </Modal.Header>
              <Modal.Body>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className=" d-flex justify-content-start">First Name</Form.Label>
              <Form.Control type="text" placeholder="" value={formData.firstName}  name="firstName" onChange={(e) => inputChangeHandleracc(e)} />

              <Form.Label className=" d-flex justify-content-start">Last Name</Form.Label>
              <Form.Control type="text" placeholder="" value={formData.lastName}  name="lastName" onChange={(e) => inputChangeHandleracc(e)}/>

              <Form.Label className=" d-flex justify-content-start">Student ID</Form.Label>
              <Form.Control type="text" placeholder="" value={formData.collegeId}  name="collegeId" onChange={(e) => inputChangeHandleracc(e)}/>

              <Form.Label className=" d-flex justify-content-start">Date of Birth </Form.Label>
              <Form.Control type="date" placeholder="" value={formData.dob}   name="dob" onChange={(e) => inputChangeHandleracc(e)}/>

              <Form.Label className=" d-flex justify-content-start">Email address</Form.Label>
              <Form.Control type="text" placeholder="" value={formData.email}   name="email" onChange={(e) => inputChangeHandleracc(e)}/>
                        
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className=" d-flex justify-content-start">Username</Form.Label>
              <Form.Control type="text" placeholder="Enter Username" value={formData.userName}   name="userName" onChange={(e) => inputChangeHandleracc(e)}/>
            </Form.Group>

              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={()=>registerHandler()}>Submit</Button>
              </Modal.Footer>
            </Modal>

        </div>
    )
}