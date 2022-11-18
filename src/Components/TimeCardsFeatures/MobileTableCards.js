/* eslint-disable react-hooks/exhaustive-deps */
import { useState , React, useEffect,useRef} from "react";
import { Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import {Button} from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion';

export default function MobileTableCards(props) {
    
    const cardRef = useRef(null);
    useEffect(() => {
    
        // console.log(cardRef)
        if(props.data.approval==="Pending"){
            cardRef.current.firstChild.style.backgroundColor="#fcfcb6"
        }else{
            cardRef.current.firstChild.style.backgroundColor="#a6f7bb"
        }
          
      }, [])
   return(<>
   
   <Accordion.Item eventKey={props.keyNum} >
        <Accordion.Header ref={cardRef}>Submited on: {props.data.submitedDate}</Accordion.Header>
        <Accordion.Body>
        <Form.Label className=" d-flex justify-content-start">Start: {props.data.start} </Form.Label>
        <Form.Label className=" d-flex justify-content-start">End: {props.data.end} </Form.Label>
        <Form.Label className=" d-flex justify-content-start">Duration: {props.data.duration} </Form.Label>
        <Form.Label className=" d-flex justify-content-start">Status: {props.data.approval} </Form.Label>
        <Form.Label className=" d-flex justify-content-start">Note: {props.data.note} </Form.Label>
        {props.data.approval==="Pending"?<div className="row">
            <div className="col-6">
                <Button variant={"outline-success"} onClick={()=>{props.editTimeCard(props.data.id)}} className="p-1">Edit</Button>
            </div>
            <div className="col-6">
                <Button variant={"outline-danger"} onClick={()=>{props.deleteTimeCard(props.data.id)}}className="p-1">Delete</Button>
            </div>
        </div>: null}
        </Accordion.Body>
      </Accordion.Item>


</>)}