import { hover } from "@testing-library/user-event/dist/hover";
import React, { useEffect, useState, useState } from "react";
import { API_URL } from "../../Utils/API";
import './Nav.css'
import { useNavigate,useLocation } from "react-router-dom";
import { BsHouse,BsHouseFill } from "react-icons/bs";
export default function Nav({setLoggedIn, loggedInUser}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [showmore,setshowmore] = useState(false)
    const [darkHome,setDarkHome] = useState(false)
    function home() {
        navigate("/")
        console.log(location.pathname)
    }

    function logoutUserHandler() {
        localStorage.removeItem("token")
        document.location.replace("/")
        setLoggedIn(false)
    }
    useEffect(() => {
        if(location.pathname != "/"){
            setshowmore(true)
        }
    })
        const [hovered,setHovered] = useState(false)
    function changeHoverFalse() {
        setHovered(false)
    }

    function changeHoverTrue() {
        setHovered(true)
    }


    return (<div className="nav">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-7 col-md-5 " >
                                <div className="ithaca-logo-container" >
                                    <img src="https://www.planetforward.org/sites/default/files/styles/840-x-variable/public/154059_ithaca-college-logo-horizontal-for-ICpg.png?itok=AcYdum-L" alt="Ithaca-Logo"  className="img-fluid mx-auto d-block ithaca-logo"/>
                                </div>
                                
                            </div>
                            <div className="col-3 col-md-2"></div>
                            <div className="col-2 col-md-5">
                                <div className="logout-logo-container">
                                { loggedInUser &&   <p className="m-2">{loggedInUser.email}</p>}
                                    <div onMouseEnter={() => changeHoverTrue()} onMouseLeave={() => changeHoverFalse()} onClick={() => logoutUserHandler()}>
                                        {hovered ? <img src="https://cdn-icons-png.flaticon.com/512/4043/4043198.png" alt="Logout" onClick={() => logoutUserHandler()} className="logout-logo"/>   : <img src="https://cdn-icons-png.flaticon.com/512/126/126467.png" alt="Logout"  className="logout-logo"/>}
                                    </div>
                                 
                                </div>
                            </div>
                        </div>
                        {showmore ? 
                        <div className='row-12'>
                            <div className="col-4 col-sm-6 h-25">
                                <div className="col-lg-2 col-sm-4" onMouseEnter={()=>setDarkHome(true)} onMouseLeave={()=>setDarkHome(false)}>
                                    {darkHome? <BsHouseFill size={50} onClick={()=>home()} />:<BsHouse size={50} onClick={()=>home()}/>}
                                </div>
                            </div>
                        </div>
                        :null}
                    </div>
                       
                           
        
                       
                        
                       
                </div>)
}
