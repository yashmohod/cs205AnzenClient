import React, {useCallback, useEffect, useRef, useState,useMemo } from "react";
import './Records.css'
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import { API_URL, get, post } from '../../../Utils/API';
import DeleteButton from '../../../Components/Buttons/DeleteButton'
import EditButton from '../../../Components/Buttons/EditButton'
import { Form } from "react-bootstrap";
import {Button} from "rsuite"
import { ToastContainer, toast } from 'react-toastify';
import SaspIncidents from "../../../Components/SaspIncidents/SaspIncidents"
import SaspLocations from "../../../Components/SaspLocations/SaspLocations"
import EmployeeList from "../../../Components/EmployeeList/EmployeeList"
import CommonButton from '../../../Components/Buttons/CommonButton'
import Modal from 'react-bootstrap/Modal';
import TimePicker24H from "../../../Components/TimePicker24H/TimePicker24H"
import { Dropdown } from 'rsuite';
import Referals from "../Referals/Referals";
import { GridApi } from "ag-grid-community";
import { useLocation } from 'react-router-dom'
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
  } from '@chakra-ui/react'
import Exporter from "../../../Components/Exporter/Exporter";
import { defineColumns } from "../../../Utils/AG-Grid";

export default function Records({autoLogin,fullVersion,reportID}) {
    const columnHeaders = ["Date\t", "Incident\t", "Location\t",  "Loc. Details\t", "Received Time\t", "Enroute Time\t", "Arrived Time\t", "Clear Time\t", "Reported By\t", "Summary\t"]
    const columnKeys = ["date", "incident", "location", "locationDetail", "receivedTime", "enrouteTime", "arivedTime", "clearTime", "reportedByName", "summary"]
    // edit records 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // view refs 
    const [showref, setShowref] = useState(false);
    const handleCloseref = () => setShowref(false);
    const handleShowref = () => setShowref(true);

    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const[columnDefs,setColumnDefs]= useState([])

    const [formData, setFormData] = useState({
        reportID:'',
        incident: "",
        date: "",
        receivedTime: "00:00",
        enrouteTime: "00:00",
        arivedTime: "00:00",
        clearTime: "00:00",
        location: "",
        locationDetail: "",
        summary: "",
      });

    async function reportChangeSubmit(){
        //editSaspReport

        let response = await post(API_URL + "/editSaspReport", {
            token: localStorage.getItem("token"),
            reportID:formData.reportID,
            incident: formData.incident,
            date:  formData.date,
            receivedTime: formData.receivedTime,
            enrouteTime: formData.enrouteTime,
            arivedTime:  formData.arivedTime,
            clearTime: formData.clearTime,
            location:  formData.location,
            locationDetail: formData.locationDetail,
            summary: formData.summary,
            })
        if(response.status ==200){
            toast.success(response.message)
            handleClose()
            if(fullVersion){    
                getReps(previousSearchData)
            }else{
                // getRep(reportID)
            }
        }else{
            toast.warning(response.message)
        }
    }
    function reportInputChangeHandler(e){
        setFormData({...formData,  [e.target.name] : e.target.value})
    }


    const [searchData, setSearchData] = useState({
        "employeeId":"",
        "location":"",
        "incident":"",
        "dateFrom":"",
        "dateTo":"",
    })
    const [previousSearchData, setPreviousSearchData] = useState({
        "employeeId":"",
        "location":"",
        "incident":"",
        "dateFrom":"",
        "dateTo":"",
    })

    async function getReps(sData){
        setPreviousSearchData(sData)

        let response = await post(API_URL + "/getSaspReports", {
            token: localStorage.getItem("token"),
            employeeId:sData.employeeId,
            location:sData.location,
            incident:sData.incident,
            dateTo:sData.dateTo,
            dateFrom:sData.dateFrom,
            })
        if(response.status == 200){
            let data = response.SaspIncidentReports;

            // data formating
            data = data.map((item)=>{
            var date = item.date.split(' ');
            item.date = date[0]
            return(
                item
            )
             })
            setRowData(data);
            gridRef.current.api.sizeColumnsToFit();
        }
    }

    // async function getRep(repID){

    //     let response = await get(API_URL + "/getSaspReport?token="+localStorage.getItem("token")+"&reportID="+repID)
    //     if(response.status == 200){
    //         let data = response.SaspIncidentReport;
    //         // data formating
    //         var date = data.date.split(' ');
    //         data.date = date[0]
    //         gridRef.current.api.sizeColumnsToFit();
    //         setRowData([data]);
    //     }
    // }

   


    // async function getAllReports(){
    //     let response = await post(API_URL + "/getSaspReports", {
    //         token: localStorage.getItem("token"),
    //         employeeId:"",
    //         location:"",
    //         incident:"",
    //         dateTo:"",
    //         dateFrom:"",
    //         })
        
    //     let data = response.SaspIncidentReports;
    //     setPreviousSearchData({
    //         "employeeId":"",
    //         "location":"",
    //         "incident":"",
    //         "dateFrom":"",
    //         "dateTo":"",
    //     })
    //     // date formating
    //     data = data.map((item)=>{
    //         var date = item.date.split(' ');
    //         item.date = date[0]
    //         return(
    //             item
    //         )
    //     })
    //     setRowData(data);
    //     gridRef.current.api.sizeColumnsToFit();
    //     clearSearchFields()
    // }

    function searchInputHandeler(e){
        setSearchData({...searchData,  [e.target.name] : e.target.value})   

    }

    const EmployeeDropdown = useRef(null)
    const incidentDropdown = useRef(null)
    const LocationDropdown = useRef(null)
    const dateToChooser = useRef(null)
    const dateFromChooser = useRef(null)

    function clearSearchFields(){
        EmployeeDropdown.current.selectedIndex=0
        incidentDropdown.current.selectedIndex=0
        LocationDropdown.current.selectedIndex=0
        dateToChooser.current.value=""
        dateFromChooser.current.value=""
    }

    const {loadedColumnDefs : miniverFeatures}  = useCallback(defineColumns({
        columnKeys: columnKeys,
        columnHeaders: columnHeaders
    }))

    const fullverFeatures = [
        {field: 'id', 
    headerName: '' ,
    cellRenderer: CommonButton, 
    cellRendererParams: {
      clicked: function(field) {
        viewReferals(field)
      },
      buttonText: "View Referals",
      variant:"outline-dark",
    }},
    ]

    const [Edit_column, setEdit_columns] = useState(
    {field: 'id', 
    headerName: '' ,
    cellRenderer: EditButton, 
    cellRendererParams: {
      clicked: function(field) {
        reportEdit(field)
      }
    }},
    );
    const [Delete_column, setDelete_columns] = useState(
        {field: 'id',
        headerName: '' ,
        cellRenderer: DeleteButton, 
        cellRendererParams: {
          clicked: function(field) {
            reportDelete(field)
          }
        }});

    async function reportDelete(reportId){
        let response = await post(API_URL + "/deleteSaspReports", {reportID:reportId,token: localStorage.getItem("token")})
        if(response.status== 200){
            toast.success(response.message)
            if(fullVersion){    
                getReps(previousSearchData)
            }else{
                // getRep(reportID)
            }
        }else{
            toast.warning(response.message)
        }
    }

    async function reportEdit(reportId){
        let response = await get(API_URL + "/getSaspReport?token=" +  localStorage.getItem("token")+"&reportID="+reportId)
        let oldData = response.SaspIncidentReport;
        console.log(oldData)
        let data = {
        reportID:reportId,
        incident: oldData.incident,
        date:  oldData.date,
        receivedTime: oldData.receivedTime,
        enrouteTime: oldData.enrouteTime,
        arivedTime:  oldData.arivedTime,
        clearTime: oldData.clearTime,
        location:  oldData.location,
        locationDetail: oldData.locationDetail,
        summary: oldData.summary,
        }
        setFormData(data)
        handleShow()
    }
    const [reportIdForRef,setreportIdForRef]= useState("")
    function viewReferals(reportID){
        setreportIdForRef(reportID)
        handleShowref()
    }


    // const [org,setOrg] = useState("")
    // const [pos,setPos]= useState("")

    const location = useLocation()
    const { thisFeaturePerms } = location.state

    async function setThisFeature(){

        //set mini version feature
        let cols = miniverFeatures
        //set full version features
        if(fullVersion){
            for(let i=0; i<fullverFeatures.length; i++){
                cols.push(fullverFeatures[i])
            }


        }
        if(thisFeaturePerms.edit){
            cols.push(Edit_column);
        } 
        if(thisFeaturePerms.delete){
            cols.push(Delete_column);
        } 



        setColumnDefs(cols);
        gridRef.current.api.sizeColumnsToFit();

    }



    useEffect(() => {
        autoLogin();
        setThisFeature();
    }, [])

    return (
        <div className="location-page">
            {fullVersion?
            <>
             <ToastContainer />
             </>
             :null}

             

            <h1>Records</h1>
            {fullVersion?
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="row" id = "location-form">
                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Employee</Form.Label>
                            <Form.Select aria-label="Default select example" ref={EmployeeDropdown}  name="employeeId" onChange={(e) => searchInputHandeler(e)}>
                            <EmployeeList  />
                            </Form.Select>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Incident</Form.Label>
                            <Form.Select aria-label="Default select example"  ref={incidentDropdown} name="incident" onChange={(e) => searchInputHandeler(e)}>
                            <SaspIncidents  />
                            </Form.Select>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Location</Form.Label>
                            <Form.Select aria-label="Default select example" ref={LocationDropdown} name="location" onChange={(e) => searchInputHandeler(e)}>
                            <SaspLocations />
                            </Form.Select>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Date From</Form.Label>
                            <Form.Control type="date" placeholder=""  ref={dateFromChooser} name="dateFrom" onChange={(e) => searchInputHandeler(e)}/>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Date To</Form.Label>
                            <Form.Control type="date" placeholder="" name="dateTo" ref={dateToChooser} onChange={(e) => searchInputHandeler(e)}/>
                            </div>
                        
                            
                            <div className="col" id="searchFormElement">
                                <div className="row">
                                <Button appearance="primary" color="blue" type="button" onClick={() => getReps(searchData)}>Search</Button>
                                {/* <Button variant="outline-info" type="button" onClick={() => getAllReports()}>Search All</Button> */}
                                </div>
                   
                        
                                    {/* <Dropdown>
                                        <Dropdown.Toggle variant="outline-black" id="dropdown-basic">
                                            Export File
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu className="text-center">
                                            <Dropdown.Item onClick={()=>SaveAsCSV()} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                            <div>
                                                <img src="https://cdn-icons-png.flaticon.com/512/6133/6133884.png" alt="CSV" className="csv-logo" width={30} height={30}/>
                                            </div>
                                            <div className="ms-2">
                                                CSV 
                                            </div>
                                            
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => SaveAsPDF()} style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                            <div>
                                                <img src="https://cdn-icons-png.flaticon.com/512/3143/3143460.png" className="pdf-logo" alt="" width={30} height={30}/> 
                                            </div>
                                            <div className="ms-2">
                                                PDF
                                            </div>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>  */}
               
                                   <Exporter {...{gridRef: gridRef, columnHeaders: columnHeaders, rowData: rowData, keys: columnKeys}}/>
                  
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>:null}

       
            <Stat>
                <StatLabel>Results   <StatNumber>{rowData.length}</StatNumber></StatLabel>
            </Stat>                        
            <div className="ag-theme-alpine incident-grid">
        
              <AgGridReact
                ref={gridRef}
                columnDefs={columnDefs}
                defaultColDef={{sortable: true}}
                rowData={rowData}
                >
              </AgGridReact>


			</div>
            <Modal
              show={show}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Report Edit</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                <div className="register-form">
                  
                  <Form.Label className=" d-flex justify-content-start">Incident</Form.Label>
                  <Form.Select aria-label="Default select example"  name="incident" onChange={(e) => reportInputChangeHandler(e)}>
                  <SaspIncidents selected = {formData.incident}  />
                  </Form.Select>
              
                  <Form.Label className=" d-flex justify-content-start">Date </Form.Label>
                  <Form.Control type="date" value={formData.date} name="date" onChange={(e) => reportInputChangeHandler(e)}/>

                  <Form.Label className=" d-flex justify-content-start">Recived Time </Form.Label>
                  <TimePicker24H time = {formData.receivedTime} inputChangeHandler={ reportInputChangeHandler} name = {"receivedTime"}/>

                  <Form.Label className=" d-flex justify-content-start">Enroute Time </Form.Label>
                  <TimePicker24H time = {formData.enrouteTime} inputChangeHandler={ reportInputChangeHandler} name = {"enrouteTime"}/>
                  
                  <Form.Label className=" d-flex justify-content-start">Arrived Time </Form.Label>
                  <TimePicker24H time = {formData.arivedTime} inputChangeHandler={ reportInputChangeHandler} name = {"arivedTime"}/>

                  <Form.Label className=" d-flex justify-content-start">Clear Time </Form.Label>
                  <TimePicker24H time = {formData.clearTime} inputChangeHandler={ reportInputChangeHandler} name = {"clearTime"}/>

                  <Form.Label className=" d-flex justify-content-start">Location</Form.Label>
                  <Form.Select aria-label="Default select example" name="location" onChange={(e) => reportInputChangeHandler(e)}>
                  <SaspLocations selected = {formData.location} />
                  </Form.Select>

                  <Form.Label className=" d-flex justify-content-start">Location Detail</Form.Label>
                  <Form.Control type="text" placeholder="" value={formData.locationDetail} name="locationDetail" onChange={(e) => reportInputChangeHandler(e)}/>

                  <Form.Label className=" d-flex justify-content-start">Summary</Form.Label>
                  <Form.Control as="textarea" placeholder="" value={formData.summary} name="summary" onChange={(e) => reportInputChangeHandler(e)}/>
                  </div>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={()=>reportChangeSubmit()}>Submit</Button>
              </Modal.Footer>
            </Modal>


            <Modal
              show={showref}
              onHide={handleCloseref}
              backdrop="static"
              keyboard={false}
              fullscreen={true}
            >
              <Modal.Header closeButton>
                <Modal.Title>New Password</Modal.Title>
              </Modal.Header>
              <Modal.Body>

            <Referals autoLogin={() => autoLogin()} fullVersion={false} reportID={reportIdForRef}/>


            </Modal.Body>
            </Modal>
        </div>
    )
}


