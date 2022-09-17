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
                    <div className="col-12">
                        {clockin ?  <div onClick={() => clockOut()}><Card title="Clock Out" description="End your work shift"/></div> : <div onClick={() => clockIn()}><Card title="Clock In" description="Start your work shift"/></div> }
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