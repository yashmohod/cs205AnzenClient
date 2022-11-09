import React from "react";
import { useState, useEffect, useRef } from "react";
import './TimeCards.css'
import "react-datepicker/dist/react-datepicker.css";
import Nav from "../../../Components/Nav/Nav";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import {Form, Button} from 'react-bootstrap'
import { API_URL, get, post } from "../../../Utils/API";
import CommonButton from '../../../Components/Buttons/CommonButton'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import TimePicker24H from "../../../Components/TimePicker24H/TimePicker24H"
import Modal from 'react-bootstrap/Modal';
import EmployeeTimeCards from '../../../Components/TimeCardsFeatures/EmployeeTimeCards';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function TimeCards({setLoggedIn, loggedInUser, autoLogin}) {
   
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);

    const [timeCardData,setTimeCardData] = useState({
        id:"",
        startDate:"",
        startTime:"00:00",
        endDate:"",
        endTime:"00:00",
        note:"",
      });

    function inputChangeHandlerTimeCardData(e){
        setTimeCardData({...timeCardData,  [e.target.name] : e.target.value})
    }

    async function timeCardSubmit(){
        console.log(timeCardData)
        let response = await post(API_URL + "/addTimeCard", {
            token: localStorage.getItem("token"),
            start:timeCardData.startDate+" "+timeCardData.startTime+":00",
            end:timeCardData.endDate+" "+timeCardData.endTime+":00",
            note:timeCardData.note,
            })

        if(response.status === 200){
            toast.success(response.message)
            handleClose()
        }else{
            toast.warning(response.message)
        }
    }

    useEffect(() => {
        autoLogin()

        
    }, [])

    const[resize,setresize]= useState(true)

    return (
        <div className="incident-page" >
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
             <ToastContainer />
            <h1>Time Cards</h1>
            <Form className="incident-form">
                <Button variant="outline-dark" onClick={() => handleShow()}>Add Time Card</Button>
                {/* <Button variant="primary" onClick={handleShow}>
                  Launch static backdrop modal
                </Button> */}
                
            </Form>
            

            <Tabs
            defaultActiveKey="My Time Cards"
            id="uncontrolled-tab-example"
            className="mb-3"
            >
            <Tab eventKey="My Time Cards" title="My Time Cards">
                <EmployeeTimeCards editShow={handleShowEdit} setEditData={setTimeCardData} />
            </Tab>
            <Tab eventKey="All Time Cards" title="All Time Cards">
                
            </Tab>
            </Tabs>
            

            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>{showEdit?"Edit Time Card":"Add Time Card"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <div className="row ">
                <div className="col ">
                <Form.Label className=" d-flex justify-content-start">Start Time </Form.Label>
                <Form.Control type="date"placeholder="" value={timeCardData.startDate} onChange={(e)=>inputChangeHandlerTimeCardData(e)}  name="startDate" />
                </div>
                <TimePicker24H time = {timeCardData.startTime} inputChangeHandler={ inputChangeHandlerTimeCardData} name = {"startTime"}/>
                </div>
                <div className="row ">
                <div className="col ">
                <Form.Label className=" d-flex justify-content-start">End Time </Form.Label>
                <Form.Control type="date"placeholder="" value={timeCardData.startDate} onChange={(e)=>inputChangeHandlerTimeCardData(e)}  name="endDate" />
                </div>
                <TimePicker24H time = {timeCardData.endTime} inputChangeHandler={ inputChangeHandlerTimeCardData} name = {"endTime"}/>
                </div>
                <div className="row" id="margin">
                <Form.Label className=" d-flex justify-content-start"><strong>Notes:</strong></Form.Label>
                <Form.Control value={timeCardData.note}  as="textarea" rows={3} onChange={(e)=>inputChangeHandlerTimeCardData(e)} name = {"notes"}/>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={()=>timeCardSubmit()}>Submit</Button>
            </Modal.Footer>
            </Modal>
    

        </div>
    )
}