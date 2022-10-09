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

export default function Daily({setLoggedIn, loggedInUser, autoLogin}) {
  <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
  const navigate = useNavigate();
  const [referals,setreferals]=useState([]);
  const [referalData, setreferalData] = useState([]);
  const [referalsCount,setreferalsCount] = useState(0);
  const [showReferals,setshowReferals]=useState(false);



useEffect(() => 
{   

  
},[referals,referalData,referalsCount,showReferals])

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
    judicialReferal:false,
  });
  

  function inputChangeHandler(e) {
    setFormData({...formData,  [e.target.name] : e.target.value})
}

  async function saspReportSumbitHandler(){
  console.log(formData)
  console.log(referalData)
  let response = await post(API_URL + "/enterSaspReport", {token: localStorage.getItem("token"),saspReportData:formData, referalData:referalData})
  console.log(response)
  if(response.message === "New SASP incident report was successfully entered."){
    localStorage.setItem("message", response.message);
    navigate("/");
  }else{
    toast.warning(String((response.message)));
  }
}




const Referal = (props) => {
  const [refdata,setrefdata] =useState({
    "index":props.index,
    "firstName" :"",
    "middleInitial" :"",
    "lastName" :"",
    "ICID" :"",
    "dob" :"",
    "phoneNo" :"",
    "address" :"",
    
  })
  function inputHandler(e){
    const refTdata = {...refdata,  [e.target.name] : e.target.value}

    const newdata = props.allrefdata.map((data)=>{
    if(data.index === props.index){
      return {...refdata,  [e.target.name] : e.target.value}
    }
    else{
      return data
    }
  })

  props.setData(props.allrefs, newdata)
  setrefdata(refTdata)
  }



  return(<div>
    <ToastContainer />
    <div className="padding">
    <div className="row">
      <div className="col-0 col-md-2"></div>
        <div className="col-12 col-md-8">
          <Form className="register-form-container p-5">
            <div>
              {/* {console.log(props.referalData)} */}
              <Form.Label className=" d-flex justify-content-start">Referal #{props.index+1}</Form.Label>

              <Form.Label className=" d-flex justify-content-start">First name</Form.Label>
              <Form.Control type="text" placeholder="" name="firstName" onChange={(e)=>inputHandler(e)} value={props.referalData.firstName}/>

              <Form.Label className=" d-flex justify-content-start">Middle int.</Form.Label>
              <Form.Control type="text" placeholder="" name="middleInitial" onChange={(e)=>inputHandler(e)} value={props.referalData.middleInitial}/>

              <Form.Label className=" d-flex justify-content-start">Last name</Form.Label>
              <Form.Control type="text" placeholder="" name="lastName" onChange={(e)=>inputHandler(e)} value={props.referalData.lastName}/>

              <Form.Label className=" d-flex justify-content-start">ICID</Form.Label>
              <Form.Control type="text" placeholder="" name="ICID" onChange={(e)=>inputHandler(e)} value={props.referalData.ICID}/>

              <Form.Label className=" d-flex justify-content-start">DOB</Form.Label>
              <Form.Control type="date" placeholder="" name="dob" onChange={(e)=>inputHandler(e)} value={props.referalData.dob}/>

              <Form.Label className=" d-flex justify-content-start">Phone no.</Form.Label>
              <Form.Control type="text" placeholder="" name="phoneNo" onChange={(e)=>inputHandler(e)} value={props.referalData.phoneNo}/>

              <Form.Label className=" d-flex justify-content-start">Local Address</Form.Label>
              <Form.Control as="textarea" placeholder="" name="address" onChange={(e)=>inputHandler(e)} value={props.referalData.address}/>
              

            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
  )
}

function addReferals(){
  setshowReferals(true)
  setreferalsCount(referalsCount+1)
  const dataTemp = {
    "index":referalsCount,
    "firstName" :"",
    "middleInitial" :"",
    "lastName" :"",
    "ICID" :"",
    "dob" :"",
    "phoneNo" :"",
    "address" :"",
    
  }
  console.log(referalData)
  console.log(referals)
  const newreferalData = [...referalData,dataTemp]
  const refer = [...referals,{"index":referalsCount,"component": <Referal setData={setData} allrefs={referals} allrefdata={referalData} referalData={dataTemp} index = {parseInt(referalsCount)} />}]

  setData(refer,newreferalData)
}

const setData= (ref,datas)=> {

  const setref = ref.map((refs)=>{
    return{"index":refs.index,"component": <Referal setData={setData} allrefs={ref} allrefdata={datas}  referalData={datas[refs.index]} index = {parseInt(refs.index)} />}    
  })
  setreferalData(datas)
  setreferals(setref)
  

}

function removeReferals(){
  setreferalsCount(referalsCount-1)
  const removeItem = referals.filter((item) => {
    return item.index !== referalsCount-1;
  });
  const removedata = referalData.filter((item) => {
    return item.index !== referalsCount-1;
  });
  setreferals(removeItem);
  setreferalData(removedata);
  if(referalsCount-1 === 0){
    setshowReferals(false)
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
                <div className="col-12 col-md-8 justify-content-center">
                   
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
  
                  { showReferals ? (<div>
                                        { referals.map((items)=>{
                                      return(
                                        items.component
                                      )
                                    })}
                                  </div>) : null }
                  
                
                  <div className="padding">
                  { showReferals ? <Form.Check inline className="checkbox"  name="judicialReferal"  type={'checkbox'} aria-label="option 1"  label="Judicial Referal" onChange={(e) => inputChangeHandler(e)}/> : null }
                  </div>
                  <div className="padding">
                  <Button variant="warning" type="button" onClick={() => addReferals()}>Add Referals</Button>
                  { showReferals ? <Button variant="danger" onClick={()=>removeReferals()}>Delete Referal</Button> : null }
                  </div>

                  <div className="padding">
                  <Button variant="primary" type="button" onClick={() => saspReportSumbitHandler()}>Register</Button>
                  </div>

                  </div>
                  </Form>



                </div>
                <div className="col-0 col-md-2"></div>
            </div>
        </div>
        
     
    </div>
    )
}