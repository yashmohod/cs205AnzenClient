import React, {useCallback, useEffect, useRef, useState,useMemo } from "react";
import Nav from "../../../Components/Nav/Nav";
import './Referals.css'
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
import Dropdown from 'react-bootstrap/Dropdown';
import CommonButton from '../../../Components/Buttons/CommonButton'
import Modal from 'react-bootstrap/Modal';
import Records from "../Records/Records";
import TimePicker24H from "../../../Components/TimePicker24H/TimePicker24H"
import SaspReferal from "../../../Components/SaspReferal/SaspReferal"
export default function Referals({setLoggedIn, loggedInUser, autoLogin, fullVersion,reportID}) {

    const [Referals, setReferals] = useState("")
    const [searchData, setSearchData] = useState({
        "firstName":"",
        "lastName":"",
        "ICID":"",
        "location":"",
        "incident":"",
        "dateFrom":"",
        "dateTo":"",
        "reportID":"",
    })
    const [prevSearchData, setPrevSearchData] = useState({
        "firstName":"",
        "lastName":"",
        "ICID":"",
        "location":"",
        "incident":"",
        "dateFrom":"",
        "dateTo":"",
        "reportID":"",
    })

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
      function reportInputChangeHandler(e){
        setFormData({...formData,  [e.target.name] : e.target.value})
    }
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
            handleCloserep()
            getRefs(prevSearchData)
            // handleClose()
            // if(fullVersion){    
            //     getReps(previousSearchData)
            // }else{
            //     getRep(reportID)
            // }
        }else{
            toast.warning(response.message)
        }
    }

    async function getRefs(sData){
        setPrevSearchData(sData)
        let response = await post(API_URL + "/getSaspReferals", {
            token: localStorage.getItem("token"),
            firstName:sData.firstName,
            lastName:sData.lastName,
            ICID:sData.ICID,
            employeeId:sData.employeeId,
            location:sData.location,
            incident:sData.incident,
            dateTo:sData.dateTo,
            dateFrom:sData.dateFrom,
            reportID:sData.reportID,
            })
        let data = response.referals;
        
        // date formating
        data = data.map((item)=>{
            var date = item.date.split(' ');
            var dob = item.dob.split(' ');
            item.date = date[0]
            item.dob = dob[0]
            if(item.judicialReferal == true){
                item.judicialReferal = "Yes"
            }else{
                item.judicialReferal = "No"
            }
            return(
                item
            )
        })
        setRowData(data);
        gridRef.current.api.sizeColumnsToFit();
    }



    // async function getAllReferals(){
    //     let response = await post(API_URL + "/getSaspReferals", {
    //         token: localStorage.getItem("token"),
    //         employeeId:"",
    //         location:"",
    //         inceident:"",
    //         dateTo:"",
    //         dateFrom:"",
    //         reportID:"",
    //         })
    //     let data = response.referals;
    //     setPrevSearchData({
    //         "employeeId":"",
    //         "location":"",
    //         "inceident":"",
    //         "dateFrom":"",
    //         "dateTo":"",
    //     })
    //     // date formating
    //     data = data.map((item)=>{
    //         var date = item.date.split(' ');
    //         var dob = item.dob.split(' ');
    //         item.date = date[0]
    //         item.dob = dob[0]
    //         if(item.judicialReferal == true){
    //             item.judicialReferal = "Yes"
    //         }else{
    //             item.judicialReferal = "No"
    //         }
    //         return(
    //             item
    //         )
    //     })
    //     setRowData(data);
    //     gridRef.current.api.sizeColumnsToFit();
    // }


    async function getRefsOFrep(repId){
        let response = await post(API_URL + "/getSaspReferals", {
            token: localStorage.getItem("token"),
            firstName:"",
            lastName:"",
            ICID:"",
            employeeId:"",
            location:"",
            incident:"",
            dateTo:"",
            dateFrom:"",
            reportID:repId,
            })
        console.log(response.referals)
        let data = response.referals;
        
        // date formating
        data = data.map((item)=>{
            var date = item.date.split(' ');
            var dob = item.dob.split(' ');
            item.date = date[0]
            item.dob = dob[0]
            if(item.judicialReferal == true){
                item.judicialReferal = "Yes"
            }else{
                item.judicialReferal = "No"
            }
            return(
                item
            )
        })
        setRowData(data);
        gridRef.current.api.sizeColumnsToFit();
        

        return response
    }

    // view reps
    const [showrep, setShowrep] = useState(false);
    const handleCloserep = () => setShowrep(false);
    const handleShowrep = () => setShowrep(true);

    const [reftIdForRep,setreportIdForRef]= useState("")

    async function viewReport(reportID){
        let response = await get(API_URL + "/getSaspReport?token="+localStorage.getItem("token")+"&reportID="+reportID)
        if(response.status == 200){
            let data = response.SaspIncidentReport;
            // data formating
            var date = data.date.split(' ');
            data.date = date[0]
            setFormData({
                reportID:data.id,
                incident: data.incident,
                date: data.date,
                receivedTime:data.receivedTime,
                enrouteTime: data.enrouteTime,
                arivedTime: data.arivedTime,
                clearTime: data.clearTime,
                location: data.location,
                locationDetail: data.locationDetail,
                summary: data.summary,
              })
            handleShowrep()
        }
    }

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

   

    function searchInputHandeler(e){
        setSearchData({...searchData,  [e.target.name] : e.target.value})
    }





    const gridRef = useRef(null); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
    const[columnDefs,setColumnDefs]= useState([])

    const [miniverFeatures,setMiniverFeatures]=useState([
        {field: 'date'},
        {field: 'incident'},
        {field: 'location'},
        {field: 'judicialReferal'},
        {field: 'firstName'},
        {field: 'lastName'},
        {field: 'middleInitial'},
        {field: 'ICID'},
        {field: 'dob'},
        {field: 'address'},
        {field: 'phoneNo'},
    ])
    const [fullverFeatures,setFullverFeatures]=useState([
        {field: 'reportID', 
    headerName: '' ,
    cellRenderer: CommonButton, 
    cellRendererParams: {
      clicked: function(field) {
        viewReport(field)
      },
      buttonText: "View Report",
      variant:"outline-dark",
    }},
    ])

    const [adminverFeatures, setadminverFeatures] = useState([
    {field: 'id', 
    headerName: '' ,
    cellRenderer: EditButton, 
    cellRendererParams: {
      clicked: function(field) {
        referalEdit(field)
      }
    }},
    {field: 'id',
    headerName: '' ,
    cellRenderer: DeleteButton, 
    cellRendererParams: {
      clicked: function(field) {
        referalDelete(field)
      }
    }}]);


    async function referalDelete(refID){
        let response = await post(API_URL + "/deleteSaspReferal", {referalID:refID,token: localStorage.getItem("token")})
        if(response.status== 200){
            toast.success(response.message)
            if(fullVersion){    
                getRefs(prevSearchData)
            }else{
                getRefsOFrep(reportID)
            }
        }else{
            toast.warning(response.message)
        }
    }

    const [refFormData,setRefFormData] =useState({
        "id":"",
        "firstName":"",
        "middleInitial":"",
        "lastName":"",
        "ICID":"",
        "dob":"",
        "address":"",
        "phoneNo":"",

    })
    function refFormDataInputHandeler(e){
        console.log(e.target.value)
        setRefFormData({...refFormData,  [e.target.name] : e.target.value})
    }
    async function submitEditRefFormData(){
        let response = await post(API_URL + "/editSaspReferal", {
            referalID:refFormData.id,
            firstName:refFormData.firstName,
            middleInitial:refFormData.middleInitial,
            lastName:refFormData.lastName,
            ICID:refFormData.ICID,
            dob:refFormData.dob,
            address:refFormData.address,
            phoneNo:refFormData.phoneNo,
            token: localStorage.getItem("token")})

        if(response.status == 200){
            toast.success(response.message)
            handleCloserefEdit()
        }else{
            toast.warning(response.message)
        }
    }

    const [showrefEdit, setShowrefEdit] = useState(false);
    const handleCloserefEdit = () => setShowrefEdit(false);
    const handleShowrefEdit = () => setShowrefEdit(true);

    async function referalEdit(refID){
        let response = await get(API_URL + "/getSaspReferal?referalID="+refID+"&token="+ localStorage.getItem("token"))
        if(response.status == 200){
            const refdata = response.referal
            
            const temp = {
                "id":refdata.id,
                "firstName":refdata.firstName,
                "middleInitial":refdata.middleInitial,
                "lastName":refdata.lastName,
                "ICID":refdata.ICID,
                "dob":refdata.dob,
                "address":refdata.address,
                "phoneNo":refdata.phoneNo,
            }
            setRefFormData(temp)

            handleShowrefEdit()
        }else{
            toast.warning(response.message)
        }
    }
    

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true
    }));

    const [org,setOrg] = useState("")
    const [pos,setPos]= useState("")

    async function getOrgNPos(){
        const orgres = (await get(API_URL + "/getOrganization?token=" +  localStorage.getItem("token")))
        const posres = (await get(API_URL + "/getPosition?token=" +  localStorage.getItem("token")))
        let locOrg = orgres["organization"]
        let locPos = posres["position"]
        setOrg(locOrg)
        setPos(locPos)

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
            for(let i=0; i<adminverFeatures.length; i++){
                cols.push(adminverFeatures[i])
            }
            setColumnDefs(cols);

        }
    }


    const firstName = useRef(null);
    const lastName = useRef(null);
    const ICID = useRef(null);
    const incidentDropdown = useRef(null);
    const LocationDropdown = useRef(null);
    const dateToChooser = useRef(null);
    const dateFromChooser = useRef(null);

    function clearSearchFields(){
        firstName.current.value = ""
        lastName.current.value = ""
        ICID.current.value = ""
        incidentDropdown.current.selectedIndex=0
        LocationDropdown.current.selectedIndex=0
        dateToChooser.current.value=""
        dateFromChooser.current.value=""
    }
    async function reportDelete(){
        let response = await post(API_URL + "/deleteSaspReports", {reportID:formData.reportID,token: localStorage.getItem("token")})
        if(response.status== 200){
            toast.success(response.message)
            handleCloserep()
        }else{
            toast.warning(response.message)
        }
    }



    useEffect(() => {
        autoLogin();
        getOrgNPos();
        if(reportID!==""){
            getRefsOFrep(reportID)
        }
    }, [])


    return (
        <div className="location-page">
            {fullVersion?
             <><Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} /><ToastContainer /></>: null }
            <h1>Referals</h1>
            {fullVersion?
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="row" id = "location-form">
                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">First name</Form.Label>
                            <Form.Control type="text" placeholder="" name="firstName" onChange={(e) => searchInputHandeler(e)} />
                            </div>
                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">Last name</Form.Label>
                            <Form.Control type="text" placeholder="" name="lastName" onChange={(e) => searchInputHandeler(e)} />
                            </div>
                            <div className="col" id="searchFormElement">
                            <Form.Label className=" d-flex justify-content-start">ICID</Form.Label>
                            <Form.Control type="text" placeholder="" name="ICID" onChange={(e) => searchInputHandeler(e)} />
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
                            <div className="col">
                                <div className="row">
                                <Button variant="outline-primary" type="button" onClick={() => getRefs(searchData)}>Search</Button>
                                {/* <Button variant="outline-info" type="button" onClick={() => getAllReferals()}>Search All</Button> */}
                                </div>
                                </div>
                                <div className="col">
                                {(rowData.length > 0)? 
                                    <Dropdown>
                                        <Dropdown.Toggle variant="outline-black" id="dropdown-basic">
                                            Export File
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={()=>SaveAsCSV()}>CSV </Dropdown.Item>
                                            <Dropdown.Item >PDF</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown> 
                                : null}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
          : null }

       
        
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
              show={showrefEdit}
              onHide={handleCloserefEdit}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Referal</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                                    
            <SaspReferal referalData={refFormData} editVer={true} editInputChangeHandler={refFormDataInputHandeler}/>
            
            <Modal.Footer>
                <Button variant="primary" onClick={()=>submitEditRefFormData()}>Submit</Button>
              </Modal.Footer>

            </Modal.Body>
            </Modal>
            


            <Modal
              show={showrep}
              onHide={handleCloserep}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>View Report</Modal.Title>
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
              {pos=="admin"?
              <Modal.Footer>
                <Button variant="primary" onClick={()=>reportChangeSubmit()}>Submit</Button>
                <Button variant="primary" onClick={()=>reportDelete()}>Delete</Button>
              </Modal.Footer>
              :null}
            </Modal>
           
        </div>
    )
}


