/* eslint-disable no-undef */
import { useState , React, useEffect} from "react";
import Nav from "../../../Components/Nav/Nav";
import { Form, Button } from 'react-bootstrap';
import './SASPdaily.css'
import { API_URL, post,get } from "../../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";


export default function Register({setLoggedIn, loggedInUser, autoLogin}) {
  const navigate = useNavigate();
  const [incidents,setInceidents]= useState([]);

  const [formData, setFormData] = useState({
    incidents: "",
    date: "",
    receivedTime: "",
    enrouteTime: "",
    arivedTime: "",
    clearTime: "",
    location: "",
    locationDetail: "",
    summary: "",
  });

  function inputChangeHandler(e) {
    setFormData({...formData,  [e.target.name] : e.target.value})
    console.log(e.target.name)
}

function saspReportSumbitHandler(){
  console.log(formData)
}

async function getNsetInceidents(){
  let response = (await get(API_URL + "/getIncidents?token=" +  localStorage.getItem("token")))
  console.log(response)
  // setInceidents(inceidents => ({...inceidents, response}))
  // console.log(inceidents)
}


  useEffect(() => 
  {   
  }
, [formData,incidents])

  
 



useEffect(() => {
  getNsetInceidents()
  }, [])

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
                  <Form.Select aria-label="Default select example">
                    <option>Open this select menu</option>
                    {incidents.map((item) => {
                    return (

                      <option key={item.id} value={item.incidentName}></option>
                        
                  )})}
                  </Form.Select>
                  <Form.Label className=" d-flex justify-content-start">Location Detail</Form.Label>
                  <Form.Control type="text" placeholder="" name="locationDetails" onChange={(e) => inputChangeHandler(e)}/>

                  <Form.Label className=" d-flex justify-content-start">Date </Form.Label>
                  <Form.Control type="date" placeholder="" name="date" onChange={(e) => inputChangeHandler(e)}/>

            
      
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