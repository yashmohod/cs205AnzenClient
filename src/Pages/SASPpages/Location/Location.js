import React, { useCallback, useEffect, useRef, useState } from "react";
import './Location.css'
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import DeleteButton from '../../../Components/Buttons/DeleteButton'
import EditButton from '../../../Components/Buttons/EditButton'
import { Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import useFetch from "../../../hooks/useFetch";
import { AG_THEME_CLASS } from "../../../Utils/AG-Grid.js";
import { useLocation } from 'react-router-dom'

export default function Location({autoLogin}) {
    const {REQUEST: fetcher} = useFetch()
    const [location, setLocation] = useState("")

    async function addLocationHandler(e) {
        let response = await fetcher("POST", "/enterLocation",  {location: location,token: localStorage.getItem("token")});
        if (location !== "") {
            if (response.status == 200) {
                document.getElementById("locationInput").value = "";
                getLocations();
                toast.success(response.message + " : " + location);
                setLocation("")
            } else {
                toast.warning(response.message);
            }
        } else {
            toast.warning("Empty incident was entered!")
        }
    }

    async function deleteLocationHandler(locationId){
        let response = await fetcher("POST", "/deleteLocation",  {id :locationId ,token: localStorage.getItem("token")});
        if (response.status === 200) {
            toast.success(String(response["message"]));

        } else {
            toast.warning(response["message"] )
        }
        getLocations();
    }
    async function editLocationHandler(locationId){
        var tempLocation = await getLocations()
        let locName = "";
        for(let x =0; x <tempLocation.length; x++){
            if(tempLocation[x].id == locationId){
                locName = tempLocation[x].locationName;
            }
        }
        var locationame = String(window.prompt("Enter the updated name", locName));
        if( locationame != "" && locationame != null &&  locationame != "null")  {
            let response = await fetcher("POST", "/editLocation",  {id :locationId ,editedLocation:locationame,token: localStorage.getItem("token")});
            if (response.status === 200) {
                toast.success(String(response["message"]));

            } else {
                toast.warning(response["message"] )
            }
            getLocations();
        }
    }



    const gridRef = useRef(null);
    const [rowData, setRowData] = useState();

    

    const [columnDefs, setColumnDefs] = useState([]);
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);

    const onGridReady = (params) => {
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    };
    const locationPrem = useLocation()
    const {thisFeaturePerms} = locationPrem.state

    const getLocations = useCallback(async () => {
        let response = await fetcher("GET", "/getLocations?token=" +  localStorage.getItem("token"));
        console.log(response.locations)
        const responseJson = JSON.parse(response.locations)
        var editPerm  = {
            field: 'id', 
            headerName: '' ,
            cellRenderer: EditButton, 
            cellRendererParams: {
                clicked: function(field) {
                    editLocationHandler(field);
                }
        }}
        
        var deletePerm = {
            field: 'id',
            headerName: '' ,
            cellRenderer: DeleteButton, 
            cellRendererParams: {
            clicked: function(field) {
                deleteLocationHandler(field)
                }
        }}

        var temp = [{
            field: 'locationName', 
            headerName: 'Location' 
        }]

        if (thisFeaturePerms.edit) temp.push(editPerm);
        if (thisFeaturePerms.delete) temp.push(deletePerm);
        setColumnDefs(temp);
        setRowData(responseJson);

        return responseJson
    })

    useEffect(() => {
        autoLogin();
        getLocations();

    }, []);


    return (
        <div className="location-page">
             <ToastContainer />
            <h1>Locations</h1>

            {thisFeaturePerms.create?
            <div className="container-fluid m-5">
                <div className="row">
                    <div className="col-12">
                        <Form className="location-form">
                            <Form.Control type="text" placeholder="Enter new location" onChange={(e) =>  setLocation(e.target.value)}  id="locationInput"/>
                            <Button onClick={() => addLocationHandler()}>Add</Button>
                        </Form>
                    </div>
                </div>
            </div>:null}

            <div className={AG_THEME_CLASS("location-grid")}>
				<AgGridReact
                    ref={gridRef}
					columnDefs={columnDefs}
					rowData={rowData}
                    onGridReady={onGridReady}>
				</AgGridReact>
			</div>
        </div>
    )
}


