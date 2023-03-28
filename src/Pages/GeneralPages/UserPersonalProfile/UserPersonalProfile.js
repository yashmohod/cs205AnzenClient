/* eslint-disable no-undef */
import { useState , React, useEffect, useRef} from "react";
import Nav from "../../../Components/Nav/Nav";
import { Form, Button } from 'react-bootstrap';
import './UserPersonalProfile.css'
import { API_URL, post, get } from "../../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {AgGridReact} from 'ag-grid-react';


export default function UserPersonalProfile({autoLogin }) {
    const navigate = useNavigate();
    const [userDetails,setUserDetails] = useState(true);
    const [settings,setSettings] = useState(false);
    const [changePassword,setChanePassword] = useState(false);

    const [validated, setValidated] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        id:"",
        firstName: "",
        lastName: "",
        collegeId: "",
        dob: "",
        orgNpos: "",
        email: "",
    })

    const [saveBut, setSaveBut] =useState(false)

    function formValidation(e){
        setValidated(true);
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();
        // console.log(form.checkValidity() && saveBut)
        if (form.checkValidity()&& saveBut) {
            editAccountDetails()
        }   

    }

    async function editAccountDetails(){
        setSaveBut(false)
        let response = await post(API_URL + "/editAccountDetails",  {
            userID: formData.id,
            token: localStorage.getItem("token"),
            org:"",
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            dob: formData.dob,
            collegeId: formData.collegeId,
        });
        // console.log(response);

        if(response.status == 200) {
            toast.success(response.message);
            setEditMode(false);
            getAccountDetails();
            getAccounts()
        }else{
            toast.warning(response.message);
        }
  

    }

    const [oNp, setoNp] = useState([])

    function inputChangeHandler(e) {
        setFormData({...formData,  [e.target.name] : e.target.value})
    }
    
    async function getAccountDetails(){
        let response = await get(API_URL + "/getAccountDetails?token=" +  localStorage.getItem("token"))
        const temp ={
            id: response.accountDetails.id,
            firstName: response.accountDetails.firstName,
            lastName: response.accountDetails.lastName,
            collegeId: response.accountDetails.collegeId,
            dob: response.accountDetails.dob,
            email: response.accountDetails.email,
        }
        console.log(response )
        setFormData(temp)
        setoNp(response.orgNpos)
    }

    function ListGroupHandler(e){
        setUserDetails(false)
        setSettings(false)
        setChanePassword(false)
        switch(e.target.innerText){
            case "Account Details":
                setUserDetails(true)
                break
            case "Settings":
                setSettings(true)
                break
            case "Change Password":
                setChanePassword(true)
                break
            default:
                break
        }

    }



    const [passwords, setPassword] = useState({
      password:'',
      password_confirm:''
    })
    async function passwordChangeSubmit(){
      if(passwords.password === passwords.password_confirm){
        let response = await post(API_URL + "/editAccountPassword",  {userID: userAcc,password:passwords.password,token: localStorage.getItem("token")});
        if(response.status === 200){
          toast.success(response.message);
        }else{
          toast.warning(response.message);
        }
      }else{
        toast.warning("Passwords do not match!")
      }
    }

    function inputPasswordChangeHandler(e){
      setPassword({...passwords,  [e.target.name] : e.target.value})
    }



  const [showSideBar, setShowSideBar] = useState();

  const handleSideBarClose = () => setShowSideBar(false);
  const handleSideBarShow = () => setShowSideBar(true);


  function sideBarHandler(e){
    // console.log(showSideBar);
    handleSideBarShow();
    // console.log("bye");
  }


