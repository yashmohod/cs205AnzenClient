import React from "react";
import './Login.css';
// import Background from "ithaca-background.jpg";
import LoginForm from "../../../Components/LoginForm/LoginForm";
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect, useRef } from "react";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen";

export default function Login({loggedIn, setLoggedIn, setLoggedInUser, autoLogin}) {
//<img src={Background} alt="Ithaca College" className="background-image"/>
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        autoLogin()
        if(!(localStorage.getItem("message") === null)){
            toast.warning(String(localStorage.getItem("message")));
            localStorage.removeItem("message");
        }
    }, [])

    return (
        <div>
        {loading ? <LoadingScreen class="loading-screen-layer"/>: null}
        <div className="background" > 
            <div className="container-fluid">
                <div className="row">
                    <div className="col-1 col-md-4"></div>
                    <div className="col-10 col-md-4">
                        <div className="login-form">
                            <ToastContainer />
                            <LoginForm setLoggedIn={setLoggedIn} setLoggedInUser={setLoggedInUser} autoLogin={autoLogin} setLoading={setLoading}/>
                        </div>
                    </div>
                    <div className="col-1 col-md-4"></div>
                </div>
            </div>
        </div>
        </div>
    )
}