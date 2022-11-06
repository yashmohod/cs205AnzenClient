import React from "react";
import { useState, useEffect, useRef } from "react";
import './Incidents.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Nav from "../../../Components/Nav/Nav";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import {Form, Button} from 'react-bootstrap'
import { API_URL, get, post } from "../../../Utils/API";
import EditButton from '../../../Components/Buttons/EditButton'
import DeleteButton from '../../../Components/Buttons/DeleteButton'
import { ToastContainer, toast } from 'react-toastify';

export default function Incidents({setLoggedIn, loggedInUser, autoLogin}) {
    const [incident, setIncident] = useState("")
    const gridRef = useRef();
    const [rowData, setRowData] = useState();

    const columnDefs = [
        {field: 'incidentName'},
        {field: 'id', 
        headerName: '' ,
        cellRenderer: EditButton, 
        cellRendererParams: {
          clicked: function(field) {
            editIncidentHandler(field);
          }
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: DeleteButton, 
        cellRendererParams: {
          clicked: function(field) {
            deleteIncidentHandler(field)
          }
        }}
        ]

    function incidentChangeHandler(e) {
        setIncident(e.target.value)
        console.log(e.target.value)
    }

    async function editIncidentHandler(incidentId) {
        let tempIncidents = await getIncidents()
        console.log(tempIncidents)
        let incidentName = "";
        for(let x =0; x <tempIncidents.length; x++){
            if(tempIncidents[x].id == incidentId){
                incidentName = tempIncidents[x].incidentName;
            }
        }
        var newIncidentName = String(window.prompt("Enter the updated name", incidentName));
        if( newIncidentName != "" && newIncidentName != null &&  newIncidentName != "null")  {
            await post(API_URL + "/editIncident",  {id : incidentId , editedIncident: newIncidentName, token: localStorage.getItem("token")});
            getIncidents();
        }
    }

    async function deleteIncidentHandler(incidentId) {
        let response = await post(API_URL + "/deleteIncident",  {id : incidentId, token: localStorage.getItem("token")});
        console.log(response);
        getIncidents();
    }

    async function addIncidentHandler() {
        if( incident != ""){
            let response = await post(API_URL + "/enterIncident", {incident : incident, token: localStorage.getItem("token")}) 
            if (response.message =="New incident was successfully entered."){
                document.getElementById("locationInput").value = "";
                setIncident("")
                getIncidents();
                toast.success(String(response["message"])+" : "+incident);
                getIncidents()
            }else{
                toast.warning(response["message"] )
            }
        }else{
            toast.warning("Empty incident was entered!")
        }
    }

    async function getIncidents() {
        let response = await get(API_URL + "/getIncidents?token=" +  localStorage.getItem("token"))
        response = JSON.parse(response.incidents)
        setRowData(response)
        return response
    }

    useEffect(() => {
        autoLogin()
        getIncidents()
    }, [])
/*
     <div className="container-fluid m-5">
                <div className="row">
                    <div className="col-12">
                        <Form className="text-center">
                            <Form.Control type="text" placeholder="Enter new incident" onChange={(e) => incidentChangeHandler(e)} value={incident}/>
                            <Button type="button" onClick={() => addIncidentHandler()}>Add Incident</Button>
                        </Form>
                    </div>
                </div>
            </div>
*/

    return (
        <div className="incident-page">
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
             <ToastContainer />
            <h1>Incidents</h1>
            
            <div className="container-fluid m-5">
                <div className="row">
                    <div className="col-12">
                        <Form className="location-form">
                            <Form.Control type="text" placeholder="Enter new incident" onChange={(e) => incidentChangeHandler(e)}  id="locationInput"/>
                            <Button onClick={() => addIncidentHandler()}>Add</Button>
                        </Form>
                    </div>
                </div>
            </div>

            <div className="ag-theme-alpine incident-grid">
				<AgGridReact
                    ref={gridRef}
					columnDefs={columnDefs}
					rowData={rowData}>
				</AgGridReact>
			</div>
        </div>
    )
}