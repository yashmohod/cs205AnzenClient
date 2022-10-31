import React from "react";
import { useState, useEffect, useRef } from "react";
import './TimeCards.css'
import "react-datepicker/dist/react-datepicker.css";
import Nav from "../../../Components/Nav/Nav";
import {AgGridReact} from 'ag-grid-react';
import 'ag-grid-community/styles//ag-grid.css';
import 'ag-grid-community/styles//ag-theme-alpine.css';
import {Form, Button} from 'react-bootstrap'
import { API_URL, get, post } from "../../../Utils/API";
import CommonButton from '../../../Components/Buttons/CommonButton'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import Modal from 'react-bootstrap/Modal';

export default function TimeCards({setLoggedIn, loggedInUser, autoLogin}) {
   

    useEffect(() => {
        autoLogin()

        
    }, [])


    // window.addEventListener('resize', handleResize)

    return (
        <div className="incident-page">
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
             <ToastContainer />
            <h1>Time Cards</h1>
            <Form className="incident-form">
                {/* <Button variant="outline-dark" onClick={() => navigate("/register-accounts")}>Add Account</Button> */}
                {/* <Button variant="primary" onClick={handleShow}>
                  Launch static backdrop modal
                </Button> */}
            </Form>



        </div>
    )
}