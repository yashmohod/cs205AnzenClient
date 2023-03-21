/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef, useState } from "react";
import Nav from "../../../Components/Nav/Nav";
import { API_URL, post,get } from "../../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import {AgGridReact} from 'ag-grid-react';
import { useLocation } from 'react-router-dom'
import {Accordion, Button, Form, Modal} from 'react-bootstrap';
import PositionCard from "../../../Components/PositionCard/PositionCard"
import "./position.css"
export default function({loggedIn, setLoggedIn, loggedInUser,autoLogin}) {

    const [positions,setPositions] = useState([]);
    // const [promotionD, setPromotionD] = useState([]);
    const gridRef = useRef();
    const defaultColDef= { resizable: true}

    const [posModal, seltPosModal] = useState(false);
    const handleadClose_posModal = () => seltPosModal(false);
    const handleadShow_posModal = () => seltPosModal(true);
    const [isAdd, setIsAdd] = useState();

    const [positionData, setPositionData] = useState({
        "id":"",
        "OrgName":"",
        "PosName":"",
        "title":"",
        "availableNoPos":"",
    });



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
        console.log(positionData);
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
    

    async function editPermissions(prop,e,org){
        console.log(prop)
        const value = e
        const permissionName = prop.colDef.field
        const featureName = prop.data.featureName

        let response = await post(API_URL + "/updatePermission",  {
            token: localStorage.getItem("token"),
            permId: prop.data.id,
            featureName:featureName,
            permissionName:permissionName,
            value:value,
            org:org,
            isPositionPermission:true,
        });
        if(response.status ==200){
            toast.success(response.message);
        }else{
            toast.warning(response.message);
        }
    
      }
    

    function refresh(){
        autoLogin();
        getpositions();
    }

    function showPositionCards(){
  
        return(
        positions.map(element => {
          return(
          <PositionCard keyNum={positions.indexOf(element)} curpos={element} editPermissions={editPermissions}  edit_promotionNdemotion={edit_promotionNdemotion}/>
         ) }))
      }

    function inputPasswordChangeHandler(e){
    setPositionData({...positionData,  [e.target.name] : e.target.value})
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
                            <Button onClick={() =>{setIsAdd(true);handleadShow_posModal();}}>Add</Button>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="CardsDiv" >

                <Accordion defaultActiveKey="0" id="PositionCardHolder" alwaysOpen>
                    {showPositionCards()}
                </Accordion>

            </div>
            <Modal
            show={posModal}
            onHide={handleadClose_posModal}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
            <Modal.Title>{isAdd?"Add Position":"Edit Position"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="register-form-container p-5">
                    <div className="register-form">
                        <Form.Group className="mb-3" controlId="formBasicFirstName">
                        <Form.Label className=" d-flex justify-content-start">Positions Name</Form.Label>
                        <Form.Control type="text" placeholder="" name="PosName" onChange={(e) =>inputPasswordChangeHandler(e)}/>
                        <Form.Label className=" d-flex justify-content-start">Confirm Password</Form.Label>
                        <Form.Control type="text" placeholder="" name="title" onChange={(e) => inputPasswordChangeHandler(e)}/>
                        <Form.Label className=" d-flex justify-content-start">Available Positions #</Form.Label>
                        <Form.Control type="number" placeholder="" name="availableNoPos" onChange={(e) => inputPasswordChangeHandler(e)}/>
                        </Form.Group>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={()=>addPositions()}>Submit</Button>
            </Modal.Footer>
        </Modal>
       
        
        </div>
    )
}