/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef, useState } from "react";
import { API_URL, post,get } from "../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom'
import {AgGridReact} from 'ag-grid-react';
import CheckButton from '../Buttons/CheckButton';

import { Form, Accordion} from 'react-bootstrap';
export default function({curpos,keyNum,editPermissions}) {

    const cardRef = useRef(null);

    const location = useLocation()
    const[userAccPermissions, setUserAccPermissions]=useState(curpos.permissions)
    const defaultColDef= { resizable: true}
    const gridRef= useRef()


  
    const columnDefs = [
      {field: 'featureName', headerName: 'Feature' ,cellStyle: { 'textAlign': 'center' }},
      {field: 'view',
      headerName: '' ,
      cellRenderer: CheckButton, 
      headerName: 'View',
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
        },
        editPermissions:editPermissions,
        org:curpos.OrgName
      }},
      {field: 'create',
      headerName: '' ,
      cellRenderer: CheckButton, 
      headerName: 'Create',
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
        },
        editPermissions:editPermissions,
        org:curpos.OrgName
      }},
      {field: 'edit',
      headerName: '' ,
      cellRenderer: CheckButton, 
      headerName: 'Edit',
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
        },
        editPermissions:editPermissions,
        org:curpos.OrgName
      }},
      {field: 'delete',
      headerName: '' ,
      cellRenderer: CheckButton, 
      headerName: 'Delete',
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
        },
        editPermissions:editPermissions,
        org:curpos.OrgName
      }},
      {field: 'blackList',
      headerName: '' ,
      cellRenderer: CheckButton, 
      headerName: 'Black List',
      cellStyle: { 'textAlign': 'center' },
      cellRendererParams: {
        clicked: function(field) {
        },
        editPermissions:editPermissions,
        org:curpos.OrgName
      }},
      ]



    const { thisFeaturePerms } = location.state

    useEffect(() => {

    },[])


   

    return (
        
        <Accordion.Item eventKey={keyNum} >
        <Accordion.Header ref={cardRef} >{curpos.PosName} </Accordion.Header>
        <Accordion.Body>
          <div>
              <div className="ag-theme-alpine incident-grid">
                  <AgGridReact
                  ref={gridRef}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  rowData={userAccPermissions}
                  >
                  </AgGridReact>
              </div>  
          </div>

        </Accordion.Body>
      </Accordion.Item>
        

    )
}