const personalProfileAccess = true;

  useEffect(() => {
    // console.log(thisFeaturePerms)
    getAccountDetails()
    autoLogin()

  },[])


    return (<>
    <ToastContainer />
    <div className="container" id="container">

        {/* sideBar */}
        {personalProfileAccess?
        <Offcanvas show={showSideBar} onHide={handleSideBarClose}>
            <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ListGroup variant="flush" style={{textAlignLast: "right"}} onClick={(e)=>ListGroupHandler(e)}>
                    <ListGroup.Item as="button" key="1" active={userDetails}>Account Details</ListGroup.Item>
                    <ListGroup.Item as="button" key="3" active={changePassword}>Change Password</ListGroup.Item>
                    <ListGroup.Item as="button" key="3" active={settings}>Settings</ListGroup.Item>
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>:null}

        <div className="row h-100 w-100 align-items-center">
            <div className="col-4 d-none d-md-block ">
                <ListGroup variant="flush" style={{textAlignLast: "right"}} onClick={(e)=>ListGroupHandler(e)}>
                    <ListGroup.Item as="button" key="1" active={userDetails}>Account Details</ListGroup.Item>
                    <ListGroup.Item as="button" key="3" active={changePassword}>Change Password</ListGroup.Item>
                    <ListGroup.Item as="button" key="3" active={settings}>Settings</ListGroup.Item>
                </ListGroup>
            </div>
        

            <div className="col-12 col-md-8">
            {personalProfileAccess?
                <div className="d-md-none" style={{
                // backgroundColor: "",
                position: "fixed",
                // height: "70px",
                // width: "70px",
                top:"90px",
                left:"40px",
                }}><Button variant="outline-dark" onClick={(e)=>{sideBarHandler(e)}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    </Button>
                </div>:null}
                
                {userDetails?<>
                    <Form className="register-form-container p-5" noValidate validated={validated} onSubmit={(e)=>formValidation(e)}>
                    
                        <div className="register-form">
                            <Form.Group className="mb-3" controlId="formBasicFirstName">
                                <Form.Label className=" d-flex justify-content-start">First Name </Form.Label>
                                <Form.Control type="text" placeholder="" name="firstName" value={formData.firstName} onChange={(e) => inputChangeHandler(e)} required readOnly={!editMode}/>
                                <Form.Control.Feedback type="invalid">
                                Please enter a vaild name!
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicLastName">
                                <Form.Label className=" d-flex justify-content-start">Last Name</Form.Label>
                                <Form.Control type="text" placeholder="" name="lastName" value={formData.lastName} onChange={(e) => inputChangeHandler(e)} required readOnly={!editMode}/>
                                <Form.Control.Feedback type="invalid">
                                Please enter a vaild name!
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFirstName">
                                <Form.Label className=" d-flex justify-content-start">College ID</Form.Label>
                                <Form.Control type="number" placeholder="" name="collegeId" value={formData.collegeId} onChange={(e) => inputChangeHandler(e)} required readOnly={!editMode}/>
                                <Form.Control.Feedback type="invalid">
                                Please enter a vaild College ID!
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFirstName">
                                <Form.Label className=" d-flex justify-content-start">Date of Birth</Form.Label>
                                <Form.Control type="date" placeholder="" name="dob"  max={new Date().toJSON().slice(0, 10)} value={formData.dob} onChange={(e) => inputChangeHandler(e)} required readOnly={!editMode}/>
                                <Form.Control.Feedback type="invalid">
                                Please enter a vaild Date of Birth!
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFirstName">
                                <Form.Label className=" d-flex justify-content-start">Email</Form.Label>
                                <Form.Control type="email" placeholder="" name="email" value={formData.email}  onChange={(e) => inputChangeHandler(e)} required readOnly={!editMode}/>
                                <Form.Control.Feedback type="invalid">
                                Please enter a vaild Email!
                            </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicFirstName">
                                <Form.Label className=" d-flex justify-content-start">Organizations and Positions</Form.Label>
                                {oNp.map((item)=>{
                                    return <Form.Label className=" d-flex justify-content-start" style={{marginLeft:"10%"}}>{item.org} : {item.pos}</Form.Label>
                                })}
                               
                            </Form.Group>
                            <div className="row justify-content-around">
                                {editMode?<>
                                <div className="col-1">
                                <Button variant="outline-success" type="submit" onClick={()=>setSaveBut(true)} >Save</Button>
                                </div>
                                <div className="col-1">
                                <Button variant="outline-danger"  onClick={()=>{getAccountDetails();setEditMode(false);}} >Cancel</Button>
                                </div></>:
                                <>
                                    <div className="col ">
                                        <Button variant="outline-success"  onClick={()=>setEditMode(true)} >Edit</Button>
                                    </div>
                                    {!personalProfileAccess?<>
                                    <div className="col">
                                        <Button variant={userAcc.status=="Active"? "outline-info": "outline-danger"}  >{userAcc.status=="Active"? userAcc.status: "Deactivate"}</Button>
                                    </div>
                                    <div className="col">
                                        <Button variant="outline-success" onClick={()=>promoteAccount()} >Promote</Button>
                                    </div>
                                    <div className="col">
                                        <Button variant="outline-danger" onClick={()=>demoteAccount()}  >Demote</Button>
                                    </div>
                                    <div className="col">
                                        <Button variant="outline-danger" onClick={()=>deleteAccount()}  >Delete</Button>
                                    </div></>
                                    :null}
                                    </>}
                            </div>            
                        </div>
                    </Form>
                </>:null}
                

                
                {changePassword?<>
                <Form className="register-form-container p-5">
                    <div className="register-form">
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                        <Form.Label className=" d-flex justify-content-start">Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" name="password" onChange={(e) =>inputPasswordChangeHandler(e)}/>
                        <Form.Label className=" d-flex justify-content-start">Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="Re-enter Password" name="password_confirm" onChange={(e) => inputPasswordChangeHandler(e)}/>
                        </Form.Group>
                        <Button variant="primary" onClick={()=>passwordChangeSubmit()}>Submit</Button>
                    </div>
                </Form>
                </>:null}
            </div>
        </div>

    </div>
    </>
    )
}