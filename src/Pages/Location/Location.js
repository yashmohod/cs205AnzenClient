import React, {Component, useEffect, useRef, useState,useMemo } from "react";
import Nav from "../../Components/Nav/Nav";
import './Location.css'
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import { API_URL, get, post } from '../../Utils/API';
import DeleteButton from './DeleteButton'
import EditButton from './EditButton'
import EditPopUp from './EditPopUp';


export default function Location({setLoggedIn, loggedInUser, autoLogin}) {

    const [Location, setLocation] = useState("")
    let tempLocation ;
    function locationChangeHandler(e) {
        setLocation(e.target.value);
      }

    async function addLocationHandler(e){
        let response = await post(API_URL + "/enterLocation",  {location: Location,token: localStorage.getItem("token")});
        if (response["message"] =="New location was successfully entered."){
            document.getElementById("locationInput").value = "";
            getLocations();
            console.log(Location+" added!")
        }
    }
    async function deleteLocationHandler(locationId){
        let response = await post(API_URL + "/deleteLocation",  {id :locationId ,token: localStorage.getItem("token")});
        console.log(response);
        getLocations();
    }
    async function editLocationHandler(locationId){
        let locName = "";
        for(let x =0; x <tempLocation.length; x++){
            if(tempLocation[x].id == locationId){
                locName = tempLocation[x].locationName;
            }
        }
        console.log(locName);
        var locationame = String(window.prompt("Enter the updated name", locName));

        let response = await post(API_URL + "/editLocation",  {id :locationId ,editedLocation:locationame,token: localStorage.getItem("token")});

        console.log(response);
   
        getLocations();
    }


    async function getLocations(){
        let response = await get(API_URL + "/getLocations?token=" +  localStorage.getItem("token"));
        setRowData(response.locations);
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
        <div>
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
            <h1>Add Location</h1>
            <input type="text" id="locationInput" onChange={(e) => locationChangeHandler(e)}/>
            <button onClick={() => addLocationHandler()}>Add</button>
            
            <div
				className="ag-theme-alpine"
				style={{
					height: '500px',
					width: '100vw'
				}}
			>
                
				<AgGridReact
                    ref={gridRef}
					columnDefs={columnDefs}
					rowData={rowData}>
				</AgGridReact>
			</div>
           
        </div>
    )
}


