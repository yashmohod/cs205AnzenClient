import React from "react";
import Card from "../../Components/Card/Card";
import { API_URL } from "../../Utils/API";

export default function({loggedIn, setLoggedIn}) {
    const features = 
    [{title: "Daily", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
     {title: "Record", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
     {title: "Referrals", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
     {title: "Senior Evaluation for Probationary Members", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
     {title: "Senior Evaluation for Junior Member", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
     {title: "SASP Evaluation for a Trainee", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
     {title: "Incidents", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
     {title: "Locations", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
     {title: "Employee Accounts", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."},
    ]

    return (
    
        <div>
            <img src="https://www.planetforward.org/sites/default/files/styles/840-x-variable/public/154059_ithaca-college-logo-horizontal-for-ICpg.png?itok=AcYdum-L" alt=""/>
            <p>Hello</p>
            <p>{API_URL}</p>
            <button onClick={() => setLoggedIn(false)}>Log Out</button>
            <div className="features container-fluid">
                <div className="row">
                    {features.map((item) => {
                        return (
                            <div className="col-md-3">
                                <Card title={item.title} description={item.description} />
                            </div>
                        )
                       
                    })}
                </div>
            </div>
        </div>
    )
}