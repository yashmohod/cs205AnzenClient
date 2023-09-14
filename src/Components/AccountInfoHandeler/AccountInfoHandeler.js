/* eslint-disable no-undef */
import { useState , React, useEffect, useRef} from "react";
import Nav from "../Nav/Nav";
import { Form, Button } from 'react-bootstrap';
import './AccountInfoHandeler.css'
import { API_URL, post, get } from "../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import InputGroup from 'react-bootstrap/InputGroup';
import { position } from "@chakra-ui/react";

export default function AccountInfoHandeler({email,handlregClose, mode,thisFeaturePerms,getAccounts,accountFoundData,addToOrg}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      firstName: accountFoundData.firstName,
      lastName: accountFoundData.lastName,
      collegeId: accountFoundData.collegeId,
      dob: accountFoundData.dob,
      orgNpos: "",
      email: email,
      // password: "",
      // password_confirm: "",
  })
  const dateRef = useRef()

  useEffect(() => 
  {
    setpos()
    // setFormData({...formData, "email" : email})
  },[]
)

    async function registerHandler() {
      let response = await post(API_URL + "/register", {
        token: localStorage.getItem("token"),
        email: formData.email,
        // password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        collegeId: formData.collegeId,
        dob: formData.dob,
        orgNpos: formData.orgNpos,
        addToOrg:addToOrg
        })
  
      if(response.status == 200){
        toast.success(response.message)
        getAccounts();
        handlregClose();
      }else{
        toast.warning(response.message)
      }
      // console.log(formData)
        
    }

    const [validated, setValidated] = useState(false);

    function formValidation(e){
      setValidated(true);
      const form = e.currentTarget;
      e.preventDefault();
      e.stopPropagation();
      // if(formData.password == formData.password_confirm){
        if (form.checkValidity()) {
          registerHandler()
        }
      // }else{
      //   toast.warn("Passwords do not match!")
      // }

  
    }
    
    function inputChangeHandler(e) {
        setFormData({...formData,  [e.target.name] : e.target.value})
    }
    async function setpos(){
      let response = await get(API_URL + "/getPositions?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org)
      // setPos(response.positions)
      const position_titles = response.positions;
      console.log(response)

      let positions =[]

      for(let i=0; i<position_titles.length; i++){
          if(!positions.includes(position_titles[i].PosName)){
            positions.push(position_titles[i].PosName);
          }
      }
      // console.log(response.positions)
      const temp = {
          "position_titles":position_titles,
          "positions":positions,

      }
      console.log(temp)
      setPos(temp)
    }
    const [pos, setPos] = useState();




    return (
    <div>
        <ToastContainer />

                   
            <Form className="register-form-container p-5" noValidate validated={validated} onSubmit={(e)=>formValidation(e)}>
              
            <div className="register-form">
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label className=" d-flex justify-content-start">First Name</Form.Label>
              <Form.Control type="text" placeholder="" name="firstName" defaultValue={accountFoundData.firstName} onChange={(e) => inputChangeHandler(e)} required/>
              <Form.Control.Feedback type="invalid">
              Please enter a vaild name!
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicLastName">
              <Form.Label className=" d-flex justify-content-start">Last Name</Form.Label>
              <Form.Control type="text" placeholder="" name="lastName" defaultValue={accountFoundData.lastName} onChange={(e) => inputChangeHandler(e)} required/>
              <Form.Control.Feedback type="invalid">
              Please enter a vaild name!
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label className=" d-flex justify-content-start">College ID</Form.Label>
              <Form.Control type="number" placeholder="" name="collegeId" defaultValue={accountFoundData.collegeId} onChange={(e) => inputChangeHandler(e)} required/>
              <Form.Control.Feedback type="invalid">
              Please enter a vaild College ID!
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label className=" d-flex justify-content-start">Date of Birth</Form.Label>
              <Form.Control type="date" placeholder="" name="dob" ref={dateRef} max={new Date().toJSON().slice(0, 10)} defaultValue={accountFoundData.dob} onChange={(e) => inputChangeHandler(e)} required/>
              <Form.Control.Feedback type="invalid">
              Please enter a vaild Date of Birth!
            </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicFirstName">
              <Form.Label className=" d-flex justify-content-start">Email</Form.Label>
              <Form.Control type="email" placeholder="" name="email" defaultValue={email} onChange={(e) => inputChangeHandler(e)} required/>
              <Form.Control.Feedback type="invalid">
              Please enter a vaild Email!
            </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="formBasicLastName" required>              
            <Form.Label className=" d-flex justify-content-start">Position</Form.Label>
            {/* {pos.map((item) => {
              return (
                <Form.Check required inline label={item.PosName} value ={item.id} name="orgNpos" type={"radio"} id={item.id} onChange={(e) => inputChangeHandler(e)}/>
                      )})
              } */}

              {pos!=undefined?
                <>
                  {pos.position_titles.length > 0 ? 
                            <>
                                {
                                    pos.positions.map((position)=>{
                                        return(<div  style={{paddingTop:"5%"}}>
                                            <h2>{position}</h2>
                                            <div className="col" style={{borderTop:"1px solid rgba(100,100,100,0.4)", paddingTop:"5px"}} >
                                                {pos.position_titles.map((title)=>{
                                                    if(title.PosName == position){
                                                        return(<Form.Check required inline label={title.title} value ={title.id} name="orgNpos" type={"radio"} id={title.id} onChange={(e) => inputChangeHandler(e)}/>)
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
                <h3>Position not loaded!</h3>
                <h3>Please try refreshing.</h3>
                </>
              }

            </Form.Group>
              {/* {!addToOrg?<>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className=" d-flex justify-content-start">Password</Form.Label>
                <Form.Control type="password" placeholder="Enter Password"  name="password"  onChange={(e) => inputChangeHandler(e)} required/>
                <Form.Control.Feedback type="invalid">
                Please enter matching password!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className=" d-flex justify-content-start">Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Re-enter Password"  name="password_confirm" onChange={(e) => inputChangeHandler(e)} required/>
              <Form.Control.Feedback type="invalid">
              Please enter matching password!
            </Form.Control.Feedback>
            </Form.Group>
            </>:null} */}
   
            <Button variant="primary" type="submit" >Register</Button>
            
            </div>
        </Form>



                </div>
    )
}