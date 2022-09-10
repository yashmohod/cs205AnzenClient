import React, { useEffect } from "react";
import { API_URL } from "../../Utils/API";
import './Nav.css'
export default function Nav({setLoggedIn, loggedInUser}) {


    function logoutUserHandler() {
        localStorage.removeItem("token")
        document.location.replace("/")
        setLoggedIn(false)
    }


    return (<div className="nav">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-7 col-md-5 ">
                                <div className="ithaca-logo-container">
                                    <img src="https://www.planetforward.org/sites/default/files/styles/840-x-variable/public/154059_ithaca-college-logo-horizontal-for-ICpg.png?itok=AcYdum-L" alt="Ithaca-Logo" className="img-fluid mx-auto d-block ithaca-logo"/>
                                </div>
                                
                            </div>
                            <div className="col-3 col-md-2"></div>
                            <div className="col-2 col-md-5">
                                <div className="logout-logo-container">
                                { loggedInUser &&   <p className="m-2">{loggedInUser.email}</p>}
                                  
                                    <img src="https://cdn-icons-png.flaticon.com/512/126/126467.png" alt="Logout" onClick={() => logoutUserHandler()} className="logout-logo"/>
                                </div>
                            </div>
                        </div>
                    </div>
                       
                           
        
                       
                        
                       
                </div>)
}