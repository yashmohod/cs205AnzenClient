import React from "react";
import './Login.css';
import Background from "../../Images/ithaca-background.jpg";
import LoginForm from "../../Components/LoginForm/LoginForm";

export default function Login({loggedIn, setLoggedIn}) {
//<img src={Background} alt="Ithaca College" className="background-image"/>
    return (
        <div className="background" > 
            <div className="container-fluid">
                <div className="row">
                    <div className="col-1 col-md-4"></div>
                    <div className="col-10 col-md-4">
                        <div className="login-form">
                            <LoginForm setLoggedIn={setLoggedIn}/>
                        </div>
                    </div>
                    <div className="col-1 col-md-4"></div>
                </div>
            </div>
        </div>
    )
}