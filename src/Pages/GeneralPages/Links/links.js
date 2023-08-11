import React, { useCallback, useEffect, useRef, useState } from "react";
import './links.css'
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

import LinkCard from "../../../Components/LinkCard/LinkCard"

export default function Links({autoLogin}) {


    const[links,setLinks] = useState([])
    async function getLinks(){
        let response = await get(API_URL + "/getOrgLinks?token=" +  localStorage.getItem("token")+"&org="+thisFeaturePerms.org);
        if(response.status == 200){
            setLinks(response.links);
            console.log(response.links)
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

    async function addLink(){
        // console.log(addData)
        if(urlValidator()){
            let response = await post(API_URL + "/addLink",  {
                token: localStorage.getItem("token"),
                org: thisFeaturePerms.org,
                linkName:addData.linkName,
                url:addData.url,
    
            });
            if(response.status == 200){
                toast.success(response.message);
                setAddData({
                    "linkName":"",
                    "url":"",
                })
                handleadClose_posModal()
                getLinks()
            }else{
                toast.warning(response.message);
            }
        }else{
            toast.warning("URL format wrong.\n Should be in this format: https://www.website.com");
        }
        
    }

    const [editData,setEditData]= useState({
        "id":"",
        "linkName":"",
        "url":"",
    });
    function editDataChangeHandler(e){
        setEditData({...editData,  [e.target.name] : e.target.value})
        }

    function editLink(curLink){
        setEditData({
            "id":curLink.id,
            "linkName":curLink.linkName,
            "url":curLink.url,
        })
        setIsAdd(false);
        handleadShow_posModal();
        
    }
    async function editLinkSubmit(){
        if(urlValidator()){
            let response = await post(API_URL + "/editLink",  {
                token: localStorage.getItem("token"),
                id:editData.id,
                org: thisFeaturePerms.org,
                linkName:editData.linkName,
                url:editData.url,

            });
            if(response.status == 200){
                toast.success(response.message);
                setEditData({
                    "id":"",
                    "linkName":"",
                    "url":"",
                })
                handleadClose_posModal()
                getLinks()
            }else{
                toast.warning(response.message);
            }
        }else{
            toast.warning("URL format wrong.\n Should be in this format: https://www.website.com");
        }
    }
    
    async function deleteLink(linkId){
        let response = await post(API_URL + "/deleteLink",  {
            token: localStorage.getItem("token"),
            id:linkId,
            org: thisFeaturePerms.org,

        });
        if(response.status == 200){
            toast.success(response.message);

            getLinks()
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

    async function updateLinkVisibility(prop,e,org){
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

            getLinks()
        }else{
            toast.warning(response.message);
        }
    }

    function urlValidator(){
        const isValidUrl = urlString=> {
            var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
          '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
          '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
          '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
          '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
        return !!urlPattern.test(urlString);
      }
        if(isAdd){
            console.log(isValidUrl(addData.url))
            return isValidUrl(addData.url)
        }else{
            console.log(isValidUrl(editData.url))
            return isValidUrl(editData.url)
        }
        // return false
    }


    function showLinksCards(){
        return(
            links.map(element => {
          return(
          <LinkCard keyNum={links.indexOf(element)}  curLink={element} deleteLink={deleteLink} editLink={editLink} positions={positions} userperms= {thisFeaturePerms} updateLinkVisibility={updateLinkVisibility}/>
         ) }))
      }
    

    useEffect(() => {
        autoLogin();
        getLinks();
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
                        <h1>{thisFeaturePerms.org} Links</h1>
                        <Form className="location-form">
                            <Button onClick={() => {handleadShow_posModal(); setIsAdd(true);}}>Add</Button>
                        </Form>
                    </div>
                </div>
            </div>:null}

            <div className="ag-theme-alpine incident-grid">
                <div className="col" id="CardsDiv" >
                    <Accordion defaultActiveKey="0" id="PositionCardHolder" alwaysOpen>
                        {showLinksCards()}
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
                    <Form.Label className=" d-flex justify-content-start">Link Name</Form.Label>
                    <Form.Control type="text" placeholder="" name="linkName" onChange={(e) =>addDataChangeHandler(e)}/>
                    <Form.Label className=" d-flex justify-content-start">URL</Form.Label>
                    <Form.Control type="url" placeholder="" name="url" onChange={(e) => addDataChangeHandler(e)}/>
                    </Form.Group>
                </div>
                :
                <div className="register-form">
                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                    <Form.Label className=" d-flex justify-content-start">Link Name</Form.Label>
                    <Form.Control type="text" placeholder="" name="linkName" value = {editData.linkName} onChange={(e) =>editDataChangeHandler(e)}/>
                    <Form.Label className=" d-flex justify-content-start">URL</Form.Label>
                    <Form.Control type="url" placeholder="" name="url" value = {editData.url} onChange={(e) => editDataChangeHandler(e)}/>
                    </Form.Group>
                </div>
                }
            </Modal.Body>
            <Modal.Footer>
                {isAdd?
                <Button variant="primary" onClick={()=>addLink()}>Submit</Button>:
                <Button variant="primary" onClick={()=>editLinkSubmit()}>Submit</Button>}
            </Modal.Footer>
        </Modal>

            
        </div>
    )
}


