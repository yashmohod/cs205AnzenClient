import React, {Component, useEffect, useRef, useState,useMemo } from "react";
import Nav from "../../../Components/Nav/Nav";
import './Location.css'
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import { API_URL, get, post } from '../../../Utils/API';
import DeleteButton from '../../../Components/Buttons/DeleteButton'
import EditButton from '../../../Components/Buttons/EditButton'
import { Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';

export default function Location({autoLogin}) {

    const [Location, setLocation] = useState("")
    let tempLocation
    function locationChangeHandler(e) {
        setLocation(e.target.value);
      }

    async function addLocationHandler(e){
        let response = await post(API_URL + "/enterLocation",  {location: Location,token: localStorage.getItem("token")});
        if(Location != ""){
            if (response.message =="New location was successfully entered."){
                document.getElementById("locationInput").value = "";
                getLocations();
                toast.success(response.message+" : "+Location);
                setLocation("")
            }else{
                toast.warning(response.message);
            }
        }else{
            toast.warning("Empty incident was entered!")
        }

        
    }
    async function deleteLocationHandler(locationId){
        let response = await post(API_URL + "/deleteLocation",  {id :locationId ,token: localStorage.getItem("token")});
        console.log(response);
        getLocations();
    }
    async function editLocationHandler(locationId){
        tempLocation = await getLocations()
        let locName = "";
        for(let x =0; x <tempLocation.length; x++){
            if(tempLocation[x].id == locationId){
                locName = tempLocation[x].locationName;
            }
        }
        var locationame = String(window.prompt("Enter the updated name", locName));
        if( locationame != "" && locationame != null &&  locationame != "null")  {
            await post(API_URL + "/editLocation",  {id :locationId ,editedLocation:locationame,token: localStorage.getItem("token")});
            getLocations();
        }

        
    }


    async function getLocations(){
        let response = await get(API_URL + "/getLocations?token=" +  localStorage.getItem("token"));
        response = JSON.parse(response.locations)
        setRowData(response);
        console.log(response)
        return response
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
        editLocationHandler(field);

        
      }
    }},
    {field: 'id',
    headerName: '' ,
    cellRenderer: DeleteButton, 
    cellRendererParams: {
      clicked: function(field) {
        deleteLocationHandler(field)
      }
    }}
    ]);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true
    }));





    useEffect(() => {
        autoLogin();
        getLocations();
    }, [])


    return (
        <div className="location-page">
             <ToastContainer />
            <h1>Locations</h1>
            <div className="container-fluid m-5">
                <div className="row">
                    <div className="col-12">
                        <Form className="location-form">
                            <Form.Control type="text" placeholder="Enter new location" onChange={(e) => locationChangeHandler(e)}  id="locationInput"/>
                            <Button onClick={() => addLocationHandler()}>Add</Button>
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


