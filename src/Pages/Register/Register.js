/* eslint-disable no-undef */
import { useState , React, useEffect} from "react";
import Nav from "../../Components/Nav/Nav";
import { Form, Button } from 'react-bootstrap';
import './Register.css'
import { API_URL, post } from "../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


export default function Register({setLoggedIn, loggedInUser, autoLogin}) {
  const navigate = useNavigate();
  const [SASPshowPos, setSASPshowPos] = useState(false)
  const [RESLIFEshowPos, setRESLIFEshowPos] = useState(false)
  const SasporgsNpos = [
    {pos:"Probationary Member"},
    {pos:"Junior Member"},
    {pos:"Senior Member"},
    {pos:"Executive Board Member"},
  ]
  const RESLIFEorgsNpos = [
    {pos:"RA"},
    {pos:"Senior RA"},

  ]
  const [formData, setFormData] = useState({
      firstName: "",
      lastName: "",
      collegeId: "",
      dob: "",
      organization: "",
      position: "",
      email: "",
      userName: "",
      userName_confirm: "",
      password: "",
      password_confirm: "",
  })

  function changePosition(e) {
    setFormData({...formData, position : e.target.value})
  }

  useEffect(() => 
  {
    setpos()
    console.log("Form Position")
    console.log(formData.position)
   
  }
, [formData])

  const SASPPosButton = (props) => {

    return (
      <div>
        {SasporgsNpos.map((item) => {
        return (
          <Form.Check inline label={item.pos} value ={item.pos} name="position" type={"radio"} id={item.pos} checked={props.formData.position == item.pos} onChange={(e) => props.changePosition(e)}/>
                )})
        }
    </div>

    )
  
  //   SasporgsNpos.map((item) => {
  //     return (
  //       <Form.Check inline label={item.pos} value ={item.pos} name="position" type={"radio"} id={item.pos} onChange={(e) => inputChangeHandler(e)}/>

  // )})
}
  const RESLIFEPosButton = (props) => {
    return (
      <div>
      {
        RESLIFEorgsNpos.map((item) => {
        return (
            <Form.Check inline label={item.pos} value ={item.pos} name="position" type={"radio"} id={item.pos} checked={props.formData.position == item.pos} onChange={(e) => props.changePosition(e)}/>
      )})
      }
      </div>
    )
 
}

  //Working
  function inputposHandler(e){
    formData[e.target.name] = e.target.value
    console.log(e.target.name)
    console.log(e.target.value)

  }
    async function registerHandler() {

      let response = await post(API_URL + "/register", {
        token: localStorage.getItem("token"),
        email: formData.email,
        userName: formData.userName,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        collegeId: formData.collegeId,
        dob: formData.dob,
        organization:localStorage.getItem("organization"),
        position: formData.position,
        })
      console.log(response)
      if(response.message === "registered successfully"){
        localStorage.setItem("message", response.message);
        navigate("/");
      }
  
        
    }

    function validateFormData() {
      

    }
    
    function inputChangeHandler(e) {
        setFormData({...formData,  [e.target.name] : e.target.value})
        console.log(e.target.name)
    }
    function setpos(){
      const org = localStorage.getItem("organization")
      
      if(org === "SASP"){
        setSASPshowPos(true)
        setRESLIFEshowPos(false)
      }
      if(org === "RESLIFE"){
        setSASPshowPos(false)
        setRESLIFEshowPos(true)
      }

    }



    return (
    <div>
        <ToastContainer />
        <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
        <h1>Register Account</h1>
        <div className="container-fluid">
            <div className="row">
                <div className="col-0 col-md-2"></div>
                <div className="col-12 col-md-8">
                   
                           <Form className="register-form-container p-5">
                           <div className="register-form">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className=" d-flex justify-content-start">First Name</Form.Label>
              <Form.Control type="text" placeholder="" name="firstName" onChange={(e) => inputChangeHandler(e)} />

              <Form.Label className=" d-flex justify-content-start">Last Name</Form.Label>
              <Form.Control type="text" placeholder="" name="lastName" onChange={(e) => inputChangeHandler(e)}/>

              <Form.Label className=" d-flex justify-content-start">Student ID</Form.Label>
              <Form.Control type="text" placeholder="" name="collegeId" onChange={(e) => inputChangeHandler(e)}/>

              <Form.Label className=" d-flex justify-content-start">Date of Birth </Form.Label>
              <Form.Control type="date" placeholder="" name="dob" onChange={(e) => inputChangeHandler(e)}/>

              <Form.Label className=" d-flex justify-content-start">Email address</Form.Label>
              <Form.Control type="text" placeholder="" name="email" onChange={(e) => inputChangeHandler(e)}/>

            </Form.Group>

            {/* <Form.Group>
              <Form.Label className=" d-flex justify-content-start">Organization</Form.Label>
              <Form.Check inline label="SASP" value ="SASP" name="organization" type={"radio"} id="SASP" onChange={(e) => inputChangeHandler(e)}/>
            <Form.Check inline label="ResLife" value ="RESLIFE" name="organization" type={"radio"} id="RESLIFE" onChange={(e) => inputChangeHandler(e)}/>

            <Button variant="primary" type="button" onClick={() => clearOrgPos()}>Clear</Button>
            </Form.Group> */}

            <Form.Group>
              
            <Form.Label className=" d-flex justify-content-start">Position</Form.Label>
            { SASPshowPos ? <SASPPosButton changePosition = {changePosition} formData={formData}/> : null }
            { RESLIFEshowPos ? <RESLIFEPosButton  changePosition = {changePosition} formData={formData}/> : null }
        
              
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className=" d-flex justify-content-start">Username</Form.Label>
              <Form.Control type="text" placeholder="Enter Username" name="userName" onChange={(e) => inputChangeHandler(e)}/>
              <Form.Label className=" d-flex justify-content-start">Confirm Username</Form.Label>
              <Form.Control type="text" placeholder="Re-enter Username" name="userName_confirm" onChange={(e) => inputChangeHandler(e)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className=" d-flex justify-content-start">Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" onChange={(e) => inputChangeHandler(e)}/>
              <Form.Label className=" d-flex justify-content-start">Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Re-enter Password" name="password_confirm" onChange={(e) => inputChangeHandler(e)}/>
            </Form.Group>
   
            <Button variant="primary" type="button" onClick={() => registerHandler()}>Register</Button>
            
            </div>
        </Form>



                </div>
                <div className="col-0 col-md-2"></div>
            </div>
        </div>
        
     
    </div>
    )
}