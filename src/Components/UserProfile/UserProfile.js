/* eslint-disable no-undef */
import { useState , React, useEffect, useRef} from "react";
import Nav from "../Nav/Nav";
import { Form, Button } from 'react-bootstrap';
import './UserProfile.css'
import { API_URL, post, get } from "../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Offcanvas from 'react-bootstrap/Offcanvas';
import {AgGridReact} from 'ag-grid-react';
import CheckButton from '../Buttons/CheckButton';
import Modal from 'react-bootstrap/Modal';

export default function UserProfile({thisFeaturePerms,getAccounts,handleadClose,userAcc,personalProfileAccess }) {
    const navigate = useNavigate();
    const [userDetails,setUserDetails] = useState(true);
    const [userPermissions,setUserPermissions] = useState(false);
    const [changePassword,setChanePassword] = useState(false);

    const [validated, setValidated] = useState(false);

    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        collegeId: "",
        dob: "",
        orgNpos: "",
        email: "",
    })

    const [pNdShow, setpNdShow] = useState(false);
    const handleadClose_pnd = () => setpNdShow(false);
    const handleadShow_pnd = () => setpNdShow(true);
    const [pnd,setPnd] = useState();
    const [isPromotion, setIsPromotion] = useState(false);
    async function getPromotionsNdemotions(){
        // console.log(userAcc)
        let response = await get(API_URL + "/getPromotionsNdemotions?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org+"&user_id="+userAcc)
        // console.log( response.demoteTo)
        // console.log( response.promoteTo)
        const promoteTo_titles = response.promoteTo;
        const demoteTo_titles = response.demoteTo;
        let promote_positions =[]
        let demote_positions =[]
        for(let i=0; i<promoteTo_titles.length; i++){
            if(!promote_positions.includes(promoteTo_titles[i].PosName)){
                promote_positions.push(promoteTo_titles[i].PosName);
            }
        }
        for(let i=0; i<demoteTo_titles.length; i++){
            if(!demote_positions.includes(demoteTo_titles[i].PosName)){
                demote_positions.push(demoteTo_titles[i].PosName);
            }
        }
        const temp = {
            "promoteTo_titles":promoteTo_titles,
            "demoteTo_titles":demoteTo_titles,
            "promote_positions":promote_positions,
            "demote_positions":demote_positions,
        }
        console.log(temp)
        setPnd(temp)
    }

    async function deleteAccount() {
        commonApiRequest("/deleteAccount",userAcc,true)
      }
      async function promoteAccount() {
        setIsPromotion(true)
        handleadShow_pnd()
        // commonApiRequest("/promoteAccount",userAcc,false)
      }
      async function demoteAccount() {
        setIsPromotion(false)
        handleadShow_pnd()
        // commonApiRequest("/demoteAccount",userAcc,false)
      }
      async function promotionNdemotionRequest(posName, posTitle, isPromo){
        let response = await post(API_URL + "/promoteNdemote", {
            userID: userAcc,
            token: localStorage.getItem("token"),
            org:thisFeaturePerms.org,
            PosName:posName,
            title:posTitle,
            isPomotion:isPromo,
        });
        // console.log(response)
        if(response.status ==200){
            toast.success(response.message);
        }
        handleadClose_pnd();
        getAccountDetails();
        getUserAccPermissions();
        getPromotionsNdemotions();
      }

   
  
      async function commonApiRequest(endpoint,accountId,exit){
        let response = await post(API_URL + endpoint,  {userID: accountId,token: localStorage.getItem("token"),org:thisFeaturePerms.org});
        console.log(response.status)
        if(response.status === 200){
          toast.success(response.message);
        }else{
          toast.warning(response.message);
        }
        getAccounts();
        getAccountDetails();
        if(exit){
            handleadClose()
        }
      }
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
            userID: userAcc,
            token: localStorage.getItem("token"),
            org:thisFeaturePerms.org,
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
        let response = await get(API_URL + "/getAccounts?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org
        +"&accID="+userAcc)
        const temp ={
            firstName: response.accountDetails.firstName,
            lastName: response.accountDetails.lastName,
            collegeId: response.accountDetails.collegeId,
            dob: response.accountDetails.dob,
            email: response.accountDetails.email,
        }
        // console.log(response)
        setFormData(temp)
        setoNp(response.orgNpos)
    }

    function ListGroupHandler(e){
        setUserDetails(false)
        setUserPermissions(false)
        setChanePassword(false)
        switch(e.target.innerText){
            case "Account Details":
                setUserDetails(true)
                break
            case "Permisions":
                setUserPermissions(true)
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

  const[userAccPermissions, setUserAccPermissions]=useState([])
  const defaultColDef= { resizable: true}
  const gridRef= useRef()

  const columnDefs = [
    {field: 'featureName', headerName: 'Feature' ,cellStyle: { 'textAlign': 'center' }},
    {field: 'view',
    headerName: '' ,
    cellRenderer: CheckButton, 
    headerName: 'View',
    cellStyle: { 'textAlign': 'center' },
    cellRendererParams: {
      clicked: function(field) {
      },
      editPermissions:editPermissions,
      org:thisFeaturePerms.org,
      permissionFunction:true,
    }},
    {field: 'create',
    headerName: '' ,
    cellRenderer: CheckButton, 
    headerName: 'Create',
    cellStyle: { 'textAlign': 'center' },
    cellRendererParams: {
      clicked: function(field) {
      },
      editPermissions:editPermissions,
      org:thisFeaturePerms.org,
      permissionFunction:true,
    }},
    {field: 'edit',
    headerName: '' ,
    cellRenderer: CheckButton, 
    headerName: 'Edit',
    cellStyle: { 'textAlign': 'center' },
    cellRendererParams: {
      clicked: function(field) {
      },
      editPermissions:editPermissions,
      org:thisFeaturePerms.org,
      permissionFunction:true,
    }},
    {field: 'delete',
    headerName: '' ,
    cellRenderer: CheckButton, 
    headerName: 'Delete',
    cellStyle: { 'textAlign': 'center' },
    cellRendererParams: {
      clicked: function(field) {
      },
      editPermissions:editPermissions,
      org:thisFeaturePerms.org,
      permissionFunction:true,
    }},
    {field: 'blackListed',
    headerName: '' ,
    cellRenderer: CheckButton, 
    headerName: 'Black List',
    cellStyle: { 'textAlign': 'center' },
    cellRendererParams: {
      clicked: function(field) {
      },
      editPermissions:editPermissions,
      org:thisFeaturePerms.org,
      permissionFunction: true,
    }},
    ]
    async function changeStatus(){
        let response = await post(API_URL + "/changeAccountStatus",  {token: localStorage.getItem("token"), org:thisFeaturePerms.org,userID :userAcc});
        if(response.status ==200){
            toast.success(response.message);
        }else{
            toast.warning(response.message);
        }
        getUserAccPermissions()
        getAccounts()
    }
    const[statusAccount,setstatusAccount] = useState(false)
  async function getUserAccPermissions(){
    let permisions_response = await get(API_URL + "/getFeaturePermissions?token=" +  localStorage.getItem("token")+"&userId=" + userAcc);
    const perms = permisions_response.featurePermissions
    let curOrgPerms = []
    for(let x = 0; x<perms.length; x++){
        if(perms[x].featureName == "Status"){
            setstatusAccount(perms[x].blackListed);
        }
        if(perms[x].org == thisFeaturePerms.org && perms[x].permissionManagement ){
            curOrgPerms.push(perms[x])
        }
    }
    // console.log(curOrgPerms)
    setUserAccPermissions(curOrgPerms)

  }
  async function editPermissions(prop,e,org){
    // console.log(data)
    // console.log(e.target.checked)
    const value = e
    const permissionName = prop.colDef.field
    const featureName = prop.data.featureName
    // console.log(org)
    // console.log(permissionName)
    // console.log(featureName)
    let response = await post(API_URL + "/updatePermission",  {
        token: localStorage.getItem("token"),
        permId: prop.data.id,
        userID: userAcc,
        featureName:featureName,
        permissionName:permissionName,
        value:value,
        org:org,
        isPositionPermission:false,
    });
    if(response.status ==200){
        toast.success(response.message);
    }else{
        toast.warning(response.message);
    }

    getUserAccPermissions()
  }



  useEffect(() => {
    // console.log(thisFeaturePerms)
    getAccountDetails();
    getUserAccPermissions();
    getPromotionsNdemotions();
  },[])


    return (
    <div className="container h-100 w-100">
        <ToastContainer />
        {/* sideBar */}
        {personalProfileAccess?
        <Offcanvas show={showSideBar} onHide={handleSideBarClose}>
            <Offcanvas.Header closeButton>
            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ListGroup variant="flush" style={{textAlignLast: "right"}} onClick={(e)=>ListGroupHandler(e)}>
                    <ListGroup.Item as="button" key="1" active={userDetails}>Account Details</ListGroup.Item>
                    {!personalProfileAccess?<>
                    <ListGroup.Item as="button" key="2" active={userPermissions} onClick={()=>getUserAccPermissions()}>Permisions</ListGroup.Item>
                    <ListGroup.Item as="button" key="3" active={changePassword}>Change Password</ListGroup.Item>
                    </>:null}
                </ListGroup>
            </Offcanvas.Body>
        </Offcanvas>:null}

        <div className="row h-100 w-100 align-items-center">
            <div className="col-4 d-none d-md-block ">
                <ListGroup variant="flush" style={{textAlignLast: "right"}} onClick={(e)=>ListGroupHandler(e)}>
                    <ListGroup.Item as="button" key="1" active={userDetails}>Account Details</ListGroup.Item>
                    {!personalProfileAccess?<>
                    <ListGroup.Item as="button" key="2" active={userPermissions} onClick={()=>getUserAccPermissions()}>Permisions</ListGroup.Item>
                    <ListGroup.Item as="button" key="3" active={changePassword}>Change Password</ListGroup.Item>
                    </>:null}
                </ListGroup>
            </div>
            {!personalProfileAccess?
            <div className="d-md-none" style={{
                // position: 'absolute',
                // top:"0px",
                // left:"0px",
            }}>
                <ListGroup style={{textAlignLast: "right"}} onClick={(e)=>ListGroupHandler(e)} horizontal>
                    <ListGroup.Item as="button" key="1" active={userDetails}>Account Details</ListGroup.Item>
                    {!personalProfileAccess?<>
                    <ListGroup.Item as="button" key="2" active={userPermissions} onClick={()=>getUserAccPermissions()}>Permisions</ListGroup.Item>
                    <ListGroup.Item as="button" key="3" active={changePassword}>Change Password</ListGroup.Item>
                    </>:null}
                </ListGroup>
            </div>:null}

        

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
                                    let pos = item.pos
                                    let title = item.title
                                    console.log(item)
                                    if(pos == title){
                                        return <Form.Label className=" d-flex justify-content-start" style={{marginLeft:"10%"}}>{item.org} : {pos}</Form.Label>
                                    }else{
                                        return <Form.Label className=" d-flex justify-content-start" style={{marginLeft:"10%"}}>{item.org} : {pos+","+title}</Form.Label>
                                    }
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
                                        <Button variant={statusAccount? "outline-success": "outline-danger"} onClick={()=>changeStatus()} >{statusAccount? "Activate": "Deactivate"}</Button>
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
                
                {userPermissions?<>

                {/* <div className="d-none d-xl-block" > */}
                <div>
                    <div className="ag-theme-alpine incident-grid">
                        <AgGridReact
                        ref={gridRef}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowData={userAccPermissions}
                        >
                        </AgGridReact>
                    </div>  
                </div>
                
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
{/* 
        "promoteTo_titles":promoteTo_titles,
            "demoteTo_titles":demoteTo_titles,
            "promote_positions":promote_positions,
            "demote_positions":demote_positions, */}


        <Modal
            show={pNdShow}
            onHide={handleadClose_pnd}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>{isPromotion? "Promote To":"Demote To"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {(pnd!= undefined)?
                    <div>
                    {isPromotion? 
                        <>
                            {pnd.promoteTo_titles.length > 0 ? 
                            <>
                                {
                                    pnd.promote_positions.map((position)=>{
                                        return(<div  style={{paddingTop:"5%"}}>
                                            <h2>{position}</h2>
                                            <div className="col" style={{borderTop:"1px solid rgba(100,100,100,0.4)", paddingTop:"5px"}} >
                                                {pnd.promoteTo_titles.map((title)=>{
                                                    if(title.PosName == position){
                                                        return(<Button onClick={()=>promotionNdemotionRequest(title.PosName,title.title,isPromotion)} style={{padding:"5px",width:"50%"}} variant="outline-success">{title.title}</Button>)
                                                    }
                                                })}     
                                            </div>
                                        </div>)
                                    })
                                }
                            </>
                        :
                        <>
                            <h4>No position found to promote!</h4> 
                        </>
                        }
                        </>
                    :
                        <>
                            {pnd.demoteTo_titles.length > 0 ? 
                                <>
                                    {
                                        pnd.demote_positions.map((position)=>{
                                            return(<div style={{paddingTop:"5%"}}>
                                                <h2>{position}</h2>
                                                <div className="col" style={{borderTop:"1px solid rgba(100,100,100,0.4)", paddingTop:"5px"}}>
                                                    {pnd.demoteTo_titles.map((title)=>{
                                                        if(title.PosName == position){
                                                            return(<Button onClick={()=>promotionNdemotionRequest(title.PosName,title.title,isPromotion)} style={{padding:"5px",width:"50%"}} variant="outline-danger">{title.title}</Button>)
                                                        }
                                                    })}     
                                                </div>
                                            </div>)
                                        })
                                    }
                                </>
                            :
                                <>
                                    <h4>No position found to demote!</h4>
                                </>
                            }
                        </>
                    }
                    </div>
                :
                    <>
                    <h4>Positions Not loaded yet!</h4>
                    <h4>Try refreshing!</h4> 
                    </>
                }
                
            </Modal.Body>
        </Modal>
</div>
    )
}