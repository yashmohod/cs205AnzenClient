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
export default function Referals({setLoggedIn, loggedInUser, autoLogin, fullVersion,reportID}) {

    const [Referals, setReferals] = useState("")
    const [searchData, setSearchData] = useState({
        "employeeId":"",
        "location":"",
        "inceident":"",
        "dateFrom":"",
        "dateTo":"",
    })
    const [prevSearchData, setPrevSearchData] = useState({
        "employeeId":"",
        "location":"",
        "inceident":"",
        "dateFrom":"",
        "dateTo":"",
    })

    async function getRefs(sData){
        setPrevSearchData(sData)
        let response = await post(API_URL + "/getSaspReferals", {
            token: localStorage.getItem("token"),
            employeeId:sData.employeeId,
            location:sData.location,
            inceident:sData.inceident,
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
            employeeId:"",
            location:"",
            inceident:"",
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
    function viewReport(reportID){
        setreportIdForRef(reportID)
        handleShowrep()
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
        {field: 'inceident'},
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
        console.log(response)
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
    function referalEdit(refID){

    }
    

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true
    }));

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
              show={showrep}
              onHide={handleCloserep}
              backdrop="static"
              keyboard={false}
              fullscreen={true}
            >
              <Modal.Header closeButton>
                <Modal.Title>Records</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                                    
            <Records setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={() => autoLogin()} fullVersion={false} reportID={reftIdForRep}/>


            </Modal.Body>
            </Modal>
           
        </div>
    )
}


