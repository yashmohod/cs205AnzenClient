import React from "react";
import { useState, useEffect, useRef, useCallback} from "react";
import './Incidents.css'
import "react-datepicker/dist/react-datepicker.css";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import {Form, Button} from 'react-bootstrap'
import useFetch from "../../../hooks/useFetch";
import EditButton from '../../../Components/Buttons/EditButton'
import DeleteButton from '../../../Components/Buttons/DeleteButton'
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom'
import { defineColumns } from "../../../Utils/AG-Grid.js";

export default function Incidents({autoLogin}) {
    const {REQUEST: fetcher} = useFetch()
    const [incident, setIncident] = useState("")
    const gridRef = useRef();
    const [rowData, setRowData] = useState();
    const {loadedColumnDefs} = defineColumns({
        columnKeys: ["incidentName"],
        columnHeaders: ["Incident"]
    })
    const [columnDefs,setColumnDef] = useState([]);
  
    async function editIncidentHandler(incidentId) {
        var tempIncidents = await getIncidents()
        var incidentName = "";
        for(let x = 0; x <tempIncidents.length; x++){
            if (tempIncidents[x].id === incidentId) {
                incidentName = tempIncidents[x].incidentName;
            }
        }
        var newIncidentName = String(window.prompt("Enter the updated name", incidentName));
        if(newIncidentName !== "" && newIncidentName != null &&  newIncidentName != "null")  {
            await fetcher("POST",  "/editIncident",  {id : incidentId , editedIncident: newIncidentName, token: localStorage.getItem("token")});
            getIncidents();
        }
    }

    async function deleteIncidentHandler(incidentId) {
        const response = await fetcher("POST", "/deleteIncident",  {id : incidentId, token: localStorage.getItem("token")});
        getIncidents();
    }

    async function addIncidentHandler() {
        if (incident !== ""){
            const response = await fetcher("POST", "/enterIncident", {incident : incident, token: localStorage.getItem("token")}) 
            if (response.status === 200) {
                document.getElementById("locationInput").value = "";
                setIncident("")
                getIncidents();
                toast.success(String(response["message"])+" : "+incident);
                getIncidents()
            } else {
                toast.warning(response["message"] )
            }
        } else {
            toast.warning("Empty incident was entered!")
        }
    }

    const getIncidents = useCallback(async () => {
        const response = await fetcher("GET", "/getIncidents?token=" +  localStorage.getItem("token"))
        const responseJson = JSON.parse(response.incidents)
        var editPerm  = {
            field: 'id', 
            headerName: '' ,
            cellRenderer: EditButton, 
            cellRendererParams: {
                clicked: function(field) {
                editIncidentHandler(field);
                }
        }}
        
        var deletePerm = {
            field: 'id',
            headerName: '' ,
            cellRenderer: DeleteButton, 
            cellRendererParams: {
            clicked: function(field) {
                deleteIncidentHandler(field)
                }
        }}
        var temp = loadedColumnDefs
        
        if (thisFeaturePerms.edit) temp.push(editPerm);
        if (thisFeaturePerms.delete) temp.push(deletePerm);
        setColumnDef(temp);
        setRowData(responseJson)
        return response
    })

    const location = useLocation()
    const {thisFeaturePerms} = location.state

    useEffect(() => {
        autoLogin()
        getIncidents()
    }, [])

    return (
        <div className="incident-page">
            <ToastContainer />
            <h1>Incidents</h1>
            {thisFeaturePerms.create &&
                        <div className="container-fluid m-5">
                        <div className="row">
                            <div className="col-12">
                                <Form className="location-form">
                                    <Form.Control type="text" placeholder="Enter new incident" onChange={(e) => setIncident(e.target.value)}  id="locationInput"/>
                                    <Button onClick={() => addIncidentHandler()}>Add</Button>
                                </Form>
                            </div>
                        </div>
                    </div>}
            
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