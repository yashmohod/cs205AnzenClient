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

export default function Records({setLoggedIn, loggedInUser, autoLogin}) {

    const [Records, setRecords] = useState("")



    async function getReports(){
        let response = await post(API_URL + "/getSaspReports", {
            token: localStorage.getItem("token"),
            employeeId:"",
            location:"",
            inceident:"",
            dateTo:"",
            dateFrom:"",
            })
        console.log(response)
        // response = JSON.parse(response.locations)
        // setRowData(response);
        // return response
    }




    const gridRef = useRef(); // Optional - for accessing Grid's API
    const [rowData, setRowData] = useState(); // Set rowData to Array of Objects, one Object per Row

    // Each Column Definition results in one Column.
  
    const [columnDefs, setColumnDefs] = useState([
    {field: 'locationName'},
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
    }}
    ]);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true
    }));





    useEffect(() => {
        autoLogin();
        getReports();
    }, [])


    return (
        <div className="location-page">
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
             <ToastContainer />
            <h1>Records</h1>
            <div className="container-fluid m-5">
                <div className="row">
                    <div className="col-12">
                        <Form className="location-form">
                            
                        </Form>
                    </div>
                </div>
            </div>
          

       
        
            <div className="ag-theme-alpine location-grid">
                
				<AgGridReact
                    ref={gridRef}
					columnDefs={columnDefs}
					rowData={rowData}>
				</AgGridReact>
			</div>
           
        </div>
    )
}


