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
import { useLocation } from 'react-router-dom'
import Register from "../Register/Register";
import Accordion from 'react-bootstrap/Accordion';
import MobileEmpCard from '../../../Components/EmpCards/MobileEmpCard';
// import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


export default function EmployeeAccounts({setLoggedIn, loggedInUser, autoLogin}) {
    const [accounts, setAccounts] = useState([])
    const gridRef = useRef();
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


    const View_columnDefs = [
        {field: 'position', headerName: 'Position' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'status', headerName: 'Status' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'lastName', headerName: 'Last Name' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'firstName', headerName: 'First Name' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'dob', headerName: ' DOB' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'collegeId', headerName: 'IC ID' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'email', headerName: 'Email' ,cellStyle: { 'textAlign': 'center' }},
        ]
        
        const Edit_columnDefs = [
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
            changePassword(field)

          },
          buttonText: "Change Password",
          variant:"outline-dark",
        }},
        ]

        const Delete_columnDefs = [
          {field: 'id',
        headerName: '' ,
        cellRenderer: DeleteButton, 
        cellStyle: { 'textAlign': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            deleteAccount(field)
          }
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
    function changePassword(accountId){
      setUserID(accountId)
      handleShow()
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


  
    const [commonColDef, setCommonColDef] = useState([]);


    async function getAccounts() {
        let response = await get(API_URL + "/getAllAccounts?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org)
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
        let tempColDef = []
        if(thisFeaturePerms.access){
          tempColDef=View_columnDefs
        }
        if(thisFeaturePerms.edit){
          let temp = tempColDef.concat(Edit_columnDefs)
          tempColDef = temp
        }
        if(thisFeaturePerms.delete){
          let temp = tempColDef.concat(Delete_columnDefs)
          tempColDef = temp
        }
        setCommonColDef(tempColDef)
        console.log(response)
        setRowData(response)
        setAccounts(response)
        
        resize()
        return response
    }
    function resize(){
      if (gridRef !== "null"){
        gridRef.current.columnApi.autoSizeAllColumns();
    }}



    const [regshow, setregShow] = useState(false);
    const handlregClose = () => {setregShow(false);setregisterBool(false);};
    const handlregeShow = () => setregShow(true);
    const[registerBool,setregisterBool] = useState(false);

    const [email,setEmail]= useState();
    async function register(){
      // console.log(email!= null && emailref.current.validity.valid )
      for(let x =0; x< accounts.length;x++){
        if(accounts[x].email == email){
          toast.warning("Account already exists!");
          return
        }
        let response = await post(API_URL + "/checkAccount",  {email: email,token: localStorage.getItem("token")});
        if(response.status == 200){
          if(response.accountFound){
            // add to organization
            if(false){
              toast.success("Account found in database. Added to Org");
            }
          }else{
            setregisterBool(true)
          }
        }else{
          toast.warning(response.message);
        }
      }
      
    }
    const location = useLocation()
    const { thisFeaturePerms } = location.state


    function myTCshowMobileViewTimeCards(){
  
      return(
        accounts.map(element => {
        return(
        <MobileEmpCard keyNum ={accounts.indexOf(element)}  data={element} editAccount={editAccount} deleteAccount={deleteAccount} promoteAccount={promoteAccount} demoteAccount={demoteAccount} changeAccountStatue={changeAccountStatue} changePassword={changePassword} permisions={thisFeaturePerms} />
       ) }))
    }


    useEffect(() => {
        autoLogin()
        getAccounts()
        checkMessage()

        console.log(thisFeaturePerms)
        
    }, [gridRef.current])

    

    return (
        <div className="incident-page">
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
             <ToastContainer />
            <h1>Employee Accounts</h1>
            <Form className="incident-form">
              {thisFeaturePerms.create?<Button variant="outline-dark" onClick={() => handlregeShow()}>Add Account</Button>:null}
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
              {registerBool?
              <Modal.Body>
              <Register email = {email} handlregClose= {()=>handlregClose()}/>
              </Modal.Body>
              :
              <>
              <Modal.Body>
                <Form>
                <Form.Label className=" d-flex justify-content-start">Email</Form.Label>
                <Form.Control type="email" placeholder="example@email.com" name="password" onChange={(e) => setEmail(e.target.value)}/>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={()=>register()}>Check Account</Button>
              </Modal.Footer></>
              }
            </Modal>

                {/* desktop view */}
                <div className="d-none d-xxl-block" >
                  <div className="ag-theme-alpine incident-grid">
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
                  {myTCshowMobileViewTimeCards()}

                </Accordion>
                </div>
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