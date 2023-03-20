/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef, useState } from "react";
import Nav from "../../../Components/Nav/Nav";
import { API_URL, post,get } from "../../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import {AgGridReact} from 'ag-grid-react';
import { useLocation } from 'react-router-dom'
import {Accordion,Button, Form} from 'react-bootstrap';
import PositionCard from "../../../Components/PositionCard/PositionCard"

export default function({loggedIn, setLoggedIn, loggedInUser,autoLogin}) {

    const [positions,setPositions] = useState([]);
    const [rowData, setRowData] = useState([]);
    const gridRef = useRef();
    const defaultColDef= { resizable: true}

    const commonColDef = [
        {field: 'position', headerName: 'Position' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'status', headerName: 'Status' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'lastName', headerName: 'Last Name' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'firstName', headerName: 'First Name' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'dob', headerName: ' DOB' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'collegeId', headerName: 'IC ID' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'email', headerName: 'Email' ,cellStyle: { 'textAlign': 'center' }},
    ]

    async function getpositions(){
        let response = await get(API_URL + "/getPositions?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org);
        console.log(response);
        setPositions(response.positions)
    }

    async function addPositions(){

    }

    async function deletePositions(){

    }

    async function editPositions(){

    }

    
    
    async function hierarchyMoveUp(){

    }

    async function hierarchyMoveDown(){

    }

    function updateTable(){

    }

    async function editPermissions(data,e,org){
        // console.log(data)
        // console.log(e.target.checked)
        // const value = e.target.checked
        // const permissionName = data.colDef.field
        // const featureName = userAccPermissions[data.rowIndex].featureName
        // console.log(org)
        // console.log(permissionName)
        // console.log(featureName)
        // let response = await post(API_URL + "/updatePermission",  {
        //     token: localStorage.getItem("token"),
        //     userID: "",
        //     featureName:featureName,
        //     permissionName:permissionName,
        //     value:value,
        //     org:org
        // });
        // if(response.status ==200){
        //     toast.success(response.message);
        // }else{
        //     toast.warning(response.message);
        // }
    
      }
    



    function showPositionCards(){
  
        return(
        positions.map(element => {
          return(
          <PositionCard keyNum={positions.indexOf(element)} curpos={element} editPermissions={editPermissions} />
         ) }))
      }


    const location = useLocation()
    const { thisFeaturePerms } = location.state

    useEffect(() => {
        autoLogin();
        getpositions();

    },[])


   

    return (
        
        <div>
        
            <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser} autoLogin={autoLogin}/>
             <ToastContainer />
            <h1>Positions & Permissions</h1>
            <div className="">
                <div className="row">
                    <div className="col-12">
                        <Form className="position-form">
                            <Button onClick={() => addPositions()}>Add</Button>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="" >
                <div className="ag-theme-alpine incident-grid">

                    <Accordion defaultActiveKey="0">
                        {showPositionCards()}
                    </Accordion>
                </div>
            </div>

       
        
        </div>
    )
}