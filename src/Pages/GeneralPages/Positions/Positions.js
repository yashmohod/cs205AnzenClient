/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef, useState } from "react";
import Nav from "../../../Components/Nav/Nav";
import { API_URL, post,get } from "../../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import {AgGridReact} from 'ag-grid-react';
import { useLocation } from 'react-router-dom'
import {Accordion,Button, Form} from 'react-bootstrap';
import PositionCard from "../../../Components/PositionCard/PositionCard"
import "./position.css"
export default function({loggedIn, setLoggedIn, loggedInUser,autoLogin}) {

    const [positions,setPositions] = useState([]);
    // const [promotionD, setPromotionD] = useState([]);
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
        cutomizePromotionDetails(response.positions);

    }

    function cutomizePromotionDetails(positionAll){
        for(let position of positionAll){
            let dataGrid =[];
            for(let otherPositions of positionAll){
                if(position.id != otherPositions.id){
                    let isPromote = false;
                for(let pormoteToPos of position.promoteTo){
                    if(pormoteToPos.title == otherPositions.title){
                        isPromote = true;
                    }
                }
                let isDemote = false;
                for(let demoteToPos of position.demoteTo){
                    if(demoteToPos.title == otherPositions.title){
                        isDemote = true;
                    }
                }
                dataGrid.push({
                    "otherPos": otherPositions,
                    "isPromote":isPromote,
                    "isDemote": isDemote,
                })   
                }
            }
            position.promotionD = dataGrid;
        }   
        console.log(positionAll);
        setPositions(positionAll);
    }

    async function addPositions(){

    }

    async function deletePositions(positionID){

    }

    async function editPositions(positionID,data){

    }

    
    async function edit_promotionNdemotion(transitionOf, transitionTo, isPromotion, updateValue ){
        // set_promotionsNdemotions
        let response = await post(API_URL + "/set_promotionsNdemotions",  {
            token: localStorage.getItem("token"),
            org: thisFeaturePerms.org,
            transitionOf:transitionOf.id,
            transitionTo: transitionTo.otherPos.id,
            isPromotion:isPromotion,
            updateValue:updateValue,
        });
        if(response.status == 200){
            toast.success(response.message);
        }else{
            toast.warning(response.message);
        }
        refresh();
    }
    

    async function editPermissions(data,e,org){
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
    

    function refresh(){
        autoLogin();
        getpositions();
    }

    function showPositionCards(){
  
        return(
        positions.map(element => {
          return(
          <PositionCard keyNum={positions.indexOf(element)} curpos={element}   edit_promotionNdemotion={edit_promotionNdemotion}/>
         ) }))
      }


    const location = useLocation()
    const { thisFeaturePerms } = location.state

    useEffect(() => {
        refresh();

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
            <div className="CardsDiv" >

                <Accordion defaultActiveKey="0" id="PositionCardHolder" alwaysOpen>
                    {showPositionCards()}
                </Accordion>

            </div>

       
        
        </div>
    )
}