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
import { useLocation } from 'react-router-dom'

export default function TimeCards({autoLogin}) {
   
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
        shiftType:"",
      });

    function inputChangeHandlerTimeCardData(e){
        setTimeCardData({...timeCardData,  [e.target.name] : e.target.value})
    }

    async function timeCardSubmit(){
      console.log(timeCardData)
        if(timeCardData.id !=""){
          editedtimeCardSubmit()
          
        }
        else{
        let response = await post(API_URL + "/addTimeCard", {
            token: localStorage.getItem("token"),
            start:timeCardData.startDate+" "+timeCardData.startTime+":00",
            end:timeCardData.endDate+" "+timeCardData.endTime+":00",
            note:timeCardData.note,
            org:thisFeaturePerms.org,
            shiftName: timeCardData.shiftType,
            })

        if(response.status === 200){
            toast.success(response.message)
            handleClose()
            
        }else{
            toast.warning(response.message)
        }

        setTimeCardData({
          startDate:"",
          startTime:"00:00",
          endDate:"",
          endTime:"00:00",
          note:"",
          id:"",
          shiftType:'',
        })
      }
      getAlltc()
    }

    const[atcPerm, setAtcPerm] =useState(false);
    async function setORGnPOS(){
        const atcPerm_response = (await get(API_URL + "/getPermision?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org+"&featureName=All Time Cards"));
        // console.log(atcPerm_response)
        let atc_access = atcPerm_response.permission.view && !atcPerm_response.permission.blackListed;
        console.log(atcPerm_response.permission.view)
        setAtcPerm(atc_access)
        getAlltc()
    }
    const[myTC,setMYtc]=useState([])
    const[allTC,setALLtc]=useState([])

    async function getAlltc(){
      let responseALL = null
          responseALL = await get(API_URL + "/getTimeCards?token=" +  localStorage.getItem("token")+
          "&admin_emp="+allTCpreviousSearchData.employeeId+
          "&admin_dateFrom="+allTCpreviousSearchData.dateFrom+
          "&admin_dateTo="+allTCpreviousSearchData.dateTo+
          "&admin_status="+allTCpreviousSearchData.approval+
          "&org="+thisFeaturePerms.org+
          "&dateFrom="+myTCpreviousSearchData.dateFrom+
          "&dateTo="+myTCpreviousSearchData.dateTo+
          "&status="+myTCpreviousSearchData.approval)
      console.log(responseALL)
      if(responseALL.status == 200) {
        var data = "0";
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
        if(data!="0"){
          setMYtc(data)
          tableResize()
        }

        data = "0";
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
        if(data!="0"){
          setALLtc(data)
          tableResize()
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
    shiftType:data.shiftName,
  })
  console.log(data.end.split("/")[1].replaceAll(' ', ''))

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
      org:thisFeaturePerms.org,
      shiftName: timeCardData.shiftType,
      })

  if(response.status === 200){
      toast.success(response.message)
      handleClose()
  }else{
      toast.warning(response.message)
  }
  getAlltc()
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

  let response = await post(API_URL + "/clearTimeCard", {token: localStorage.getItem("token"),TimecardID: timeCardID,
  org:thisFeaturePerms.org})
  if(response.status === 200){
    toast.success(response.message)
  }else{
    toast.warning(response.message)
  }
  getAlltc()
 }
 const reportColumnDef = [
  {field: 'submitedDate', headerName: 'Submited Date' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
  {field: 'start', headerName: 'Start' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
  {field: 'end', headerName: 'End' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
  {field: 'duration', headerName: ' Duration' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
  {field: 'approval', headerName: 'Status' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
  {field: 'note', headerName: 'Note' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
  {field: 'shiftName', headerName: 'Shift Type' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
 ]


 const myTCgridRef = useRef(null);
 const myTCdefaultColDef= { resizable: true}
 const myTCcolumnDefs = [
    {field: 'submitedDate', headerName: 'Submited Date' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'start', headerName: 'Start' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'end', headerName: 'End' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'duration', headerName: ' Duration' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'approval', headerName: 'Status' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'note', headerName: 'Note' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
    {field: 'shiftName', headerName: 'Shift Type' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
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
    let response = await post(API_URL + "/approveTimeCard", {token: localStorage.getItem("token"),TimecardID: timeCardID,
    org:thisFeaturePerms.org})
    if(response.status === 200){
      toast.success(response.message)
    }else{
      toast.warning(response.message)
    }
    // console.log(pos)
    getAlltc(atcPerm,allTCpreviousSearchData)

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
      {field: 'shiftName', headerName: 'Shift Type' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
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
    const [reportView, setReportView]= useState(false)
    
    
    function tabChange(e){
      setReportView(false)
      if(e == 1){
        setISadminTCsearch(false)
        getAlltc(myTCpreviousSearchData)
      }
      if(e == 2){
        setISadminTCsearch(true)
        getAlltc(allTCpreviousSearchData)
      }
      if(e==3){
        setReportView(true)
        getReport()
        setReportSearchData(previousReportSearchData)
      }
      tableResize()

    }
    function tableResize(){
      if(!reportView){
        if(ISadminTCsearch){
          if(allTCgridRef.current!= null){
            allTCgridRef.current.api.sizeColumnsToFit();
          }
        }else{
          if(myTCgridRef.current != null){
            myTCgridRef.current.api.sizeColumnsToFit();
          }
        }
      }
      
    }

  const [myTCsearchData, myTCsetSearchData] = useState({
    "approval":"Pending",
    "dateFrom":"",
    "dateTo":"",
})
const [myTCpreviousSearchData, myTCsetPreviousSearchData] = useState({
  "approval":"Pending",
  "dateFrom":"",
  "dateTo":"",
})

function searchInputHandeler(e){
  if(reportView){
    setReportSearchData({...reportSearchData,  [e.target.name] : e.target.value})
  }
  else{
    if( ISadminTCsearch){
      allTCsetSearchData({...allTCsearchData,  [e.target.name] : e.target.value})
    }
    else{
      myTCsetSearchData({...myTCsearchData,  [e.target.name] : e.target.value})
    }  
  } 

}
const [allTCsearchData, allTCsetSearchData] = useState({
  "employeeId":"",
  "approval":"Pending",
  "dateFrom":"",
  "dateTo":"",
})
const [allTCpreviousSearchData, allTCsetPreviousSearchData] = useState({
"employeeId":"",
"approval":"Pending",
"dateFrom":"",
"dateTo":"",
})

function search(){
  // clearSearchFields()
  if(reportView){
    console.log(reportSearchData)
    setPreviousReportSearchData(reportSearchData)
    getReport()
  }
  else{
    if(ISadminTCsearch){
      allTCsetPreviousSearchData(allTCsearchData)
      getAlltc()
  
    }
    else{
      myTCsetPreviousSearchData(myTCsearchData)
      getAlltc()
    }
  }
  
}

  const EmployeeDropdown = useRef(null)
  const dateToChooser = useRef(null)
  const dateFromChooser = useRef(null)
  const status = useRef(null)
  const shiftSelect = useRef(null)


  function clearSearchFields(){
    if(ISadminTCsearch){
      EmployeeDropdown.current.selectedIndex=0
    }
    if(reportView){
      shiftSelect.current.selectedIndex=0
    }else{
      status.current.selectedIndex=0
    }
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


    function showAndClear(){
      handleShow()
      setTimeCardData({
        startDate:"",
        startTime:"00:00",
        endDate:"",
        endTime:"00:00",
        note:"",
        id:"",
        shiftType:"",
      })
    }
    const [shifts, setShifts] = useState([]);


    async function getShifts(){
      let response = await get(API_URL + "/getShifts?token=" +  localStorage.getItem("token"))
      setShifts(response.shifts)
  }

  const [reportData, setReportData]=useState([])

  const [reportSearchData, setReportSearchData] = useState({
    "employeeId":"",
    "dateFrom":"",
    "dateTo":"",
    "shiftName":"",
  })
  const [previousReportSearchData, setPreviousReportSearchData] = useState({
  "employeeId":"",
  "dateFrom":"",
  "dateTo":"",
  "shiftName":"",
  })
  


  async function getReport(){
    console.log(previousReportSearchData)
    let response =  await get(API_URL + "/getTimeCardReport?token=" +  localStorage.getItem("token")+
          "&emp="+reportSearchData.employeeId+
          "&dateFrom="+reportSearchData.dateFrom+
          "&dateTo="+reportSearchData.dateTo+
          "&org="+thisFeaturePerms.org+
          "&shift="+reportSearchData.shiftName)
    if(response.status == 200){
      console.log(response.report)
      setReportData(response.report.reports)
    }else{
      toast.warning(response.message)
    }

  }
  function reportMobileViewTimeCards(tcs){
    let sortedfTC = []
    for(let x = 0; x< tcs.length; x++){
      if(tcs[x].approval =="Pending" ){
        sortedfTC.push(tcs[x])
      }
    }
    for(let x = 0; x< tcs.length; x++){
      if(tcs[x].approval =="Approved" ){
        sortedfTC.push(tcs[x])
      }
    }


    return(
      sortedfTC.map(element => {
      return(
      <MobileTableCards keyNum ={tcs.indexOf(element)}  data={element} editTimeCard={editTimeCard} deleteTimeCard={deleteTimeCard} approveTimeCard={approveTimeCard}  admin={true}/>
     ) }))
  }




  const location = useLocation()
  const { thisFeaturePerms } = location.state

  useEffect(() => {
    autoLogin()
    getShifts()
    setORGnPOS()
      
  }, [myTCgridRef,allTCgridRef])


    return (
        <div className="incident-page" >
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
                        {ISadminTCsearch || reportView?
                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Employee</Form.Label>
                            <Form.Select aria-label="Default select example" ref={EmployeeDropdown}  name="employeeId" onChange={(e) => searchInputHandeler(e)}>
                            <EmployeeList org ={thisFeaturePerms.org}  />
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
                          {reportView?
                          <div className="col" id="searchFormElement">
                          <Form.Label className=" d-flex justify-content-start">Shift</Form.Label>
                          <Form.Select aria-label="Default select example"  ref={shiftSelect} name="shiftName" onChange={(e) => searchInputHandeler(e)}>
                          <option value =''></option>
                          {
                            shifts.map((item) => {
                              if(item.orgName ==thisFeaturePerms.org ){
                                    return (<option key={item.shiftName }   >{item.shiftName}</option>)
                                }
                              }
                            )
                          }
                            
                          </Form.Select>
                          </div>
                          :
                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Status</Form.Label>
                            <Form.Select aria-label="Default select example"  ref={status} name="approval" onChange={(e) => searchInputHandeler(e)}>
                            <option value =''></option>
                              <option value ='Pending'>Pending</option>
                              <option value ='Approved'>Approved</option>
                            </Form.Select>
                            </div>}
                        
                            
                            <div className="col" id="searchFormElement">
                                <div className="row">
                                <Button variant="outline-primary" type="button" onClick={() =>search()}>Search</Button>
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
            {atcPerm? 
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
            {atcPerm? 
                <Tab eventKey="3" title="Time Card Report" onClick={()=>clearSearchFields()}>
                   {/* desktop view */}
                  <div className="" >
                    <div className="ag-theme-alpine incident-grid">


                      <Accordion defaultActiveKey="0" >
                        {reportData.map((report)=>{
                          report.timeCards = report.timeCards.map((tc)=>{
                            if(tc.approval){
                              tc.approval ="Approved"
                            }else{
                              tc.approval ="Pending"
                            }
                            return tc
                          })
                          return (
                            <Accordion.Item keyNum ={reportData.indexOf(report)}  >
                              <Accordion.Header >{report.who}</Accordion.Header>
                              <Accordion.Body>
                                {
                                  report.hourReport.map((hourR)=>{
                                    return(
                                      <Form.Label className=" d-flex justify-content-start">{hourR.shiftName +": "+hourR.hour} </Form.Label>
                                    )
                                  })
                                }
                                <div className="d-none d-xxl-block" >
                                  <div className="ag-theme-alpine incident-grid">
                                    
                                          <AgGridReact
                                            // ref={allTCgridRef}
                                            columnDefs={allTCcolumnDefs}
                                            defaultColDef={allTCdefaultColDef}
                                            rowData={report.timeCards}
                                            >
                                          </AgGridReact>


                                  </div>
                                </div>
                                {/* Mobile View */}
                              <div className="d-block d-xxl-none" >
                                                                
                                <Accordion defaultActiveKey="0" >
                                  {reportMobileViewTimeCards(report.timeCards)}
                              </Accordion>

                              </div>
                              
                              </Accordion.Body>
                            </Accordion.Item>
                          )
                        })
                          
                        }
                      </Accordion>
                      


                    </div>
                  </div>

                  {/* Mobile View */}
                  <div className="d-block d-xxl-none" >
                    <div className="ag-theme-alpine incident-grid">
                      
                    {/* <Accordion defaultActiveKey="0" >
                      {allTCshowMobileViewTimeCards()}
                  </Accordion> */}

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
                <Modal.Title>Time Card</Modal.Title>
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
                <div className="row" id="margin">
                <Form.Label className=" d-flex justify-content-start"><strong>Shift Type:</strong></Form.Label>
                {/* <Form.Control   as="textarea" value={timeCardData.shiftType} rows={3} onChange={(e)=>inputChangeHandlerTimeCardData(e)} name = {"shiftType"}/> */}
                <Form.Select  name="shiftType" onChange={(e)=>inputChangeHandlerTimeCardData(e)}>
			<option key=""></option>
                  {
                      shifts.map((item) => {
                        if(item.orgName ==thisFeaturePerms.org ){
                          if(item.shiftName ==timeCardData.shiftType ){
                              return (
                                  <option key={item.shiftName} selected={true}   >{item.shiftName}</option>
                                  )
                          }
                          else{
                              return (
                                  <option key={item.shiftName }   >{item.shiftName}</option>
                                  )
                          }
                          
                          }})
                        
                  }
              </Form.Select>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={()=>timeCardSubmit()}>Submit</Button>
            </Modal.Footer>
            </Modal>
    

        </div>
    )
}
