/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef, useState } from "react";
import { API_URL, post,get } from "../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom'
import {AgGridReact} from 'ag-grid-react';
import CheckButton from '../Buttons/CheckButton';
import "./LinkCard.css"
import { Form, Accordion} from 'react-bootstrap';
import Position from "rsuite/esm/Overlay/Position";
import Button from 'rsuite/Button';
export default function LinkCard({curLink,keyNum,editLink,deleteLink,thisFeaturePerms, userperms,updateLinkVisibility}) {
  
  
  const gridRef = useRef(null);
  const defaultColDef= { resizable: true}

  const[rowData,setRowData]= useState([]);
  
  const columnDefs = [
    {field: 'position', headerName: 'Feature' ,cellStyle: { 'textAlign': 'center' }},
    {field: 'view',
    headerName: '' ,
    cellRenderer: CheckButton, 
    headerName: 'View',
    cellStyle: { 'textAlign': 'center' },
    cellRendererParams: {
      clicked: function(field) {
      },
      editPermissions:updateLinkVisibility,
      org:curLink.org,
      permissionFunction:true,
    }}]
    
    function editRowData(positions){
      console.log("here")
      let temp = []
      for(let x = 0; x <positions.length;x++ ){
        // permissions
        let permFound = false;
        for(let y = 0; y < positions[x].permissions.length; y++){
          if(positions[x].permissions[y].featureName == curLink.linkName){
            permFound = true;
          }
        }
        if(positions[x].PosName == positions[x].title){
          temp.push({
            "posId":positions[x].id,
            "linkId": curLink.id,
            "position":positions[x].PosName,
            "view": permFound,
          })
        }else{
          temp.push({
            "posId":positions[x].id,
            "linkId": curLink.id,
            "position":positions[x].PosName +","+positions[x].title,
            "view": permFound,
          })
        }

      }
      console.log(temp)
      setRowData(temp)
      
    }
    async function getpositions(){

        let response = await get(API_URL + "/getPositions?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org);
        var positionAll = response.positions;
        editRowData(positionAll);
    }

    useEffect(() => {

      getpositions();
    },[])

    return (
        <Accordion.Item eventKey={keyNum} >
          <Accordion.Header  >{curLink.linkName}</Accordion.Header>
            <Accordion.Body>
            <h4>{curLink.url}</h4>
            <div className="col"> 
            <div className = "buttonsDiv">
            <div className="row" >
              <div className="col-3"></div>
              <div className="col-3" id="editbutton">
                <Button color="green" appearance="primary" onClick={()=>editLink(curLink)} className="p-1" title="Edit">
                  Edit
                </Button>
              </div>
              <div className="col-3" id="deletebutton">
                <Button color="red" appearance="primary" onClick = {()=>deleteLink(curLink.id)} className="p-1" title="Delete">
                  Delete 
                </Button>
              </div>
              <div className="col-3"></div>
              </div>
            </div>
            </div>
              <div>
                <div className="ag-theme-alpine incident-grid" id = "promotionsDiv">
                    <AgGridReact
                    ref={gridRef}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowData={rowData}
                    >
                    </AgGridReact>
                </div>  
              </div>
            </Accordion.Body>
          </Accordion.Item>

    )
}