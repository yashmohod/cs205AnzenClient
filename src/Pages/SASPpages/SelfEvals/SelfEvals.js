import React, { useCallback, useEffect, useRef, useState } from "react";
import './SelfEvals.css'
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import DeleteButton from '../../../Components/Buttons/DeleteButton'
import EditButton from '../../../Components/Buttons/EditButton'
import {Accordion, Button, Form, Modal} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import useFetch from "../../../hooks/useFetch";
import { AG_THEME_CLASS } from "../../../Utils/AG-Grid.js";
import { useLocation } from 'react-router-dom'
import { API_URL, post,get } from "../../../Utils/API";



export default function SelfEvals({autoLogin}) {

    const[SelfEvals,setSelfEvals] = useState([])
    async function getEvals(){
        let response = await get(API_URL + "/************?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org);
        if(response.status == 200){
            setSelfEvals(response.links);
            // console.log(response.links)
        }else{
            toast.error(response.message)
        }
    }

    const [posModal, seltPosModal] = useState(false);
    const handleadClose_posModal = () => seltPosModal(false);
    const handleadShow_posModal = () => seltPosModal(true);
    const [isAdd, setIsAdd] = useState();

    const [addData, setAddData] = useState({
        "linkName":"",
        "url":"",
    });
    function addDataChangeHandler(e){
        setAddData({...addData,  [e.target.name] : e.target.value})
        }

    async function addEval(){


        
    }

    const [editData,setEditData]= useState({
        "id":"",
        "linkName":"",
        "url":"",
    });
    function editDataChangeHandler(e){
        setEditData({...editData,  [e.target.name] : e.target.value})
        }

    function editEval(curLink){
        setEditData({
            "id":curLink.id,
            "linkName":curLink.linkName,
            "url":curLink.url,
        })
        setIsAdd(false);
        handleadShow_posModal();
        
    }
    async function editEvalSubmit(){
        
    }
    
    async function deleteEval(SelfEvalId){
        let response = await post(API_URL + "/deleteLink",  {
            token: localStorage.getItem("token"),
            id:SelfEvalId,
            org: thisFeaturePerms.org,

        });
        if(response.status == 200){
            toast.success(response.message);

            getEvals()
        }else{
            toast.warning(response.message);
        }
    }

    const [positions,setPositions] = useState([])
    async function getpositions(){

        let response = await get(API_URL + "/getPositions?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org);
        var positionAll = response.positions;
        setPositions(positionAll)
        console.log(positionAll)
    }

    async function updateEvalVisibility(prop,e,org){
        // console.log(prop.data)
        // console.log(e)
        // console.log(org)

        let response = await post(API_URL + "/updateLinkVisibility",  {
            token: localStorage.getItem("token"),
            posId:prop.data.posId,
            linkId:prop.data.linkId,
            org: thisFeaturePerms.org,
            value: e,
        });
        if(response.status == 200){
            toast.success(response.message);

            getEvals()
        }else{
            toast.warning(response.message);
        }
    }

    

    useEffect(() => {
        autoLogin();
        getEvals();
        getpositions();

    }, []);

    const locationPrem = useLocation()
    const {thisFeaturePerms} = locationPrem.state


    return (
        <div className="location-page">
            <ToastContainer />
            {thisFeaturePerms.create?
            <div className="container-fluid m-5">
                <div className="row">
                    <div className="col">
                        <h1>{thisFeaturePerms.org} Self Evals</h1>
                        <Form className="location-form">
                            <Button onClick={() => {handleadShow_posModal(); setIsAdd(true);}}>Add</Button>
                        </Form>
                    </div>
                </div>
            </div>:null}













        <Modal>
            <Modal.Header closeButton>
            <Modal.Title>{isAdd?"Add Position":"Edit Position"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isAdd?
                <div className="register-form">
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label className=" d-flex justify-content-start">Link Name</Form.Label>
                    <Form.Control type="text" placeholder="" name="linkName" onChange={(e) =>addDataChangeHandler(e)}/>
                    
                    </Form.Group>
                </div>
                :
                <div className="register-form">
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label className=" d-flex justify-content-start">Link Name</Form.Label>
                    <Form.Control type="text" placeholder="" name="linkName" value = {editData.linkName} onChange={(e) =>editDataChangeHandler(e)}/>
                    
                    </Form.Group>
                </div>
                }
            </Modal.Body>
            <Modal.Footer>
                {isAdd?
                <Button variant="primary" onClick={()=>addEval()}>Submit</Button>:
                <Button variant="primary" onClick={()=>editEvalSubmit()}>Submit</Button>}
            </Modal.Footer>
        </Modal>
           

            
        </div>
    )
}


