import React, { useState } from "react";
import Card from "../../Components/Card/Card";
import { API_URL } from "../../Utils/API";
import Nav from "../../Components/Nav/Nav";
import { Link } from "react-router-dom";
import './Dashboard.css'

export default function({loggedIn, setLoggedIn, loggedInUser}) {
    const [clockin, setClockin] = useState(false)

    function startClockin() {
        setClockin(!clockin)
    }

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
                    <div className="col-12" onClick={() => startClockin()}>
                        {clockin ?  <Card title="Clock Out" description="End your work shift"/> : <Card title="Clock In" description="Start your work shift"/> }
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