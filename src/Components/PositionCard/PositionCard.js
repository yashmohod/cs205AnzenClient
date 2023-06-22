/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef, useState } from "react";
import { API_URL, post,get } from "../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom'
import {AgGridReact} from 'ag-grid-react';
import CheckButton from '../Buttons/CheckButton';
import "./PositionCard.css"
import { Form, Accordion} from 'react-bootstrap';
import Position from "rsuite/esm/Overlay/Position";
export default function({curpos,keyNum,editPermissions,edit_promotionNdemotion}) {

    const cardRef = useRef(null);

    const location = useLocation()

    const defaultColDef= { resizable: true}
    const gridRef= useRef()
  
    const columnDefs_permissions = [
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
        org:curpos.OrgName,
        permissionFunction:true,
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
        org:curpos.OrgName,
        permissionFunction:true,
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
        org:curpos.OrgName,
        permissionFunction:true,
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
        org:curpos.OrgName,
        permissionFunction:true,
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
        org:curpos.OrgName,
        permissionFunction:true,
      }},
      ]

      const columnDefs_promotionD = [
        {field: 'otherPos.PosName', headerName: 'Position' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'otherPos.title', headerName: 'Title' ,cellStyle: { 'textAlign': 'center' }},
        {field: 'isPromote',
        cellRenderer: CheckButton, 
        headerName: 'Promote To',
        cellStyle: { 'textAlign': 'center' },
        cellRendererParams: {
          clicked: function(field) {
          },
          edit_promotionNdemotion:edit_promotionNdemotion,
          promotionFunction: true,
          transitionOf: curpos,
          isPromotion: true,
        }
      },
        {field: 'isDemote',
        cellRenderer: CheckButton, 
        headerName: 'Demote To',
        cellStyle: { 'textAlign': 'center' },
        cellRendererParams: {
          clicked: function(field) {
          },
          edit_promotionNdemotion:edit_promotionNdemotion,
          promotionFunction: true,
          transitionOf: curpos,
          isPromotion: false,
        }
      },
        ]

    const { thisFeaturePerms } = location.state

    useEffect(() => {

    },[])

    return (
        
        <Accordion.Item eventKey={keyNum} id ="positionCard">
        <Accordion.Header ref={cardRef} id="positionCardHeader" >{curpos.PosName ==curpos.title?<>{curpos.PosName}</>:<>{curpos.PosName+","+curpos.title}</>} </Accordion.Header>
        <Accordion.Body id="positionCardBody">
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey={0} >
            <Accordion.Header  >Permissions </Accordion.Header>
            <Accordion.Body>
              <div>
                <div className="ag-theme-alpine incident-grid" id = "permissionsDiv" >
                    <AgGridReact
                    ref={gridRef}
                    columnDefs={columnDefs_permissions}
                    defaultColDef={defaultColDef}
                    rowData={curpos.permissions}
                    >
                    </AgGridReact>
                </div>  
            </div>
            </Accordion.Body>
           </Accordion.Item>
           <Accordion.Item eventKey={1} >
            <Accordion.Header  >Promotion Settings</Accordion.Header>
            <Accordion.Body>
              <div>
                <div className="ag-theme-alpine incident-grid" id = "promotionsDiv">
                    <AgGridReact
                    ref={gridRef}
                    columnDefs={columnDefs_promotionD}
                    defaultColDef={defaultColDef}
                    rowData={curpos.promotionD}
                    >
                    </AgGridReact>
                </div>  
              </div>
            </Accordion.Body>
           </Accordion.Item>
          </Accordion>


        </Accordion.Body>
      </Accordion.Item>
        

    )
}