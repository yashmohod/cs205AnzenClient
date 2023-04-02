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
import SaspReferal from "../../../Components/SaspReferal/SaspReferal"
import { useLocation } from 'react-router-dom'

import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'

export default function Daily({autoLogin}) {
  const navigate = useNavigate();
  const [referals,setreferals]=useState([]);
  const [referalData, setreferalData] = useState([]);
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
    judicialReferal:false,
  });
  

  function inputChangeHandler(e) {
    setFormData({...formData,  [e.target.name] : e.target.value})
  }

  async function saspReportSumbitHandler(){

  let response = await post(API_URL + "/enterSaspReport", {token: localStorage.getItem("token"),saspReportData:formData, referalData:referalData})
  if(response.message === "New SASP incident report was successfully entered."){
    localStorage.setItem("message", response.message);
    navigate("/");
  }else{
    toast.warning(String((response.message)));
  }
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
  const newreferalData = [...referalData,dataTemp]
  const refer = [...referals,{"index":referalsCount,"component": <SaspReferal setData={setData} allrefs={referals} allrefdata={referalData} referalData={dataTemp} index = {parseInt(referalsCount)} editVer={false} />}]

  setData(refer,newreferalData)
}

const setData= (ref,datas)=> {

  const setref = ref.map((refs)=>{
    return{"index":refs.index,"component": <SaspReferal setData={setData} allrefs={ref} allrefdata={datas}  referalData={datas[refs.index]} index = {parseInt(refs.index)} editVer={false} />}    
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
const location = useLocation()
const { thisFeaturePerms } = location.state
useEffect(() => 
{   
  console.log(thisFeaturePerms);
},[referals,referalData,referalsCount,showReferals])



    return (
    <div>
        <ToastContainer />

        <Tabs>
  <TabList isFitted>
    <Tab>One</Tab>
    <Tab>Two</Tab>
    <Tab>Three</Tab>
  </TabList>

  <TabPanels>
    <TabPanel>
      <p>one!</p>
    </TabPanel>
    <TabPanel>
      <p>two!</p>
    </TabPanel>
    <TabPanel>
      <p>three!</p>
    </TabPanel>
  </TabPanels>
</Tabs>

        <h1>Daily</h1>
        <div className="container-fluid">
            <div className="row">
              <div className="col-0 col-md-2"></div>
                <div className="col-12 col-md-8 justify-content-center">
                  <Form className="register-form-container p-5">
                  {thisFeaturePerms.create?<>
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
                  <Button variant="primary" type="button" onClick={() => saspReportSumbitHandler()}>Submit</Button>
                  </div>

                  </div>
                  </>:
                  <div>
                    <Form.Label className=" d-flex justify-content">
                      You do not have permisions to this feature.
                    </Form.Label>
                    <Form.Label className=" d-flex justify-content">
                      If you think this is a mistake please contact the admin.
                    </Form.Label>
                    <Form.Label className=" d-flex justify-content">
                      Thank you for you cooperations.
                    </Form.Label>
                  </div>}
                  </Form>


                </div>
                <div className="col-0 col-md-2"></div>
            </div>
        </div>
        
     
    </div>
    )
}