/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef, useState } from "react";
import Nav from "../../../Components/Nav/Nav";
import { API_URL, post,get } from "../../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import {AgGridReact} from 'ag-grid-react';
import { useLocation } from 'react-router-dom'
import Accordion from 'react-bootstrap/Accordion';
import PositionCard from "./PositionCard"

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
        console.log(response)
        // sortPositions(response.positions);
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

    function sortPositions(curPositions){
        console.log(curPositions.length)
        for(var i =0; i < curPositions.length;i++ ){
            for(var j = i+1 ; j < curPositions.length;j++ ){
                if(curPositions[i].Org_hierarchyLevel >curPositions[j].Org_hierarchyLevel ){
                    const temp = curPositions[j];
                    curPositions[j] = curPositions[i];
                    curPositions[i] = temp;
                }
            }
        }
        console.log(curPositions)
    }

    function showPositionCards(){
  
        return(
        positions.map(element => {
          return(
          <PositionCard curpos={element} />
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
            {/* <div className="d-block d-xxl-none" >
                <div className="ag-theme-alpine incident-grid">
                    
                    <Accordion defaultActiveKey="0">
                        {showPositionCards()}
                    </Accordion>
                </div>
            </div> */}
        
        </div>
    )
}