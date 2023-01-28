/* eslint-disable react-hooks/exhaustive-deps */
import { useState , React, useEffect,useRef} from "react";
import { Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import {Button} from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion';

export default function MobileTableCards(props) {
    
    const cardRef = useRef(null);
    const [adminOptions,setAdminOptions]  = useState(false)
    function approve(){
        props.approveTimeCard(props.data.id)
    }
    useEffect(() => {
    
        // console.log(cardRef)
        setAdminOptions(props.admin)
        if(props.data.approval=="Pending"){
            cardRef.current.firstChild.style.backgroundColor="#fcfcb6"
        }else{
            cardRef.current.firstChild.style.backgroundColor="#a6f7bb"
        }
          
      }, [props.data.approval])
   return(<>
   
   <Accordion.Item eventKey={props.keyNum} >
        <Accordion.Header ref={cardRef} >Submited on: {props.data.submitedDate}</Accordion.Header>
        <Accordion.Body>
        <Form.Label className=" d-flex justify-content-start">Start: {props.data.start} </Form.Label>
        <Form.Label className=" d-flex justify-content-start">End: {props.data.end} </Form.Label>
        <Form.Label className=" d-flex justify-content-start">Duration: {props.data.duration} </Form.Label>
        <Form.Label className=" d-flex justify-content-start">Status: {props.data.approval} </Form.Label>
        <Form.Label className=" d-flex justify-content-start">Shift Type: {props.data.shiftName} </Form.Label>
        <Form.Label className=" d-flex justify-content-start">Note: {props.data.note} </Form.Label>
        {props.data.approval==="Pending" && !adminOptions?<div className="row">
            <div className="col-6">
                <Button variant={"outline-success"} onClick={()=>{props.editTimeCard(props.data.id)}} className="p-1">Edit</Button>
            </div>
            <div className="col-6">
                <Button variant={"outline-danger"} onClick={()=>{props.deleteTimeCard(props.data.id)}}className="p-1">Delete</Button>
            </div>
        </div>: null}
        {adminOptions?<div className="row">
            <div className="col-4">
                <Button variant={"outline-success"} onClick={()=>{props.editTimeCard(props.data.id)}} className="p-1">Edit</Button>
            </div>
            <div className="col-4">
                <Button variant={"outline-danger"} onClick={()=>{props.deleteTimeCard(props.data.id)}}className="p-1">Delete</Button>
            </div>

            {props.data.approval==="Pending"?
            <div className="col-4">
                <Button variant={"outline-primary"} onClick={()=>approve()}className="p-1">Approve</Button>
            </div>: null}
        </div>: null}
        </Accordion.Body>
      </Accordion.Item>


</>)}