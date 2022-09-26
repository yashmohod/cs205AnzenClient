import React, { useEffect, useState } from "react";
import Card from "../../Components/Card/Card";
import Nav from "../../Components/Nav/Nav";
import { Link } from "react-router-dom";
import './Dashboard.css'
import { API_URL, post } from "../../Utils/API";

export default function({loggedIn, setLoggedIn, loggedInUser}) {
    const [clockin, setClockin] = useState(false)
    const org = localStorage.getItem("organization")
    const pos = localStorage.getItem("position")
    let accessLevel =null;

    /*  
    Sasp access level

    Probationary Member =0
    Junior Member =1
    Senior Member =2
    Executive Board Member =3
    admin = 4

     */
    if(org=='SASP'){
        if(pos == "Probationary Member"){
            accessLevel =0;
        }
        else if(pos == "Junior Member"){
            accessLevel =1;
        }
        else if(pos == "Senior Member"){
            accessLevel =2;
        }
        else if(pos == "Executive Board Member"){
            accessLevel =3;
        }else if(pos == "admin"){
            accessLevel = 4
        }
        else{
            accessLevel= null
        }
        
    }


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
    [{org:"SASP",accesslevl:0,title: "Daily", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/daily"},
     {org:"SASP",accesslevl:0,title: "Record", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/record"},
     {org:"SASP",accesslevl:0,title: "Referrals", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/referrals"},
     {org:"SASP",accesslevl:2,title: "Senior Evaluation for Probationary Members", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/senior-eval-for-proba-member", external_url: "https://docs.google.com/forms/d/e/1FAIpQLSdhKZICw5BhHMp1ubDEJlFZEeVRVEOnx5iPDQieziG-fRl_vA/viewform"},
     {org:"SASP",accesslevl:2,title: "Senior Evaluation for Junior Member", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/senior-eval-for-junior-member", external_url: "https://docs.google.com/forms/d/e/1FAIpQLSc1Ihg_MKrxUjs37x1tjAtun0zCW7UznTrUbUzOpL0N25Oj_Q/viewform"},
     {org:"SASP",accesslevl:0,title: "SASP Evaluation for a Trainee", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/sasp-eval-for-trainee", external_url: "https://docs.google.com/forms/d/e/1FAIpQLSdoUWDh2nKgE8lSAvnRFQb0llbqCiYhjVBMDmkXhJQsP2d35Q/viewform"},
     {org:"SASP",accesslevl:4,title: "Incidents", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/incidents"},
     {org:"SASP",accesslevl:4,title: "Locations", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/locations"},
     {org:"SASP",accesslevl:3,title: "Employee Accounts", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/employee-accounts"},
     {org:"SASP",accesslevl:4,title: "Register Accounts", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/register-accounts"},
     {org:"SASP",accesslevl:4,title: "Change Passwords", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/change-passwords"},
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
                        console.log(item.accesslevl)
                        if(item.accesslevl <= accessLevel  && org == item.org){
                            return (
                                <div className="row w-50">
                                    <Link to={item.url} className="feature-url" >
                                        <Card title={item.title} description={item.description} />
                                    </Link>
                                </div>
                            )
                        }
                        
                    })}
                
            </div>
        </div>

    </div>
    )
}