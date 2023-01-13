/* eslint-disable react-hooks/exhaustive-deps */
import { useState , React, useEffect,useRef} from "react";
import { Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import {Button} from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion';

export default function MobileEmpCard(props) {
    
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
        <Accordion.Header ref={cardRef} >{props.data.lastName+","+props.data.firstName}</Accordion.Header>
        <Accordion.Body>
        <div className="row justify-content-center">
            <div className="col">
                <Form.Label className=" d-flex justify-content-center">Position: {props.data.position} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Status: {props.data.status} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">DOB {props.data.dob} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">College Id: {props.data.collegeId} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">email: {props.data.email} </Form.Label>
            </div>
        </div>
        <div className="row">
            <div className="col">
                <Button variant={"outline-dark"} onClick={()=>{props.showUserProfile(props.data.id)}} className="p-1" >View Profile</Button>
            </div>
        </div>
        </Accordion.Body>
      </Accordion.Item>


</>)}