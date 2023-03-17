/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef, useState } from "react";
import Card from "../../../Components/Card/Card";
import Nav from "../../../Components/Nav/Nav";
import './Dashboard.css'
import { API_URL, post,get } from "../../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import {Features} from "./features"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { useNavigate } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import {Form, Button} from 'react-bootstrap'

export default function({autoLogin}) {
    const [clockin, setClockin] = useState(false)
    const [showFeatures,setshowFeatures] =useState(false)
    const [features,setfeatures] = useState();

    function checkMessage(){
        if(!(localStorage.getItem("message") === null)){
            toast.success(String(localStorage.getItem("message")));
            localStorage.removeItem("message");
        }
    }
    

    function tabChange(e){
        console.log(sortedFeatures[e].org)
        set_curOrgClock(sortedFeatures[e].org)
        checkClockinStatus(sortedFeatures[e].org)
    }
    const [curOrgClock, set_curOrgClock] = useState()


    const [adshow, setadShow] = useState(false);
    const handleadClose = () => setadShow(false);
    const handleadShow = () => setadShow(true);
    const [shifts, setShifts] = useState([]);
    const [addNote,setAddNote]= useState(false);
    const [note,setNote] = useState("");

    async function getShifts(){
        let response = await get(API_URL + "/getShifts?token=" +  localStorage.getItem("token"))
        setShifts(response.shifts)
    }

    async function clockIn() {

        let response = await post(API_URL + "/clockIn", {token: localStorage.getItem("token"), org:curOrgClock})
        if(response.status == 400){
            toast.warning(response.message)
        }
        if(response.status == 200){
            toast.success(response.message)
            setClockin(true) 
        }
    }
    
    function clockOutButtonHandler(){
        handleadShow()
    }

    async function clockOut(shiftType) {
        handleadClose()
        let response = await post(API_URL + "/clockOut", {token: localStorage.getItem("token"), org:curOrgClock, note:note, shiftName: shiftType})
        if(response.status == 400){
            toast.warning(response.message)
        }
        if(response.status == 200){
            toast.success(response.message)
            setClockin(false) 
        }
    }




    const [orgs,setOrgs] = useState([]);
    const [sortedFeatures,setSortedFeatures]=useState([]);
    async function setFeatures(){
        let temp = []

        let permisions_response = await get(API_URL + "/getFeaturePermissions?token=" +  localStorage.getItem("token"));
        console.log(permisions_response)
        const perms = permisions_response.featurePermissions
        let temp_sortedFeatures=[]
        for(let x =0; x<perms.length; x++){
            if(!temp.includes(perms[x].org)){
                temp.push(perms[x].org)
            }
            let count =0;
            for(let y =0; y < temp_sortedFeatures.length; y++){
                if(perms[x].org == temp_sortedFeatures[y].org){
                    let accessBol = perms[x].view;
                    if(perms[x].blackListed){
                        accessBol = false;
                    }
                    let curFeature = {
                        org :perms[x].org,
                        access:accessBol,
                        title: perms[x].featureName, 
                        internallyManaged:perms[x].internallyManaged, 
                        internal_url: perms[x].internalUrl,
                        external_url: perms[x].externalUrl, 
                        create:perms[x].create, 
                        edit:perms[x].edit, 
                        delete:perms[x].delete,
                        dashboardFeature: perms[x].dashboardFeature,
                    };
                    temp_sortedFeatures[y].features.push(curFeature);
                    count++;
                }
                if(count>0){
                    break
                }
            
            }
            if(count == 0){
                temp_sortedFeatures.push({"org":perms[x].org, "features":[]})
                let accessBol = perms[x].view;
                for(let y =0; y < temp_sortedFeatures.length; y++){
                    if(perms[x].org == temp_sortedFeatures[y].org){
                        let accessBol = perms[x].view;
                        if(perms[x].blackListed){
                            accessBol = false;
                        }
                        let curFeature = {
                            org :perms[x].org,
                            access:accessBol,
                            title: perms[x].featureName, 
                            internallyManaged:perms[x].internallyManaged, 
                            internal_url: perms[x].internalUrl,
                            external_url: perms[x].externalUrl, 
                            create:perms[x].create, 
                            edit:perms[x].edit, 
                            delete:perms[x].delete,
                            dashboardFeature: perms[x].dashboardFeature,
                        }  ;
                        temp_sortedFeatures[y].features.push(curFeature);
                    }
                
                }
            }

        }

        setOrgs(temp)
        setSortedFeatures(temp_sortedFeatures)
        set_curOrgClock(temp_sortedFeatures[0].org)
        checkClockinStatus(temp_sortedFeatures[0].org)
        setshowFeatures(true)
    }

    const checkClockinStatus = async (Org) => {
        let response = await post(API_URL + "/checkClockInStatus", {token: localStorage.getItem("token"),org:Org})
        if (response.clock_in === true) {
            setClockin(true)
        } else {
            setClockin(false)
        }
    }

    useEffect(() => {
        autoLogin()
        // checkMessage()
        getShifts()
        setFeatures()
    },[])


    const Gstyle ={
        "height": "100px",
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        "margin": "5px",
        "background-color": "#8EC5FC",
        "background-image": "linear-gradient(62deg, #8EC5FC 50%, #00D100 100%)",
        "border-radius": "15px",
    }
    const Rstyle ={
        "height": "100px",
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        "margin": "5px",
        "background-color": "#8EC5FC",
        "background-image": "linear-gradient(62deg, #8EC5FC 50%, #D10000 100%)",
        "border-radius": "15px",
    }

    return (
        
        <div>
        <ToastContainer />
        <Modal
              show={adshow}
              onHide={handleadClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Clock Out</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                    {addNote?
                    <>
                        <Form.Control as="textarea" placeholder="Note..." name="note" onChange={(e) => setNote(e.target.value)}/>
                        <Button variant="danger" style={{marginTop:"10px"}} onClick={()=>{setAddNote(false);setNote("")}}>Cancel</Button>
                    </>
                    :
                    <>
                    <Button variant="primary" onClick={()=>setAddNote(true)}>Add Note</Button>
                    </>}
                </Form>
              </Modal.Body>
              <Modal.Footer>
              <Form>
                <Form.Label className=" d-flex justify-content-start">Select a shift type!</Form.Label>
                {shifts.map((shift)=>{
                    return (<Button variant="success" style={{marginRight:"5px"}} onClick={()=>clockOut(shift.shiftName)}>{shift.shiftName}</Button>)
                })}
                </Form>
              </Modal.Footer>
              
            </Modal>



        <Tabs id="uncontrolled-tab-example"className="mb-3"defaultActiveKey="0" justify onSelect={(e) =>tabChange(e)} >
            {sortedFeatures.map((SF)=>{
                return(
                <Tab eventKey={sortedFeatures.indexOf(SF)} title={SF.org}>
                    <div className="features container-fluid mt-5 ">
                        <div className="row">
                            <div className="col-12">
                                {clockin ?  <div onClick={() => clockOutButtonHandler()}><Card title="Clock Out" description="End your work shift" style={Rstyle}/></div> : <div onClick={() => clockIn()}><Card title="Clock In" description="Start your work shift" style={Gstyle}/></div> }
                            </div>
                        </div>
                        <div className="row justify-content-center"  >
                
                            { showFeatures ? <Features features={SF.features}/> : null }

                        </div>
                    </div>


                </Tab>
            )})}

        </Tabs>
        
    </div>
    )
}