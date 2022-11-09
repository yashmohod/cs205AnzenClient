/* eslint-disable react-hooks/exhaustive-deps */
import { useState , React, useEffect,useRef} from "react";
import { Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { ToastContainer, toast } from 'react-toastify';
import { API_URL, post,get } from "../../Utils/API";
import CommonButton from '../Buttons/CommonButton'
import {AgGridReact} from 'ag-grid-react';
import Accordion from 'react-bootstrap/Accordion';
import MobileTableCards from "./MobileTableCards";
export default function EmployeeTimeCard(props) {
   
   const[empTimeCards,setEmpTimeCard]=useState([]);

   async function getTimeCards(){
      let response = await get(API_URL + "/getTimeCards?token=" +  localStorage.getItem("token"))
      console.log(response.status)
      if(response.status == 200) {
        var data = response.TimeCards.map((tc)=>{
          if(tc.approval){
            tc.approval ="Approved"
          }else{
            tc.approval ="Pending"
          }
          return(
            tc
          )
        })
        console.log(data)
        setEmpTimeCard(data)
      gridRef.current.api.sizeColumnsToFit();
      }
   }

   function editTimeCard(timeCardID){
    var data = {}
    for(var x =0; x< empTimeCards.length;x++){
      if(empTimeCards[x].id == timeCardID){
        data=empTimeCards[x]
      }
    }
    props.setTimeCardData({
      startDate:data.startDate,
        startTime:data.startTime,
        endDate:data.startEnd,
        endTime:data.EndTime,
        notes:data.note,
    })
    props.handleShowEdit()

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
  

        
    }, [])



   
   
   
   return(<>
   {/* desktop view */}
    <div className="d-none d-xxl-block" >
      <div className="ag-theme-alpine incident-grid">
        
              <AgGridReact
                ref={gridRef}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowData={empTimeCards}
                >
              </AgGridReact>


      </div>
    </div>

    {/* Mobile View */}
    <div className="d-block d-xxl-none" >
      <div className="ag-theme-alpine incident-grid">
        
      <Accordion defaultActiveKey="0">
      {
        empTimeCards.map(element => {
          return(
          <MobileTableCards keyNum ={empTimeCards.indexOf(element)}  data={element} />
         ) })
      }

    </Accordion>

      </div>
    </div>



</>)}