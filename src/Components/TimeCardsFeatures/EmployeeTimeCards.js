/* eslint-disable react-hooks/exhaustive-deps */
import { useState , React, useEffect,useRef} from "react";
import { Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { ToastContainer, toast } from 'react-toastify';
import { API_URL, post,get } from "../../Utils/API";
import CommonButton from '../Buttons/CommonButton'
import {AgGridReact} from 'ag-grid-react';

export default function EmployeeTimeCard(props) {
   
   const[empTimeCards,setEmpTimeCard]=useState([]);

   async function getTimeCards(){
      let response = await get(API_URL + "/getTimeCards?token=" +  localStorage.getItem("token"))
      console.log(response.TimeCards)
      setEmpTimeCard(response.TimeCards)
   }

   function editTimeCard(timeCardID){

   }

   async function deleteTimeCard(timeCardID){

   }


   const gridRef = useRef(null);
   const defaultColDef= { resizable: true}
   const columnDefs = [
      {field: 'submitedDate', headerName: 'Submited Date' ,cellStyle: { 'textAlign': 'center' }},
      {field: 'start', headerName: 'Start' ,cellStyle: { 'textAlign': 'center' }},
      {field: 'end', headerName: 'End' ,cellStyle: { 'textAlign': 'center' }},
      {field: 'duration', headerName: ' Duration' ,cellStyle: { 'textAlign': 'center' }},
      {field: 'approval', headerName: 'Status' ,cellStyle: { 'textAlign': 'center' }},
      {field: 'note', headerName: 'Note' ,cellStyle: { 'textAlign': 'center' }},
      {field: 'id',
      headerName: '' ,
      cellRenderer: CommonButton, 
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
         editTimeCard(field)
        },
        buttonText: "Edit",
        variant:"outline-success",
      }},
      {field: 'id',
      headerName: '' ,
      cellRenderer: CommonButton, 
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
         deleteTimeCard(field)
        },
        buttonText: "Delete",
        variant:"outline-danger",
      }},
      
      ]
   
   useEffect(() => {
      getTimeCards()
      // gridRef.current.api.sizeColumnsToFit();

        
    }, [])
   
   
   
   return(<>
      
      <div className="ag-theme-alpine incident-grid">
        
              <AgGridReact
                ref={gridRef}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowData={empTimeCards}
                >
              </AgGridReact>


			      </div>

</>)}