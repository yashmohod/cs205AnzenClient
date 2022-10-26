/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react";
import Card from "../../Components/Card/Card";
import Nav from "../../Components/Nav/Nav";
import './Dashboard.css'
import { API_URL, post,get } from "../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import {Features} from "./features"

export default function({loggedIn, setLoggedIn, loggedInUser}) {
    const [clockin, setClockin] = useState(false)
    const [org,setOrg] = useState("")
    const [pos,setPos]= useState("")
    const [showFeatures,setshowFeatures] =useState(false)

    function checkMessage(){
        if(!(localStorage.getItem("message") === null)){
            toast.success(String(localStorage.getItem("message")));
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
        const orgres = (await get(API_URL + "/getOrganization?token=" +  localStorage.getItem("token")))
        const posres = (await get(API_URL + "/getPosition?token=" +  localStorage.getItem("token")))
        setOrg(orgres["organization"])
        setPos(posres["position"])
        localStorage.setItem("organization", orgres["organization"])
        localStorage.setItem("position", posres["token"])
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
    [{org:"SASP",accessLevel:0,title: "Daily", description:"", url: "/SASPpages/daily", },
     {org:"SASP",accessLevel:0,title: "Records", description:"", url: "/SASPpages/Records", },
     {org:"SASP",accessLevel:0,title: "Referrals", description:"", url: "/SASPpages/referrals", },
     {org:"SASP",accessLevel:0,title: "Time Cards", description:"", url: "/time-cards",},
     {org:"SASP",accessLevel:2,title: "Senior Evaluation for Probationary Members", description:"", url: "/senior-eval-for-proba-member", external_url: "https://docs.google.com/forms/d/e/1FAIpQLSdhKZICw5BhHMp1ubDEJlFZEeVRVEOnx5iPDQieziG-fRl_vA/viewform"},
     {org:"SASP",accessLevel:2,title: "Senior Evaluation for Junior Member", description:"", url: "/senior-eval-for-junior-member", external_url: "https://docs.google.com/forms/d/e/1FAIpQLSc1Ihg_MKrxUjs37x1tjAtun0zCW7UznTrUbUzOpL0N25Oj_Q/viewform"},
     {org:"SASP",accessLevel:0,title: "SASP Evaluation for a Trainee", description:"", url: "/sasp-eval-for-trainee", external_url: "https://docs.google.com/forms/d/e/1FAIpQLSdoUWDh2nKgE8lSAvnRFQb0llbqCiYhjVBMDmkXhJQsP2d35Q/viewform"},
     {org:"SASP",accessLevel:4,title: "Incidents", description:"", url: "/SASPpages/incidents"},
     {org:"SASP",accessLevel:4,title: "Locations", description:"", url: "/SASPpages/locations",},
     {org:"SASP",accessLevel:3,title: "Employee Accounts", description:"", url: "/employee-accounts",},

     {org:"RESLIFE",accessLevel:0,title: "Time Cards", description:"", url: "/time-cards",},
     {org:"RESLIFE",accessLevel:0,title: "Employee Accounts", description:"", url: "/employee-accounts",},
    ]
    const Gstyle ={
        "height": "100px",
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        "margin": "5px",
        "background-color": "#8EC5FC",
        "background-image": "linear-gradient(62deg, #8EC5FC 50%, #00D100 100%)",
        "border-radius": "15px",
    }
    const Rstyle ={
        "height": "100px",
        "display": "flex",
        "flex-direction": "column",
        "justify-content": "center",
        "align-items": "center",
        "margin": "5px",
        "background-color": "#8EC5FC",
        "background-image": "linear-gradient(62deg, #8EC5FC 50%, #D10000 100%)",
        "border-radius": "15px",
    }

    return (
        
        <div>
        
        <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
        <ToastContainer />
        <div className="features container-fluid mt-5 ">
            <div className="row">
                <div className="col-12">
                    {clockin ?  <div onClick={() => clockOut()}><Card title="Clock Out" description="End your work shift" style={Rstyle}/></div> : <div onClick={() => clockIn()}><Card title="Clock In" description="Start your work shift" style={Gstyle}/></div> }
                </div>
            </div>
            <div className="row justify-content-center"  >
    
                { showFeatures ? <Features features={features} pos ={pos} org ={org}/> : null }

            </div>
        </div>

    </div>
    )
}