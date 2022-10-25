import React, {Component, useEffect, useRef, useState,useMemo } from "react";
import Nav from "../../../Components/Nav/Nav";
import './Records.css'
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import { API_URL, get, post } from '../../../Utils/API';
import DeleteButton from '../../../Components/Buttons/DeleteButton'
import EditButton from '../../../Components/Buttons/EditButton'
import { Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import SaspIncidents from "../../../Components/SaspIncidents/SaspIncidents"
import SaspLocations from "../../../Components/SaspLocations/SaspLocations"
import EmployeeList from "../../../Components/EmployeeList/EmployeeList"
import CommonButton from '../../../Components/Buttons/CommonButton'
import Modal from 'react-bootstrap/Modal';
import TimePicker24H from "../../../Components/TimePicker24H/TimePicker24H"
export default function Records({setLoggedIn, loggedInUser, autoLogin}) {
    
    // edit records 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        console.log(formData)
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
            getReports()
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
        "inceident":"",
        "dateFrom":"",
        "dateTo":"",
    })



    async function getReports(){
        let response = await post(API_URL + "/getSaspReports", {
            token: localStorage.getItem("token"),
            employeeId:"",
            location:"",
            inceident:"",
            dateTo:"",
            dateFrom:"",
            })
        // console.log(response)
        let data = response.SaspIncidentReports;
        
        // date formating
        data = data.map((item)=>{
            var date = item.date.split(' ');
            item.date = date[0]
            return(
                item
            )
        })
        setRowData(data);
        return response
    }

    function searchInputHandeler(e){
        setSearchData({...searchData,  [e.target.name] : e.target.value})
    }

    function searchButtonHandeler(){
        // console.log(searchData)
    }




    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
    const[columnDefs,setColumnDefs]= useState([])
  
    const [generalCols, setGeneralCols] = useState([
    {field: 'date'},
    {field: 'inceident'},
    {field: 'location'},
    {field: 'locationDetail'},
    {field: 'receivedTime'},
    {field: 'enrouteTime'},
    {field: 'arivedTime'},
    {field: 'clearTime'},
    {field: 'reportedByName'},
    {field: 'summary'},
    {field: 'id', 
    headerName: '' ,
    cellRenderer: CommonButton, 
    cellRendererParams: {
      clicked: function(field) {
        
      },
      buttonText: "View Referals",
      variant:"outline-dark",
    }},
    ]);

    const [morecolumns, setmoreColumns] = useState([
    {field: 'id', 
    headerName: '' ,
    cellRenderer: EditButton, 
    cellRendererParams: {
      clicked: function(field) {
        reportEdit(field)
      }
    }},
    {field: 'id',
    headerName: '' ,
    cellRenderer: DeleteButton, 
    cellRendererParams: {
      clicked: function(field) {
        reportDelete(field)
      }
    }}]);

    async function reportDelete(reportId){
        let response = await post(API_URL + "/deleteSaspReports", {reportID:reportId,token: localStorage.getItem("token")})
        if(response.status== 200){
            toast.success(response.message)
            getReports()
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
        console.log(data)
        setFormData(data)
        handleShow()
    }



    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true
    }));




    useEffect(() => {
        autoLogin();
        setColumnDefs( generalCols);
        const pos = localStorage.getItem("position")
        if(pos== "admin"){
            let cols = generalCols
            for(let i=0; i<morecolumns.length; i++){
                cols.push(morecolumns[i])
            }
            setColumnDefs(cols);

        }
        getReports();
    }, [])


    return (
        <div className="location-page">
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
             <ToastContainer />
            <h1>Records</h1>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="row" id = "location-form">
                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Employee</Form.Label>
                            <Form.Select aria-label="Default select example"  name="employeeId" onChange={(e) => searchInputHandeler(e)}>
                            <EmployeeList  />
                            </Form.Select>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Incident</Form.Label>
                            <Form.Select aria-label="Default select example"  name="incident" onChange={(e) => searchInputHandeler(e)}>
                            <SaspIncidents  />
                            </Form.Select>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Location</Form.Label>
                            <Form.Select aria-label="Default select example" name="location" onChange={(e) => searchInputHandeler(e)}>
                            <SaspLocations />
                            </Form.Select>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Date From</Form.Label>
                            <Form.Control type="date" placeholder="" name="dateFrom" onChange={(e) => searchInputHandeler(e)}/>
                            </div>

                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Date To</Form.Label>
                            <Form.Control type="date" placeholder="" name="dateTo" onChange={(e) => searchInputHandeler(e)}/>
                            </div>
                            <div className="col" id="searchFormElement">
                                <div>
                                <Button variant="outline-info" type="button" onClick={() => searchButtonHandeler()}>Search All</Button>
                                </div>
                            <Button variant="outline-primary" type="button" onClick={() => searchButtonHandeler()}>Search</Button>
                            <Button variant="outline-dark" type="button" onClick={() => searchButtonHandeler()}>Download File</Button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
          

       
        
            <div className="ag-theme-alpine incident-grid">
        
              <AgGridReact
                ref={gridRef}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
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
                <Modal.Title>New Password</Modal.Title>
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
        </div>
    )
}


