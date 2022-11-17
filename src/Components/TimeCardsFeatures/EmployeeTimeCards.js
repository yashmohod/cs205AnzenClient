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
import TimePicker24H from "../TimePicker24H/TimePicker24H"
import {Button} from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal';

export default function EmployeeTimeCard(props) {
   
   const[empTimeCards,setEmpTimeCard]=useState([]);
   const [showEdit, setShowEdit] = useState(false);
   const handleCloseEdit = () => setShowEdit(false);
   const handleShowEdit = () => setShowEdit(true);

   const [timeCardData,setTimeCardData] = useState({
    startDate:"",
    startTime:"00:00",
    endDate:"",
    endTime:"00:00",
    note:"",
    id:""
  });
  function inputChangeHandlerTimeCardData(e){
    setTimeCardData({...timeCardData,  [e.target.name] : e.target.value})
}
async function timeCardSubmit(){
  console.log(timeCardData)
  let response = await post(API_URL + "/editTimeCard", {
      token: localStorage.getItem("token"),
      idTimecardID:timeCardData.id,
      start:timeCardData.startDate+" "+timeCardData.startTime+":00",
      end:timeCardData.endDate+" "+timeCardData.endTime+":00",
      note:timeCardData.note,
      })

  if(response.status === 200){
      toast.success(response.message)
      handleCloseEdit()
  }else{
      toast.warning(response.message)
  }
  getTimeCards()
}

   async function getTimeCards(){
      let response = await get(API_URL + "/getTimeCards?token=" +  localStorage.getItem("token"))
      if(response.status == 200) {
        var data = response.UserTimeCards.map((tc)=>{
          if(tc.approval){
            tc.approval ="Approved"
          }else{
            tc.approval ="Pending"
          }
          return(
            tc
          )
        })
        setEmpTimeCard(data)
      gridRef.current.api.sizeColumnsToFit();
      console.log(gridRef.current.api)
      gridRef.current.columnApi.applyColumnState({state: [{ colId: 'approval', sort: 'desc' }],defaultState: { sort: null },})
      }
   }

   function editTimeCard(timeCardID){
    var data = {}
    for(var x =0; x< empTimeCards.length;x++){
      if(empTimeCards[x].id == timeCardID){
        data=empTimeCards[x]
      }
    }

    setTimeCardData({
      startDate:data.start.split("/")[0].replaceAll(' ', ''),
      startTime:data.start.split("/")[1].replaceAll(' ', ''),
      note:data.note,
      endDate:data.end.split("/")[0].replaceAll(' ', ''),
      endTime:data.end.split("/")[1].replaceAll(' ', ''),
      id:timeCardID,
    })

    handleShowEdit()

   }

   async function deleteTimeCard(timeCardID){

    let response = await post(API_URL + "/clearTimeCard", {token: localStorage.getItem("token"),TimecardID: timeCardID})
    if(response.status === 200){
      toast.success(response.message)
    }else{
      toast.warning(response.message)
    }
    getTimeCards()

   }



   const gridRef = useRef(null);
   const defaultColDef= { resizable: true}
   const columnDefs = [
      {field: 'submitedDate', headerName: 'Submited Date' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'start', headerName: 'Start' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'end', headerName: 'End' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'duration', headerName: ' Duration' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'approval', headerName: 'Status' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'note', headerName: 'Note' ,cellStyle: { 'textAlign': 'center' }, sortable: true},
      {field: 'id',
      headerName: '' ,
      cellRenderer: (params)=>{
        if(params.data.approval =="Pending"){
          return (<CommonButton buttonText={"Edit"} variant={"outline-success"}/>)
        }
      }, 
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
         editTimeCard(field)
        },
      }},
      {field: 'id',
      headerName: '' ,
      cellRenderer:(params)=>{
        if(params.data.approval =="Pending"){
          return (<CommonButton buttonText={"Delete"} variant={"outline-danger"}/>)
        }
      }, 
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
         deleteTimeCard(field)
        },
      }},
      
      ]


    function showMobileViewTimeCards(){
      let sortedfTC = []
      for(let x = 0; x< empTimeCards.length; x++){
        if(empTimeCards[x].approval =="Pending" ){
          sortedfTC.push(empTimeCards[x])
        }
      }
      for(let x = 0; x< empTimeCards.length; x++){
        if(empTimeCards[x].approval =="Approved" ){
          sortedfTC.push(empTimeCards[x])
        }
      }

      return(
        sortedfTC.map(element => {
        return(
        <MobileTableCards keyNum ={empTimeCards.indexOf(element)}  data={element} editTimeCard={editTimeCard} deleteTimeCard={deleteTimeCard} />
       ) }))
    }



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
      {showMobileViewTimeCards()}

    </Accordion>

      </div>
    </div>


    {/* edit pop up */}
    <Modal
              show={showEdit}
              onHide={handleCloseEdit}
              backdrop="static"
              keyboard={false}
            >
              <Modal.Header closeButton>
                <Modal.Title>Edit Time Card</Modal.Title>
              </Modal.Header>
              <Modal.Body>

                <div className="row ">
                <div className="col ">
                <Form.Label className=" d-flex justify-content-start">Start Time </Form.Label>
                <Form.Control type="date"placeholder="" value={timeCardData.startDate} onChange={(e)=>inputChangeHandlerTimeCardData(e)}  name="startDate" />
                </div>
                <TimePicker24H time={timeCardData.startTime} inputChangeHandler={ inputChangeHandlerTimeCardData} name = {"startTime"}/>
                </div>
                <div className="row ">
                <div className="col ">
                <Form.Label className=" d-flex justify-content-start">End Time </Form.Label>
                <Form.Control type="date"placeholder="" value={timeCardData.endDate} onChange={(e)=>inputChangeHandlerTimeCardData(e)}  name="endDate" />
                </div>
                <TimePicker24H time={timeCardData.endTime} inputChangeHandler={ inputChangeHandlerTimeCardData} name = {"endTime"}/>
                </div>
                <div className="row" id="margin">
                <Form.Label className=" d-flex justify-content-start"><strong>Notes:</strong></Form.Label>
                <Form.Control   as="textarea" value={timeCardData.note} rows={3} onChange={(e)=>inputChangeHandlerTimeCardData(e)} name = {"note"}/>
                </div>

            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={()=>timeCardSubmit()}>Submit</Button>
            </Modal.Footer>
            </Modal>


</>)}