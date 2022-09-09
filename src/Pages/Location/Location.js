import React, { useState } from "react";
import Nav from "../../Components/Nav/Nav";
import './Location.css'



export default function Location() {
    const [rowData, setRowData] = useState([
        {make: "Toyota", model: "Celica", price: 35000},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxster", price: 72000}
    ]);

    const [columnDefs, setColumnDefs] = useState([
        {field: 'make'},
        {field: 'model'},
        {field: "'price"}
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
            <Nav/>
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

           
        </div>
    )
}