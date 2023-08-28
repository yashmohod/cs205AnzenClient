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
import useFetch from "../../../hooks/useFetch";
export default function Positions({loggedIn, setLoggedIn, loggedInUser,autoLogin}) {

    const [positions,setPositions] = useState([]);
    const {REQUEST: fetcher} = useFetch()
    // const [promotionD, setPromotionD] = useState([]);
    const gridRef = useRef();
    const defaultColDef= { resizable: true}

    const [posModal, seltPosModal] = useState(false);
    const handleadClose_posModal = () => seltPosModal(false);
    const handleadShow_posModal = () => seltPosModal(true);
    const [isAdd, setIsAdd] = useState();

    const [positionData, setPositionData] = useState({
        "PosName":"",
        "title":"",
        "availableNoPos":"",
    });



    async function getpositions(){
        // console.log(thisFeaturePerms)
        let response = await get(API_URL + "/getPositions?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org);
        // var positionAll = Array.from(response.positions);
        var positionAll = response.positions;


        for(let position of positionAll){
            let dataGrid =[];
            for(let otherPositions of positionAll){
                if(position.id != otherPositions.id){
                    let isPromote = false;
                    console.log(position.promoteTo)
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
        // console.log(positionAll);
    
        console.log(positionAll)
        setPositions(positionAll);

    }


    async function addPositions(){
        console.log(positionData);
        let response = await post(API_URL + "/addPosition",  {
            token: localStorage.getItem("token"),
            org: thisFeaturePerms.org,
            PosName:positionData.PosName,
            title:positionData.title,
            availableNoPos:positionData.availableNoPos,

        });
        if(response.status == 200){
            toast.success(response.message);
        }else{
            toast.warning(response.message);
        }
        handleadClose_posModal();
        setPositionData({
            "id":"",
            "PosName":"",
            "title":"",
            "availableNoPos":"",
        });
        refresh();
    }

    async function deletePositions(positionID){
        let response = await fetcher("POST", "/deletePosition",  {id :positionID ,token: localStorage.getItem("token"), org : thisFeaturePerms.org});
        if (response.status === 200) {
            toast.success(String(response["message"]));

        } else {
            toast.warning(String(response["message"] ));
        }
        refresh();
    }

    const [editData,setEditData]= useState({
        "id":"",
        "PosName":"",
        "title":"",
        "availableNoPos":"",
    });
    function editDataChangeHandler(e){
        setEditData({...editData,  [e.target.name] : e.target.value})
        console.log(editData)
        }

    function editPositions(curPos){
        setEditData({
            "id":curPos.id,
            "PosName":curPos.PosName,
            "title":curPos.title,
            "availableNoPos":curPos.availableNoPos,
        })
        handleadShow_posModal();
        setIsAdd(false);

        
    }
    async function editPositionsSubmit(){
        // console.log(editData)
        let response = await fetcher("POST", "/editPosition",  {
            id :editData.id,
            PosName:editData.PosName,
            title:editData.title, 
            availableNoPos:editData.availableNoPos,
            token: localStorage.getItem("token"), 
            org : thisFeaturePerms.org});
        if (response.status === 200) {
            toast.success(String(response["message"]));
            setEditData({
                "id":"",
                "PosName":"",
                "title":"",
                "availableNoPos":"",})
            handleadClose_posModal();
            refresh();

        } else {
            toast.warning(String(response["message"] ));
        }
    }

    async function addPositionsSubmit(){
        console.log(positionData)
        let response = await fetcher("POST", "/addPosition",  {
            PosName:positionData.PosName,
            title:positionData.title, 
            availableNoPos:positionData.availableNoPos,
            token: localStorage.getItem("token"), 
            org : thisFeaturePerms.org});
        if (response.status === 200) {
            toast.success(String(response["message"]));
            setPositionData({
                "PosName":"",
                "title":"",
                "availableNoPos":"",})
            handleadClose_posModal();
            refresh();

        } else {
            toast.warning(String(response["message"] ));
        }
    }
    


    
    async function edit_promotionNdemotion(transitionOf, transitionTo, isPromotion, updateValue ){
        // set_promotionsNdemotions
        // console.log(transitionOf)
        // console.log(transitionTo)
        // console.log(isPromotion)
        // console.log(updateValue)
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
        // console.log(thisFeaturePerms)
    }

    function showPositionCards(){
        // console.log(positions)s
        return(
        positions.map(element => {
          return(
          <PositionCard keyNum={positions.indexOf(element)} curpos={element} editPermissions={editPermissions}  edit_promotionNdemotion={edit_promotionNdemotion} editPositions={editPositions} deletePositions = {deletePositions}/>
         ) }))
      }

    function addPositionChangeHandler(e){
    setPositionData({...positionData,  [e.target.name] : e.target.value})
    }


    const location = useLocation()
    const { thisFeaturePerms } = location.state

    useEffect(() => {
        refresh();

    },[])


    
   

    return (
        
        <div>
             <ToastContainer />
            <h1>Positions</h1>
            <div className="">
                <div className="row">
                    <div className="col-12">
                        <Form className="position-form">
                            <Button onClick={() =>{setIsAdd(true);handleadShow_posModal();}}>Add</Button>
                        </Form>
                    </div>
                </div>
            </div>
            <div className="ag-theme-alpine incident-grid">
                <div className="col" id="CardsDiv" >
                    <Accordion defaultActiveKey="0" id="PositionCardHolder" alwaysOpen>
                        {showPositionCards()}
                    </Accordion>

                </div>
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
                {isAdd?
                <div className="register-form">
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label className=" d-flex justify-content-start">Positions Name</Form.Label>
                    <Form.Control type="text" placeholder="" name="PosName" onChange={(e) =>addPositionChangeHandler(e)}/>
                    <Form.Label className=" d-flex justify-content-start">Title</Form.Label>
                    <Form.Control type="text" placeholder="" name="title" onChange={(e) => addPositionChangeHandler(e)}/>
                    <Form.Label className=" d-flex justify-content-start">Available Positions #</Form.Label>
                    <Form.Control type="number" placeholder="" name="availableNoPos" onChange={(e) => addPositionChangeHandler(e)}/>
                    </Form.Group>
                </div>
                :
                <div className="register-form">
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label className=" d-flex justify-content-start">Positions Name</Form.Label>
                    <Form.Control type="text" placeholder="" name="PosName" value = {editData.PosName} onChange={(e) =>editDataChangeHandler(e)}/>
                    <Form.Label className=" d-flex justify-content-start">Title</Form.Label>
                    <Form.Control type="text" placeholder="" name="title" value = {editData.title} onChange={(e) => editDataChangeHandler(e)}/>
                    <Form.Label className=" d-flex justify-content-start">Available Positions #</Form.Label>
                    <Form.Control type="number" placeholder="" name="availableNoPos" value = {editData.availableNoPos} onChange={(e) => editDataChangeHandler(e)}/>
                    </Form.Group>
                </div>
                }
            </Modal.Body>
            <Modal.Footer>
                {isAdd?
                <Button variant="primary" onClick={()=>addPositionsSubmit()}>Submit</Button>:
                <Button variant="primary" onClick={()=>editPositionsSubmit()}>Submit</Button>}
            </Modal.Footer>
        </Modal>
       
        
        </div>
    )
}