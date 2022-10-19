import React from "react";
import { useState, useEffect, useRef } from "react";
import './EmployeeAccounts.css'
import "react-datepicker/dist/react-datepicker.css";
import Nav from "../../Components/Nav/Nav";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import {Form, Button} from 'react-bootstrap'
import { API_URL, get, post } from "../../Utils/API";
import EditButton from '../../Components/Buttons/EditButton'
import DeleteButton from '../../Components/Buttons/DeleteButton'
import CommonButton from '../../Components/Buttons/CommonButton'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export default function EmployeeAccounts({setLoggedIn, loggedInUser, autoLogin}) {
    const [accounts, setAccounts] = useState("")
    const gridRef = useRef();
    const [rowData, setRowData] = useState();
    const navigate = useNavigate();

    // buttons
    const promote = () =>{return (<CommonButton buttonText={"Promote"} variant ={"outline-success"}/>)}
    const demote = () =>{return (<CommonButton buttonText={"Demote"} variant ={"outline-danger"}/>)}
    const changeStatue = () =>{return (<CommonButton buttonText={"Change Statue"} variant ={"outline-info"}/>)}
    const ChangePassword = () =>{return (<CommonButton buttonText={"Change Password"} variant ={"outline-dark"}/>)}


    const columnDefs = [
        {field: 'position', headerName: 'Position' ,cellStyle: { 'text-align': 'center' },},
        {field: 'status', headerName: 'Status' ,cellStyle: { 'text-align': 'center' },},
        {field: 'lastName', headerName: 'Last Name' ,cellStyle: { 'text-align': 'center' },},
        {field: 'firstName', headerName: 'First Name' ,cellStyle: { 'text-align': 'center' },},
        {field: 'dob', headerName: ' DOB' ,cellStyle: { 'text-align': 'center' },},
        {field: 'collegeId', headerName: 'IC ID' ,cellStyle: { 'text-align': 'center' },},
        {field: 'email', headerName: 'Email' ,cellStyle: { 'text-align': 'center' },},
        {field: 'id', 
        headerName: '' ,
        cellRenderer: EditButton,
        
        cellStyle: { 'text-align': 'center' }, 
        cellRendererParams: {
          clicked: function(field) {
            editIncidentHandler(field);
          }
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: DeleteButton, 
        cellStyle: { 'text-align': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            deleteIncidentHandler(field)
          }
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: promote, 
        cellStyle: { 'text-align': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            deleteIncidentHandler(field)
          }
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: demote, 
        cellStyle: { 'text-align': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            deleteIncidentHandler(field)
          }
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: changeStatue, 
        cellStyle: { 'text-align': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            deleteIncidentHandler(field)
          }
        }},
        {field: 'id',
        headerName: '' ,
        cellRenderer: ChangePassword, 
        cellStyle: { 'text-align': 'center' },
        cellRendererParams: {
          clicked: function(field) {
            deleteIncidentHandler(field)
          }
        }},
        ]


    async function editIncidentHandler(incidentId) {
        // let tempIncidents = await getIncidents()
        // console.log(tempIncidents)
        // let incidentName = "";
        // for(let x =0; x <tempIncidents.length; x++){
        //     if(tempIncidents[x].id == incidentId){
        //         incidentName = tempIncidents[x].incidentName;
        //     }
        // }
        // var newIncidentName = String(window.prompt("Enter the updated name", incidentName));
        // if( newIncidentName != "" && newIncidentName != null &&  newIncidentName != "null")  {
        //     await post(API_URL + "/editIncident",  {id : incidentId , editedIncident: newIncidentName, token: localStorage.getItem("token")});
        //     getIncidents();
        // }
    }

    async function deleteIncidentHandler(incidentId) {
        // let response = await post(API_URL + "/deleteIncident",  {id : incidentId, token: localStorage.getItem("token")});
        // console.log(response);
        // getIncidents();
    }

  

    async function getAccounts() {
        let response = await get(API_URL + "/getAllAccounts?token=" +  localStorage.getItem("token"))
        response = JSON.parse(response.accounts)
        console.log("here")
        console.log(response)
        setRowData(response)
        return response
    }

    useEffect(() => {
        autoLogin()
        getAccounts()
    }, [])

    return (
        <div className="incident-page">
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
             <ToastContainer />
            <h1>Employee Accounts</h1>
            <Form className="incident-form">
                <Button variant="outline-dark" onClick={() => navigate("/register-accounts")}>Add Account</Button>
            </Form>


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