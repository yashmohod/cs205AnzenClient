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
import CommonButton from '../../../Components/Buttons/CommonButton'
export default function Referals({setLoggedIn, loggedInUser, autoLogin, fullVersion,reportID}) {

    const [Referals, setReferals] = useState("")
    const [searchData, setSearchData] = useState({
        "employeeId":"",
        "location":"",
        "inceident":"",
        "dateFrom":"",
        "dateTo":"",
    })


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

   

    function searchInputHandeler(e){
        setSearchData({...searchData,  [e.target.name] : e.target.value})
    }

    function searchButtonHandeler(){
        console.log(searchData)
    }




    const gridRef = useRef(null); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

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
        {field: 'id', 
    headerName: '' ,
    cellRenderer: CommonButton, 
    cellRendererParams: {
      clicked: function(field) {
        
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
       
      }
    }}]);
    



    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true
    }));

    async function getOrgNPos(){
        const orgres = (await get(API_URL + "/getOrganization?token=" +  localStorage.getItem("token")))
        const posres = (await get(API_URL + "/getPosition?token=" +  localStorage.getItem("token")))
        let locOrg = posres["organization"]
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



    useEffect(() => {
        getRefsOFrep(reportID)
        autoLogin();
        getOrgNPos();
        getReports();
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
           
        </div>
    )
}


