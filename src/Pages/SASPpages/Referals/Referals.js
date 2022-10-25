import React, {Component, useEffect, useRef, useState,useMemo } from "react";
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
export default function Referals({setLoggedIn, loggedInUser, autoLogin}) {

    const [Referals, setReferals] = useState("")
    const [searchData, setSearchData] = useState({
        "employeeId":"",
        "location":"",
        "inceident":"",
        "dateFrom":"",
        "dateTo":"",
    })



    async function getReports(){
        let response = await post(API_URL + "/getSaspReferals", {
            token: localStorage.getItem("token"),
            employeeId:"",
            location:"",
            inceident:"",
            dateTo:"",
            dateFrom:"",
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
        return response
    }

    function searchInputHandeler(e){
        setSearchData({...searchData,  [e.target.name] : e.target.value})
    }

    function searchButtonHandeler(){
        console.log(searchData)
    }




    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
    const[columnDefs,setColumnDefs]= useState([])
  
    const [generalCols, setGeneralCols] = useState([
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
    {field: 'id', 
    headerName: '' ,
    cellRenderer: CommonButton, 
    cellRendererParams: {
      clicked: function(field) {
        
      },
      buttonText: "View Report",
      variant:"outline-dark",
    }},
    ]);

    const [morecolumns, setmoreColumns] = useState([
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




    useEffect(() => {
        autoLogin();
        setColumnDefs( generalCols);
        const pos = localStorage.getItem("position")
        console.log(pos)
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
            <h1>Referals</h1>
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
           
        </div>
    )
}


