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
import MobileTableCards from '../../../Components/TimeCardsFeatures/MobileTableCards';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';

export default function TimeCards({setLoggedIn, loggedInUser, autoLogin}) {
   
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    const [timeCardData,setTimeCardData] = useState({
        startDate:"",
        startTime:"00:00",
        endDate:"",
        endTime:"00:00",
        note:"",
        id:"",
      });

    function inputChangeHandlerTimeCardData(e){
        setTimeCardData({...timeCardData,  [e.target.name] : e.target.value})
    }

    async function timeCardSubmit(){
        if(timeCardData.id !=""){
          editedtimeCardSubmit()
        }
        else{
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
        getAlltc(pos)
        setTimeCardData({
          startDate:"",
          startTime:"00:00",
          endDate:"",
          endTime:"00:00",
          note:"",
          id:"",
        })
      }
    }
    const [org,setOrg] = useState("")
    const [pos,setPos]= useState("")
    async function setORGnPOS(){
        const orgres = (await get(API_URL + "/getOrganization?token=" +  localStorage.getItem("token")))
        const posres = (await get(API_URL + "/getPosition?token=" +  localStorage.getItem("token")))
        setOrg(orgres["organization"])
        setPos(posres["position"])
        getAlltc(posres["position"])
    }
    const[myTC,setMYtc]=useState([])
    const[allTC,setALLtc]=useState([])

    async function getAlltc(position){
    let responseALL = await get(API_URL + "/getTimeCards?token=" +  localStorage.getItem("token"))
      
      if(responseALL.status == 200) {
        var data = responseALL.UserTimeCards.map((tc)=>{
          if(tc.approval){
            tc.approval ="Approved"
          }else{
            tc.approval ="Pending"
          }
          return(
            tc
          )
        })
        setMYtc(data)
    }
  
    if(position == "admin"){
      if(responseALL.status == 200) {
        var data = responseALL.AlltimeCards.map( (tc)=>{
         if(tc.approval){
            tc.approval ="Approved"
         }else{
           tc.approval ="Pending"
         }
         return(
           tc
         )
        })
        setALLtc(data)
      }
    }
}


function editTimeCard(timeCardID){
  var data = {}
  for(var x =0; x< myTC.length;x++){
    if(myTC[x].id == timeCardID){
      data=myTC[x]
    }
  }

  setTimeCardData({
    startDate:data.start.split("/")[0].replaceAll(' ', ''),
    startTime:data.start.split("/")[1].replaceAll(' ', ''),
    note:data.note,
    endDate:data.end.split("/")[0].replaceAll(' ', ''),
    endTime:data.end.split("/")[1].replaceAll(' ', ''),
    id:timeCardID,
  })

  handleShow()

 }

 async function editedtimeCardSubmit(){
  console.log(timeCardData)
  let response = await post(API_URL + "/editTimeCard", {
      token: localStorage.getItem("token"),
      idTimecardID:timeCardData.id,
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
  getAlltc(pos)
  setTimeCardData({
    startDate:"",
    startTime:"00:00",
    endDate:"",
    endTime:"00:00",
    note:"",
    id:"",
  })
}

 async function deleteTimeCard(timeCardID){

  let response = await post(API_URL + "/clearTimeCard", {token: localStorage.getItem("token"),TimecardID: timeCardID})
  if(response.status === 200){
    toast.success(response.message)
  }else{
    toast.warning(response.message)
  }
  getAlltc(pos)
 }



 const myTCgridRef = useRef(null);
 const myTCdefaultColDef= { resizable: true}
 const myTCcolumnDefs = [
    {field: 'submitedDate', headerName: 'Submited Date' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'start', headerName: 'Start' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'end', headerName: 'End' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'duration', headerName: ' Duration' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'approval', headerName: 'Status' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'note', headerName: 'Note' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'id',
    headerName: '' ,
    cellStyle: { 'textAlign': 'center' },
    cellRenderer: (params) => {
      if(params.data.approval == "Pending"){
      return( <CommonButton buttonText={"Edit"} variant={"outline-success"} clicked={()=>{editTimeCard(params.data.id)}} />)
      }else{
        return null
      }
    }},
    {field: 'id',
    headerName: '' ,
    cellStyle: { 'textAlign': 'center' },
    cellRenderer: (params) => {
      if(params.data.approval == "Pending"){
        return( <CommonButton buttonText={"Delete"} variant={"outline-danger"} clicked={()=>{deleteTimeCard(params.data.id)}} />)
        }else{
          return null
        }
    }},
    ]


  function myTCshowMobileViewTimeCards(){
    let sortedfTC = []
    for(let x = 0; x< myTC.length; x++){
      if(myTC[x].approval =="Pending" ){
        sortedfTC.push(myTC[x])
      }
    }
    for(let x = 0; x< myTC.length; x++){
      if(myTC[x].approval =="Approved" ){
        sortedfTC.push(myTC[x])
      }
    }

    return(
      sortedfTC.map(element => {
      return(
      <MobileTableCards keyNum ={myTC.indexOf(element)}  data={element} editTimeCard={editTimeCard} deleteTimeCard={deleteTimeCard} admin={false} />
     ) }))
  }


  // AdminTimeCards
  async function approveTimeCard(timeCardID){
    let response = await post(API_URL + "/approveTimeCard", {token: localStorage.getItem("token"),TimecardID: timeCardID})
    if(response.status === 200){
      toast.success(response.message)
    }else{
      toast.warning(response.message)
    }
    console.log(pos)
    getAlltc(pos)

   }



   const allTCgridRef = useRef(null);
   const allTCdefaultColDef= { resizable: true}
   const allTCcolumnDefs = [
      {field: 'whoName', headerName: 'Employee' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'submitedDate', headerName: 'Submited Date' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'start', headerName: 'Start' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'end', headerName: 'End' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'duration', headerName: ' Duration' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'approval', headerName: 'Status' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'note', headerName: 'Note' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'id',
      headerName: '' ,
      cellRenderer: CommonButton, 
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
         editTimeCard(field)
        },
        buttonText:"Edit",
        variant:"outline-success",
      }},
      {field: 'id',
      headerName: '' ,
      cellRenderer: CommonButton, 
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
         deleteTimeCard(field)
        },
        buttonText:"Delete",
        variant:"outline-danger"
      }},
      {field: 'id',
      headerName: '' ,
      cellRenderer: CommonButton, 
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
         approveTimeCard(field)
        },
        buttonText:"Approve",
        variant:"outline-primary"
      }},
      
      ]


    function allTCshowMobileViewTimeCards(){
      let sortedfTC = []
      for(let x = 0; x< allTC.length; x++){
        if(allTC[x].approval =="Pending" ){
          sortedfTC.push(allTC[x])
        }
      }
      for(let x = 0; x< allTC.length; x++){
        if(allTC[x].approval =="Approved" ){
          sortedfTC.push(allTC[x])
        }
      }


      return(
        sortedfTC.map(element => {
        return(
        <MobileTableCards keyNum ={allTC.indexOf(element)}  data={element} editTimeCard={editTimeCard} deleteTimeCard={deleteTimeCard} approveTimeCard={approveTimeCard}  admin={true}/>
       ) }))
    }



    useEffect(() => {
        autoLogin()
        setORGnPOS()

        
    }, [ ])

    function showAndClear(){
      handleShow()
      setTimeCardData({
        startDate:"",
        startTime:"00:00",
        endDate:"",
        endTime:"00:00",
        note:"",
        id:"",
      })
    }


    return (
        <div className="incident-page" >
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
             <ToastContainer />
            <h1>Time Cards</h1>
            <Form className="incident-form">
                <Button variant="outline-dark" onClick={() =>showAndClear() }>Add Time Card</Button>
                
            </Form>
            

            <Tabs
            defaultActiveKey="My Time Cards"
            id="uncontrolled-tab-example"
            className="mb-3"
            >
            <Tab eventKey="My Time Cards" title="My Time Cards">
                {/* desktop view */}
                <div className="d-none d-xxl-block" >
                  <div className="ag-theme-alpine incident-grid">
                    
                          <AgGridReact
                            ref={myTCgridRef}
                            columnDefs={myTCcolumnDefs}
                            defaultColDef={myTCdefaultColDef}
                            rowData={myTC}
                            >
                          </AgGridReact>


                  </div>
                </div>

                {/* Mobile View */}
                <div className="d-block d-xxl-none" >
                  <div className="ag-theme-alpine incident-grid">
                    
                  <Accordion defaultActiveKey="0">
                  {myTCshowMobileViewTimeCards()}

                </Accordion>

                  </div>
                </div>
            </Tab>
            {pos == "admin"? 
                <Tab eventKey="All Time Cards" title="All Time Cards">
                   {/* desktop view */}
                  <div className="d-none d-xxl-block" >
                    <div className="ag-theme-alpine incident-grid">
                      
                            <AgGridReact
                              ref={allTCgridRef}
                              columnDefs={allTCcolumnDefs}
                              defaultColDef={allTCdefaultColDef}
                              rowData={allTC}
                              >
                            </AgGridReact>


                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="d-block d-xxl-none" >
                    <div className="ag-theme-alpine incident-grid">
                      
                    <Accordion defaultActiveKey="0" >
                      {allTCshowMobileViewTimeCards()}
                  </Accordion>

                    </div>
                  </div>
                </Tab>
            :null}
            </Tabs>
            

            {/* edit pop up */}
    <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Time Card</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <div className="row ">
                <div className="col ">
                <Form.Label className=" d-flex justify-content-start">Start Time </Form.Label>
                <Form.Control type="date"placeholder="" value={timeCardData.startDate} onChange={(e)=>inputChangeHandlerTimeCardData(e)}  name="startDate" />
                </div>
                <TimePicker24H time={timeCardData.startTime} inputChangeHandler={inputChangeHandlerTimeCardData} name = {"startTime"}/>
                </div>
                <div className="row ">
                <div className="col ">
                <Form.Label className=" d-flex justify-content-start">End Time </Form.Label>
                <Form.Control type="date"placeholder="" value={timeCardData.endDate} onChange={(e)=>inputChangeHandlerTimeCardData(e)}  name="endDate" />
                </div>
                <TimePicker24H time={timeCardData.endTime} inputChangeHandler={inputChangeHandlerTimeCardData} name = {"endTime"}/>
                </div>
                <div className="row" id="margin">
                <Form.Label className=" d-flex justify-content-start"><strong>Notes:</strong></Form.Label>
                <Form.Control   as="textarea" value={timeCardData.note} rows={3} onChange={(e)=>inputChangeHandlerTimeCardData(e)} name = {"note"}/>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={()=>timeCardSubmit()}>Submit</Button>
            </Modal.Footer>
            </Modal>
    

        </div>
    )
}