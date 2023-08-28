import React from "react";
import './Login.css';
import LoginForm from "../../../Components/LoginForm/LoginForm";
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect} from "react";
import LoadingScreen from "../../../Components/LoadingScreen/LoadingScreen";

export default function Login({autoLogin}) {
    const [loading, setLoading] = useState(false)
    
    useEffect(() => {
        autoLogin()
    }, [])

    return (
        <div className="login-form-container">
        {loading ? <LoadingScreen className="loading-screen-layer"/>: null}
        <div className="background"> 
            <div className="container-fluid">
                <div className="row">
                    <div className="col-1 col-md-4"></div>
                    <div className="col-10 col-md-4">
                        <div className="login-form">
                            <LoginForm autoLogin={autoLogin} setLoading={setLoading}/>
                        </div>
                    </div>
                    <div className="col-1 col-md-4"></div>
                </div>
            </div>
        </div>
        </div>
    )
}