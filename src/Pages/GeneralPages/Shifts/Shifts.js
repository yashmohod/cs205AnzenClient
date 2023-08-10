import React, { useCallback, useEffect, useRef, useState } from "react";
import './Shifts.css'
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

export default function Shifts({autoLogin}) {
    const {REQUEST: fetcher} = useFetch()
    const [shift, setShift] = useState("")

    async function addShiftHandler(e) {
        let response = await fetcher("POST", "/enterShift",  {shift: shift,org:thisFeaturePerms.org,token: localStorage.getItem("token")});
        if (shift !== "") {
            if (response.status == 200) {
                document.getElementById("locationInput").value = "";
                getShifts();
                toast.success(response.message + " : " + shift);
                setShift("")
            } else {
                toast.warning(response.message);
            }
        } else {
            toast.warning("Empty incident was entered!")
        }
    }

    async function deleteLocationHandler(locationId){
        let response = await fetcher("POST", "/deleteShift",  {id :locationId ,token: localStorage.getItem("token")});
        if (response.status === 200) {
            toast.success(String(response["message"]));

        } else {
            toast.warning(response["message"] )
        }
        getShifts();
    }
    async function editShiftHandler(shiftId){
        var tempShifts = await getShifts()
        let shifName = "";
        for(let x =0; x <tempShifts.length; x++){
            if(tempShifts[x].id == shiftId){
                shifName = tempShifts[x].shiftName;
            }
        }
        var shiftname = String(window.prompt("Enter the updated name", shifName));
        if( shiftname != "" && shiftname != null &&  shiftname != "null")  {
            let response = await fetcher("POST", "/editShift",  {id :shiftId ,editedShift:shiftname,token: localStorage.getItem("token")});
            if (response.status === 200) {
                toast.success(String(response["message"]));

            } else {
                toast.warning(response["message"] )
            }
            getShifts();
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

    const getShifts = useCallback(async () => {
        let response = await fetcher("GET", "/getOrgShifts?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org);
        console.log(response.shifts)
        // const responseJson = JSON.parse(response.shifts)
        var editPerm  = {
            field: 'id', 
            headerName: '' ,
            cellRenderer: EditButton, 
            cellRendererParams: {
                clicked: function(field) {
                    editShiftHandler(field);
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
            field: 'shiftName', 
            headerName: 'Shifts' 
        }]

        if (thisFeaturePerms.edit) temp.push(editPerm);
        if (thisFeaturePerms.delete) temp.push(deletePerm);
        setColumnDefs(temp);
        setRowData(response.shifts);

        return response.shifts
    })

    useEffect(() => {
        autoLogin();
        getShifts();

    }, []);


    return (
        <div className="location-page">
             <ToastContainer />
            <h1>{thisFeaturePerms.org} Shifts</h1>

            {thisFeaturePerms.create?
            <div className="container-fluid m-5">
                <div className="row">
                    <div className="col-12">
                        <Form className="location-form">
                            <Form.Control type="text" placeholder="Enter new shift" onChange={(e) =>  setShift(e.target.value)}  id="locationInput"/>
                            <Button onClick={() => addShiftHandler()}>Add</Button>
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


