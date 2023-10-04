/* eslint-disable react-hooks/exhaustive-deps */
import { useState , React, useEffect,useRef} from "react";
import { Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import {Button} from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion';
import './MobileRecordsCard.css'

export default function MobileRecordsCard(props) {
    
    const cardRef = useRef(null);
    const [adminOptions,setAdminOptions]  = useState(false)
    const butStyle = {
        "marginTop":"10px"
    }

    function approve(){
        props.approveTimeCard(props.data.id)
    }
    useEffect(() => {
    
        // console.log(cardRef)
        setAdminOptions(props.admin)
        if(props.data.status == "Deactivated"){
            cardRef.current.firstChild.style.backgroundColor="#fcfcb6"
        }else{
            // cardRef.current.firstChild.style.backgroundColor="#a6f7bb"
        }
          
      }, [props.data.status])
   return(<>
   
   <Accordion.Item eventKey={props.keyNum} >
        <Accordion.Header ref={cardRef} >{props.data.incident+","+props.data.date}</Accordion.Header>
        <Accordion.Body>
        <div className="row justify-content-center">
            <div className="col">
                <Form.Label className=" d-flex justify-content-center">Incident: {props.data.incident} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Reported By: {props.data.reportedByName} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Date: {props.data.date} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Received Time: {props.data.receivedTime} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Enroute Time: {props.data.enrouteTime} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Arived Time: {props.data.arivedTime} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Clear Time: {props.data.clearTime} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Location: {props.data.location} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">LocationDetail: {props.data.locationDetail} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Summary: {props.data.summary} </Form.Label>
            </div>
        </div>
        <div className="row">
            <div className="col">
                
                <div className="topButton">
                 <Button variant={"outline-dark"} onClick={()=>{props.viewReferals(props.data.id)}} className="p-1" >View Referrals</Button>
                </div>
                <div className="lowerButton">
                {props.permisions.edit?
                    <Button color="green" appearance="primary" onClick={()=>{props.reportEdit(props.data.id)}} className="p-1" id="edit" title="Edit">
                        <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" width={30} height={30}/>
                    </Button>:null}
                {/* </div>
                <div className=""> */}
                {props.permisions.delete?
                    <Button color="red" appearance="primary" onClick={()=>{props.reportDelete(props.data.id)}} className="p-1" id="delete" title="Delete">
                        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" width={30} height={30}/>
                    </Button>:null}
                </div>
                

                
            </div>
        </div>
        </Accordion.Body>
      </Accordion.Item>


</>)}