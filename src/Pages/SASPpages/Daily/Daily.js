/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { useState , React, useEffect} from "react";
import Nav from "../../../Components/Nav/Nav";
import { Form, Button } from 'react-bootstrap';
import './SASPdaily.css'
import { API_URL, post,get } from "../../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import SaspIncidents from "../../../Components/SaspIncidents/SaspIncidents"
import SaspLocations from "../../../Components/SaspLocations/SaspLocations"
import TimePicker24H from "../../../Components/TimePicker24H/TimePicker24H"
import CloseButton from 'react-bootstrap/CloseButton'

export default function Daily({setLoggedIn, loggedInUser, autoLogin}) {
  <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
  const navigate = useNavigate();
  const [referals,setreferals]=useState([]);
  const [referalsCount,setreferalsCount] = useState(0);
  const [showReferals,setshowReferals]=useState(false);

  const [formData, setFormData] = useState({
    incident: "",
    date: "",
    receivedTime: "00:00",
    enrouteTime: "00:00",
    arivedTime: "00:00",
    clearTime: "00:00",
    location: "",
    locationDetail: "",
    summary: "",
  });

  function inputChangeHandler(e) {
    setFormData({...formData,  [e.target.name] : e.target.value})
    console.log(e.target.name)
    console.log(e.target.value)
}

function saspReportSumbitHandler(){
  console.log(formData)
}


const ReferalsComponent= (props) => {
  return(<div>
        { referals.map((items)=>{
      return(
        items.component
      )
    })}
  </div>
  )
}

const Referal = (props) => {

  return(<div>
    <div>
    <Form.Label className=" d-flex justify-content-start">Referal #{props.index+1}</Form.Label>
    </div>
    <Form.Label className=" d-flex justify-content-start">First name</Form.Label>
    <Form.Control type="text" placeholder="" name="firstName"/>
  </div>
  )
}

function addReferals(){
  setshowReferals(true)
  setreferalsCount(referalsCount+1)
  setreferals(referals => [...referals,{"index":referalsCount,"component": <Referal  index = {parseInt(referalsCount)}/>}])
}

function removeReferals(){
  setreferalsCount(referalsCount-1)
  const removeItem = referals.filter((item) => {
    return item.index !== referalsCount;
  });
  setreferals(removeItem);
  setshowReferals(true)
}



  useEffect(() => 
  {   
  },[autoLogin])


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
                  
                  <Form.Label className=" d-flex justify-content-start">Incident</Form.Label>
                  <Form.Select aria-label="Default select example"  name="incident" onChange={(e) => inputChangeHandler(e)}>
                  <SaspIncidents  />
                  </Form.Select>
              
                  <Form.Label className=" d-flex justify-content-start">Date </Form.Label>
                  <Form.Control type="date" placeholder="" name="date" onChange={(e) => inputChangeHandler(e)}/>

                  <Form.Label className=" d-flex justify-content-start">Recived Time </Form.Label>
                  <TimePicker24H inputChangeHandler={ inputChangeHandler} name = {"receivedTime"}/>

                  <Form.Label className=" d-flex justify-content-start">Enroute Time </Form.Label>
                  <TimePicker24H inputChangeHandler={ inputChangeHandler} name = {"enrouteTime"}/>
                  
                  <Form.Label className=" d-flex justify-content-start">Arrived Time </Form.Label>
                  <TimePicker24H inputChangeHandler={ inputChangeHandler} name = {"arivedTime"}/>

                  <Form.Label className=" d-flex justify-content-start">Clear Time </Form.Label>
                  <TimePicker24H inputChangeHandler={ inputChangeHandler} name = {"clearTime"}/>

                  <Form.Label className=" d-flex justify-content-start">Location</Form.Label>
                  <Form.Select aria-label="Default select example" name="location" onChange={(e) => inputChangeHandler(e)}>
                  <SaspLocations />
                  </Form.Select>

                  <Form.Label className=" d-flex justify-content-start">Location Detail</Form.Label>
                  <Form.Control type="text" placeholder="" name="locationDetail" onChange={(e) => inputChangeHandler(e)}/>

                  <Form.Label className=" d-flex justify-content-start">Summary</Form.Label>
                  <Form.Control as="textarea" placeholder="" name="summary" onChange={(e) => inputChangeHandler(e)}/>
                  
                  { showReferals ? <ReferalsComponent/> : null }
                  <div>
                  <Button variant="warning" type="button" onClick={() => addReferals()}>Add Referals</Button>
                  { showReferals ? <Button variant="danger" onClick={()=>removeReferals()}>Delete Referal</Button> : null }
                  </div>
                  <Button variant="primary" type="button" onClick={() => saspReportSumbitHandler()}>Register</Button>
            
                  </div>
                  </Form>



                </div>
                <div className="col-0 col-md-2"></div>
            </div>
        </div>
        
     
    </div>
    )
}