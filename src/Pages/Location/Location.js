import React, { useEffect, useRef, useState } from "react";
import Nav from "../../Components/Nav/Nav";
import './Location.css'
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';


export default function Location({setLoggedIn, loggedInUser, autoLogin}) {
    const gridRef = useRef()
    const [rowData, setRowData] = useState([
        {location: "Bogart"},
        {location: "West Tower"},
        {location: "East Tower"},
        {location: "Rowland"},
        {location: "Eastman"},
        {location: "Terrace 9"}
    ]);

    function rowDeleteHandler() {
        const selectedRow = gridRef.current.api.getSelectedRows()

        console.log(selectedRow)

    }

    const [columnDefs, setColumnDefs] = useState([
        {field: 'location', editable: true,  checkboxSelection: true},
        {field: 'model'},
        {field: "'price"},
    ]);
    const dorms = [
        {location: "Bogart"},
        {location: "West Tower"},
        {location: "East Tower"},
        {location: "Rowland"},
        {location: "Eastman"},
        {location: "Terrace 9"},
    ]
    const [locations, setLocations] = useState(dorms)
    const [newLocation, setNewLocation] = useState("")

   function addLocationHandler() {  
        setLocations([...locations, {location : newLocation}])
       //setLocations([...locations, {location : newLocation}])
   }

    function locationChangeHandler(e) {
        setNewLocation(e.target.value)
    }

    useEffect(() => {
        autoLogin()
    }, [])

/*
        {locations.map((item) => {
                return (
                    <div>
                        <p>{item.location}</p>
                        <button>Edit</button>
                    </div>
                )
                
            })}

*/

    return (
        <div>
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
            <h1>Add Location</h1>
            <input type="text" onChange={(e) => locationChangeHandler(e)}/>
            <button onClick={() => addLocationHandler()}>Add</button>
            <h1>Locations</h1>
            {locations.map((item) => {
                return (
                    <div>
                        <p>{item.location}</p>
                        <button>Edit</button>
                    </div>
                )
                
            })}
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

            <button onClick={() => rowDeleteHandler()}>Delete</button>
        </div>
    )
}