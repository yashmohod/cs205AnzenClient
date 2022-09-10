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
    [{title: "Daily", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/daily"},
     {title: "Record", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/record"},
     {title: "Referrals", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/referrals"},
     {title: "Senior Evaluation for Probationary Members", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/senior-eval-for-proba-member"},
     {title: "Senior Evaluation for Junior Member", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/senior-eval-for-junior-member"},
     {title: "SASP Evaluation for a Trainee", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/sasp-eval-for-trainee"},
     {title: "Incidents", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/incidents"},
     {title: "Locations", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/locations"},
     {title: "Employee Accounts", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/employee-accounts"},
     {title: "Register Accounts", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/register-accounts"},
     {title: "Change Passwords", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/change-passwords"},
    ]

    return (
    
        <div>
            <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
            <div className="features container-fluid mt-5">
                <div className="row">
                    <div className="col-12" onClick={() => startClockin()}>
                        {clockin ?  <Card title="Clock Out" description="End your work shift"/> : <Card title="Clock In" description="Start your work shift"/> }
                    </div>
                </div>
                <div className="row">
                    {features.map((item) => {
                        return (
                            <div className="col-md-3">
                                <Link to={item.url} className="feature-url">
                                    <Card title={item.title} description={item.description}/>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}