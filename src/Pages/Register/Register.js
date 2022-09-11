import { useState , React} from "react";
import Nav from "../../Components/Nav/Nav";
import { Form, Button } from 'react-bootstrap';
import './Register.css'
import { API_URL, post } from "../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Register({setLoggedIn, loggedInUser, autoLogin}) {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        collegeId: "",
        dob: "",
        organization: "",
        position: "",
        email: "",
        email_confirm: "",
        password: "",
        password_confirm: ""
    })


    async function registerHandler() {
       // let response = await post(API_URL + "/register", formData)
      //  console.log(response)
        toast.success("Account with email: " + formData.email + " has been created.")
        
    }

    function validateFormData() {

    }
    
    function inputChangeHandler(e) {
        setFormData({...formData,  [e.target.name] : e.target.value})
    }



    return (
    <div>
        <ToastContainer />
        <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
        <h1>Register Account</h1>
        <div className="container-fluid">
            <div className="row">
                <div className="col-0 col-md-2"></div>
                <div className="col-12 col-md-8">
                   
                           <Form className="register-form-container p-5">
                           <div className="register-form">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className=" d-flex justify-content-start">First Name</Form.Label>
              <Form.Control type="text" placeholder="" name="firstName" onChange={(e) => inputChangeHandler(e)} />

              <Form.Label className=" d-flex justify-content-start">Last Name</Form.Label>
              <Form.Control type="text" placeholder="" name="lastName" onChange={(e) => inputChangeHandler(e)}/>

              <Form.Label className=" d-flex justify-content-start">Student ID</Form.Label>
              <Form.Control type="text" placeholder="" name="collegeId" onChange={(e) => inputChangeHandler(e)}/>

              <Form.Label className=" d-flex justify-content-start">Date of Birth </Form.Label>
              <Form.Control type="date" placeholder="" name="dob" onChange={(e) => inputChangeHandler(e)}/>

              <Form.Label className=" d-flex justify-content-start">Organization</Form.Label>
              <Form.Control type="text" placeholder="" name="organization" onChange={(e) => inputChangeHandler(e)}/>

              
              <Form.Label className=" d-flex justify-content-start">Position</Form.Label>
              <Form.Control type="text" placeholder="" name="position" onChange={(e) => inputChangeHandler(e)}/>

            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className=" d-flex justify-content-start">Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="email" onChange={(e) => inputChangeHandler(e)}/>
              <Form.Label className=" d-flex justify-content-start">Confirm Email address</Form.Label>
              <Form.Control type="email" placeholder="Re-enter email" name="email_confirm" onChange={(e) => inputChangeHandler(e)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className=" d-flex justify-content-start">Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="password" onChange={(e) => inputChangeHandler(e)}/>
              <Form.Label className=" d-flex justify-content-start">Confirm Password</Form.Label>
              <Form.Control type="password" placeholder="Re-enter Password" name="password_confirm" onChange={(e) => inputChangeHandler(e)}/>
            </Form.Group>
   
            <Button variant="primary" type="button" onClick={() => registerHandler()}>Register</Button>
            
            </div>
        </Form>



                </div>
                <div className="col-0 col-md-2"></div>
            </div>
        </div>
        
     
    </div>
    )
}