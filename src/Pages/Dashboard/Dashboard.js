import React, { useEffect, useState } from "react";
import Card from "../../Components/Card/Card";
import Nav from "../../Components/Nav/Nav";
import { Link } from "react-router-dom";
import './Dashboard.css'
import { API_URL, post } from "../../Utils/API";

export default function({loggedIn, setLoggedIn, loggedInUser}) {
    const [clockin, setClockin] = useState(false)

    async function clockIn() {
        let response = await post(API_URL + "/clockIn", {token: localStorage.getItem("token")})
        setClockin(true) 
    }

    async function clockOut() {
        let response = await post(API_URL + "/clockOut", {token: localStorage.getItem("token")})
        setClockin(false)
    }

    useEffect(() => {
        const checkClockinStatus = async () => {
            let response = await post(API_URL + "/checkClockInStatus", {token: localStorage.getItem("token")})
            if (response.clock_in === true) {
                setClockin(true)
            } else {
                setClockin(false)
            }
        }
        checkClockinStatus()
    }, [])

    const features = 
    [{title: "Daily", description:"Enter your report", url: "/daily"},
     {title: "Record", description:"View all records", url: "/record"},
     {title: "Referrals", description:"View all referrals", url: "/referrals"},
     {title: "Senior Eval", description:"Senior Evaluation for Probationary Members", url: "/senior-eval-for-proba-member"},
     {title: "Senior Eval", description:"Senior Evaluation for Junior Member", url: "/senior-eval-for-junior-member"},
     {title: "Trainee Eval", description:"SASP Evaluation for a Trainee", url: "/sasp-eval-for-trainee"},
     {title: "Incidents", description:"", url: "/incidents"},
     {title: "Locations", description:"", url: "/locations"},
     {title: "Employee Accounts", description:"", url: "/employee-accounts"},
     {title: "Register Accounts", description:"", url: "/register-accounts"},
     {title: "Change Passwords", description:"", url: "/change-passwords"},
    ]

    return (
    
        <div>
            <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
            <div className="features container-fluid mt-5 ">
                <div className="row">
                    <div className="col-12">
                        {clockin ?  <div onClick={() => clockOut()}><Card title="Clock Out" description="End your work shift"/></div> : <div onClick={() => clockIn()}><Card title="Clock In" description="Start your work shift"/></div> }
                    </div>
                </div>
                <div className="row  justify-content-center"  >
                        {features.map((item) => {
                            return (
                                <div className="row w-50">
                                    <Link to={item.url} className="feature-url" >
                                        <Card title={item.title} description={item.description} style={{font:"100px"}}/>
                                    </Link>
                                </div>
                            )
                        })}
                    
                </div>
            </div>

        </div>
    )
}