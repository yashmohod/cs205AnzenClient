/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react";
import Card from "../../Components/Card/Card";
import Nav from "../../Components/Nav/Nav";
import './Dashboard.css'
import { API_URL, post } from "../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import {Features} from "./features"

export default function({loggedIn, setLoggedIn, loggedInUser}) {
    const [clockin, setClockin] = useState(false)
    const [org,setorg] = useState("")
    const [pos,setpos]= useState("")
    const [showFeatures,setshowFeatures] =useState(false)

    function checkMessage(){
        if(!(localStorage.getItem("message") === null)){
            toast.success(String(localStorage.getItem("message")));
            console.log(localStorage.getItem("message"));
            localStorage.removeItem("message");
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
    
    async function setFeatures(){
        const orgres = (await post(API_URL + "/getOrganization", {token: localStorage.getItem("token")}))
        const posres = (await post(API_URL + "/getPosition", {token: localStorage.getItem("token")}))
        setorg(orgres["organization"])
        setpos(posres["position"])
        console.log(org)
        console.log(pos)
        setshowFeatures(true)
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
        checkMessage()
        setFeatures()
    },[])
    const features = 
    [{org:"SASP",accessLevel:0,title: "Daily", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/SASPpages/daily"},
     {org:"SASP",accessLevel:0,title: "Records", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/SASPpages/record"},
     {org:"SASP",accessLevel:0,title: "Referrals", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/SASPpages/referrals"},
     {org:"SASP",accessLevel:2,title: "Senior Evaluation for Probationary Members", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/senior-eval-for-proba-member", external_url: "https://docs.google.com/forms/d/e/1FAIpQLSdhKZICw5BhHMp1ubDEJlFZEeVRVEOnx5iPDQieziG-fRl_vA/viewform"},
     {org:"SASP",accessLevel:2,title: "Senior Evaluation for Junior Member", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/senior-eval-for-junior-member", external_url: "https://docs.google.com/forms/d/e/1FAIpQLSc1Ihg_MKrxUjs37x1tjAtun0zCW7UznTrUbUzOpL0N25Oj_Q/viewform"},
     {org:"SASP",accessLevel:0,title: "SASP Evaluation for a Trainee", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/sasp-eval-for-trainee", external_url: "https://docs.google.com/forms/d/e/1FAIpQLSdoUWDh2nKgE8lSAvnRFQb0llbqCiYhjVBMDmkXhJQsP2d35Q/viewform"},
     {org:"SASP",accessLevel:4,title: "Incidents", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/SASPpages/incidents"},
     {org:"SASP",accessLevel:4,title: "Locations", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/SASPpages/locations"},
     {org:"SASP",accessLevel:3,title: "Employee Accounts", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/employee-accounts"},
     {org:"SASP",accessLevel:4,title: "Register Accounts", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/register-accounts"},
     {org:"SASP",accessLevel:4,title: "Change Passwords", description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.", url: "/change-passwords"},
    ]

    return (
        
        <div>
        
        <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
        <ToastContainer />
        <div className="features container-fluid mt-5 ">
            <div className="row">
                <div className="col-12">
                    {clockin ?  <div onClick={() => clockOut()}><Card title="Clock Out" description="End your work shift"/></div> : <div onClick={() => clockIn()}><Card title="Clock In" description="Start your work shift"/></div> }
                </div>
            </div>
            <div className="row  justify-content-center"  >
                    
            { showFeatures ? <Features features={features} pos ={pos} org ={org}/> : null }
            </div>
        </div>

    </div>
    )
}