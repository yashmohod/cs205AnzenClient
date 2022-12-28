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
        if(props.data.status){
            cardRef.current.firstChild.style.backgroundColor="#fcfcb6"
        }else{
            cardRef.current.firstChild.style.backgroundColor="#a6f7bb"
        }
          
      }, [props.data.approval])
   return(<>
   
   <Accordion.Item eventKey={props.keyNum} >
        <Accordion.Header ref={cardRef} >{props.data.lastName+","+props.data.firstName}</Accordion.Header>
        <Accordion.Body>
        <div className="row justify-content-center">
            <div className="col">
                <Form.Label className=" d-flex justify-content-center">Position: {props.data.position} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">Status: {props.data.status?"Active":"Deactive"} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">DOB {props.data.dob} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">College Id: {props.data.collegeId} </Form.Label>
                <Form.Label className=" d-flex justify-content-center">email: {props.data.email} </Form.Label>
            </div>
        </div>
        <div className="row">
        {props.permisions.edit?<>
            <div className="col-4">
                <Button variant={"outline-success"} onClick={()=>{props.editAccount(props.data.id)}} className="p-1" >Edit</Button>
            </div>
            <div className="col-4">
                <Button variant={"outline-success"} onClick={()=>{props.promoteAccount(props.data.id)}}className="p-1">Promote</Button>
            </div>
            <div className="col-4">
                <Button variant={"outline-danger"} onClick={()=>{props.demoteAccount(props.data.id)}}className="p-1">Demote</Button>
            </div>
            <div className="col-4">
                <Button variant={"outline-info"} onClick={()=>{props.changeAccountStatue(props.data.id)}}className="p-1" style={butStyle}>Change Status</Button>
            </div>
            <div className="col-4">
                <Button variant={"outline-dark"} onClick={()=>{props.changePassword(props.data.id)}}className="p-1" style={butStyle}>Change Password</Button>
            </div>
            </>: null}
        {props.permisions.delete?
            <div className="col-4">
                <Button variant={"outline-danger"} onClick={()=>{props.deleteTimeCard(props.data.id)}}className="p-1" style={butStyle}>Delete</Button>
            </div>
            : null} </div>
        </Accordion.Body>
      </Accordion.Item>


</>)}