/* eslint-disable react-hooks/exhaustive-deps */
import { useState , React, useEffect,useRef} from "react";
import { Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import {Button} from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion';
import './MobileReferralsCard.css'

export default function MobileReferralsCard(props) {
    
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
                <Form.Label className=" d-flex justify-content-center">date: {props.data.date} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">incident: {props.data.incident} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">location: {props.data.location} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">judicialReferal: {props.data.judicialReferal} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Name: {props.data.firstName +" "+props.data.middleInitial +" "+props.data.lastName} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">ICID: {props.data.ICID} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">dob: {props.data.dob} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">address: {props.data.address} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">phoneNo: {props.data.phoneNo} </Form.Label>
            </div>
        </div>
        <div className="row">
            <div className="col">
            <div className="topButton">
                 <Button variant={"outline-dark"} onClick={()=>{props.viewReport(props.data.reportID)}} className="p-1" >View Referrals</Button>
                </div>
                <div className="lowerButton">
                {props.permisions.edit?
                    <Button color="green" appearance="primary" onClick={()=>{props.referalEdit(props.data.id)}} className="p-1" id="edit" title="Edit">
                        <img src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png" width={30} height={30}/>
                    </Button>:null}
                {/* </div>
                <div className=""> */}
                {props.permisions.delete?
                    <Button color="red" appearance="primary" onClick={()=>{props.referalDelete(props.data.id)}} className="p-1" id="delete" title="Delete">
                        <img src="https://cdn-icons-png.flaticon.com/512/1828/1828843.png" width={30} height={30}/>
                    </Button>:null}
                </div>
                

                
            </div>
        </div>
        </Accordion.Body>
      </Accordion.Item>


</>)}