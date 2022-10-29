import React, {useCallback, useEffect, useRef, useState,useMemo } from "react";
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
import Dropdown from 'react-bootstrap/Dropdown';
import Referals from "../Referals/Referals";
export default function Records({setLoggedIn, loggedInUser, autoLogin,fullVersion,reportID}) {
    
    // edit records 
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    // view refs 
    const [showref, setShowref] = useState(false);
    const handleCloseref = () => setShowref(false);
    const handleShowref = () => setShowref(true);

    const gridRef = useRef(null); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
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






  
    const [miniverFeatures, setminiverFeatures] = useState([
    {field: 'date',headerName:'Date'},
    {field: 'incident',headerName:'Incident'},
    {field: 'location',headerName:'Location'},
    {field: 'locationDetail',headerName:'Loc. Details'},
    {field: 'receivedTime',headerName:'Recived Time'},
    {field: 'enrouteTime',headerName:'Enroute Time'},
    {field: 'arivedTime',headerName:'Arrived Time'},
    {field: 'clearTime',headerName:'Clear Time'},
    {field: 'reportedByName',headerName:'Reported By'},
    {field: 'summary',headerName:'Summary'},

    ])

    const [fullverFeatures, setfullverFeatures] = useState([
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
    ])

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


    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true
    }));

    function SaveAsCSV(){
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Incident,Date,ReceivedTime,EnrouteTime,ArivedTime,ClearTime,Location,LocationDetail,Summary,"  + "\r\n";
        rowData.forEach(function(rowArray) {
            let row = rowArray.incident+","+rowArray.date+","+rowArray.receivedTime+","+rowArray.enrouteTime+","+rowArray.arivedTime+","+rowArray.clearTime+","+rowArray.location+","+","+rowArray.locationDetail+","+","+rowArray.summary
            
            csvContent += row + "\r\n";
        });
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
    }
    // const [org,setOrg] = useState("")
    // const [pos,setPos]= useState("")



    async function getOrgNPos(){
        const orgres = (await get(API_URL + "/getOrganization?token=" +  localStorage.getItem("token")))
        const posres = (await get(API_URL + "/getPosition?token=" +  localStorage.getItem("token")))
        let locOrg = orgres["organization"]
        let locPos = posres["position"]
        // setOrg(locOrg)
        // setPos(locPos)

        //set mini version features
        setColumnDefs( miniverFeatures);
        //set full version features
        if(fullVersion){
            let cols = miniverFeatures
            for(let i=0; i<fullverFeatures.length; i++){
                cols.push(fullverFeatures[i])
            }
            setColumnDefs(cols);

        }
        //set admin version features
        if(locPos== "admin"){
            let cols = miniverFeatures
            for(let i=0; i<morecolumns.length; i++){
                cols.push(morecolumns[i])
            }
            setColumnDefs(cols);

        }

        gridRef.current.api.sizeColumnsToFit();

    }



    useEffect(() => {
        autoLogin();
        getOrgNPos();
        // if(!fullVersion){getRep(reportID)}
        
    }, [])


    return (
        <div className="location-page">
            {fullVersion?
            <>
            <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
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
                                <Button variant="outline-primary" type="button" onClick={() => getReps(searchData)}>Search</Button>
                                {/* <Button variant="outline-info" type="button" onClick={() => getAllReports()}>Search All</Button> */}
                                </div>
                                {(rowData.length > 0)? 
                                <div className="row">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-black" id="dropdown-basic">
                                            Export File
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={()=>SaveAsCSV()}>CSV </Dropdown.Item>
                                            <Dropdown.Item >PDF</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown> 
                                </div>
                                : null}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>:null}

       
        
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

            <Referals setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()} fullVersion={false} reportID={reportIdForRef}/>


            </Modal.Body>
            </Modal>
        </div>
    )
}


