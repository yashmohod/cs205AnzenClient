import React from "react";
import './ChangePassword.css'
import Nav from "../../Components/Nav/Nav";
import {Form, Button} from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL, post } from "../../Utils/API";


export default function ChangePassword({setLoggedIn, loggedInUser, autoLogin}) {

    function inputChangeHandler() {

    }

    async function changePassword() {
        //let response = await post(API_URL + "/")
        toast.success("Password for account with email: has been changed.")
    }

    return (
        <div>
                <ToastContainer/>
              <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
              <h1>Account Password Change</h1>
              <div className="container-fluid">
                <div className="row">
                    <div className="col-0 col-md-2"></div>
                    <div className="col-12 col-md-8">
                    <Form className="register-form-container p-5">
                           <div className="register-form">
 

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className=" d-flex justify-content-start">Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email" onChange={(e) => inputChangeHandler(e)}/>
              <Form.Label className=" d-flex justify-content-start">Confirm Email address</Form.Label>
              <Form.Control type="email" placeholder="Re-enter email" name="email_confirm" onChange={(e) => inputChangeHandler(e)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className=" d-flex justify-content-start">New Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" onChange={(e) => inputChangeHandler(e)}/>
              <Form.Label className=" d-flex justify-content-start">Confirm New Password</Form.Label>
              <Form.Control type="password" placeholder="Re-enter Password" name="password_confirm" onChange={(e) => inputChangeHandler(e)}/>
            </Form.Group>
   
            <Button variant="primary" type="button" onClick={() => changePassword()}>Change Password</Button>
            
            </div>
        </Form>

                    </div>
                    <div className="col-0 col-md-2"></div>
                </div>
             
        </div>
        </div>
    )
}