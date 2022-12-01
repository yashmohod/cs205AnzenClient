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
import EmployeeList from "../../../Components/EmployeeList/EmployeeList"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';

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
        if(posres["position"] == "admin"){
          getAlltc(pos,myTCpreviousSearchData)
          getAlltc(pos,allTCpreviousSearchData)
        }else{
          getAlltc(pos,myTCpreviousSearchData)
        }
    }
    const[myTC,setMYtc]=useState([])
    const[allTC,setALLtc]=useState([])

    async function getAlltc(position,searchDATA){
      let responseALL = null
      if(position == "admin"){
        if(ISadminTCsearch){
          responseALL = await get(API_URL + "/getTimeCards?token=" +  localStorage.getItem("token")+
          "&admin_emp="+searchDATA.employeeId+
          "&admin_dateFrom="+searchDATA.dateFrom+
          "&admin_dateTo="+searchDATA.dateTo+
          "&admin_status="+searchDATA.approval)
          // console.log("2")
        }else{
          responseALL = await get(API_URL + "/getTimeCards?token=" +  localStorage.getItem("token")+
          "&dateFrom="+searchDATA.dateFrom+
          "&dateTo="+searchDATA.dateTo+
          "&status="+searchDATA.approval)
          // console.log("2")
        }
      }else{
        responseALL = await get(API_URL + "/getTimeCards?token=" +  localStorage.getItem("token")+
          "&dateFrom="+searchDATA.dateFrom+
          "&dateTo="+searchDATA.dateTo+
          "&status="+searchDATA.approval)
          // console.log("3")
      }

      
      if(responseALL.status == 200) {
        var data = 0;
        data = responseALL.UserTimeCards.map((tc)=>{
          if(tc.approval){
            tc.approval ="Approved"
          }else{
            tc.approval ="Pending"
          }
          return(
            tc
          )
        })
        if(data!=0){
          // console.log(data)
          setMYtc(data)
        }
    }
  
    if(position == "admin"){
      if(responseALL.status == 200) {
        var data = "0";
         data = responseALL.AlltimeCards.map( (tc)=>{
         if(tc.approval){
            tc.approval ="Approved"
         }else{
           tc.approval ="Pending"
         }
         return(
           tc
         )
        })
        // console.log(data!="0")
        if(data!="0"){
          setALLtc(data)
        }
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
  // console.log(timeCardData)
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
  if(pos == "admin"){
    getAlltc(pos,myTCpreviousSearchData)
    getAlltc(pos,allTCpreviousSearchData)
  }else{
    getAlltc(pos,myTCpreviousSearchData)
  }
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
  getAlltc(pos,myTCpreviousSearchData)
  getAlltc(pos,allTCpreviousSearchData)
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
    {field: '',
    headerName: '' ,
    cellStyle: { 'textAlign': 'center' },
    cellRenderer: (params) => {
      if(params.data.approval == "Pending"){
      return( <CommonButton buttonText={"Edit"} variant={"outline-success"} clicked={()=>{editTimeCard(params.data.id)}} />)
      }else{
        return null
      }
    }},
    {field: '',
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
    // console.log(pos)
    getAlltc(pos,allTCpreviousSearchData)

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
      {field: '',
    headerName: '' ,
    cellStyle: { 'textAlign': 'center' },
    cellRenderer: (params) => {
      return( <CommonButton buttonText={"Edit"} variant={"outline-success"} clicked={()=>{editTimeCard(params.data.id)}} />)
    }},
    {field: '',
    headerName: '' ,
    cellStyle: { 'textAlign': 'center' },
    cellRenderer: (params) => {
      return( <CommonButton buttonText={"Delete"} variant={"outline-danger"} clicked={()=>{deleteTimeCard(params.data.id)}} />)
    }},
    {field: '',
    headerName: '' ,
    cellStyle: { 'textAlign': 'center' },
    cellRenderer: (params) => {
      if(params.data.approval == "Pending"){
        return( <CommonButton buttonText={"Approve"} variant={"outline-primary"} clicked={()=>{approveTimeCard(params.data.id)}} />)
        }else{
          return null
        }
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


    const [ISadminTCsearch,setISadminTCsearch]= useState(false)
    
    
    function tabChange(e){
      if(e == 1){
        setISadminTCsearch(false)
      }
      if(e == 2){
        setISadminTCsearch(true)
      }

    }

  const [myTCsearchData, myTCsetSearchData] = useState({
    "approval":"",
    "dateFrom":"",
    "dateTo":"",
})
const [myTCpreviousSearchData, myTCsetPreviousSearchData] = useState({
  "approval":"",
  "dateFrom":"",
  "dateTo":"",
})

function searchInputHandeler(e){
  if(ISadminTCsearch){
    allTCsetSearchData({...allTCsearchData,  [e.target.name] : e.target.value})
  }
  else{
    myTCsetSearchData({...myTCsearchData,  [e.target.name] : e.target.value})
  }   

}
const [allTCsearchData, allTCsetSearchData] = useState({
  "employeeId":"",
  "approval":"",
  "dateFrom":"",
  "dateTo":"",
})
const [allTCpreviousSearchData, allTCsetPreviousSearchData] = useState({
"employeeId":"",
"approval":"",
"dateFrom":"",
"dateTo":"",
})

function search(){
  // clearSearchFields()
  if(ISadminTCsearch){
    // console.log("all tc")
    // console.log(allTCsearchData)
    allTCsetPreviousSearchData(allTCsearchData)
    getAlltc(pos,allTCsearchData)

  }
  else{
    // console.log("my tc")
    // console.log(myTCsearchData)
    myTCsetPreviousSearchData(myTCsearchData)
    getAlltc(pos,myTCsearchData)
  }
}

  const EmployeeDropdown = useRef(null)
  const dateToChooser = useRef(null)
  const dateFromChooser = useRef(null)
  const status = useRef(null)


  function clearSearchFields(){
    // console.log(EmployeeDropdown)
    EmployeeDropdown.current.selectedIndex=0
    status.current.selectedIndex=0
    dateToChooser.current.value=""
    dateFromChooser.current.value=""

}

function SaveAsCSV(){
  if(ISadminTCsearch){
    allTCgridRef.current.api.exportDataAsCsv()
  }else{
    myTCgridRef.current.api.exportDataAsCsv()
  }
}

    useEffect(() => {
        autoLogin()
        setORGnPOS()

        
    }, [])

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
            
          {/* search */}
          <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="row" id = "location-form">
                        {ISadminTCsearch?
                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Employee</Form.Label>
                            <Form.Select aria-label="Default select example" ref={EmployeeDropdown}  name="employeeId" onChange={(e) => searchInputHandeler(e)}>
                            <EmployeeList  />
                            </Form.Select>
                            </div>: null}

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Date From</Form.Label>
                            <Form.Control type="date" placeholder=""  ref={dateFromChooser} name="dateFrom" onChange={(e) => searchInputHandeler(e)}/>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Date To</Form.Label>
                            <Form.Control type="date" placeholder="" name="dateTo" ref={dateToChooser} onChange={(e) => searchInputHandeler(e)}/>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Status</Form.Label>
                            <Form.Select aria-label="Default select example"  ref={status} name="approval" onChange={(e) => searchInputHandeler(e)}>
                            <option value =''></option>
                              <option value ='Pending'>Pending</option>
                              <option value ='Approved'>Approved</option>
                            </Form.Select>
                            </div>
                        
                            
                            <div className="col" id="searchFormElement">
                                <div className="row">
                                <Button variant="outline-primary" type="button" onClick={() => search()}>Search</Button>
                                {/* <Button variant="outline-info" type="button" onClick={() => getAllReports()}>Search All</Button> */}
                                </div>
                                {(allTC.length > 0)? 
                                <div className="row">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-black" id="dropdown-basic">
                                            Export File
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="text-center">
                                            <Dropdown.Item onClick={()=>SaveAsCSV()}>CSV <img src="https://cdn-icons-png.flaticon.com/512/6133/6133884.png" alt="CSV" className="csv-logo"/></Dropdown.Item>
                                            <Dropdown.Item >PDF <img src="https://cdn-icons-png.flaticon.com/512/3143/3143460.png" className="pdf-logo" alt=""/></Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown> 
                                </div>
                                : null}
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  




            <Tabs
            defaultActiveKey="1"
            id="uncontrolled-tab-example"
            className="mb-3"
            onSelect={(e) =>tabChange(e)}
            >
            <Tab eventKey="1" title="My Time Cards" >

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
                <Tab eventKey="2" title="All Time Cards" onClick={()=>clearSearchFields()}>
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