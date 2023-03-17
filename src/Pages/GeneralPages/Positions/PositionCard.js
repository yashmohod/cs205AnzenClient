/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useRef, useState } from "react";
import { API_URL, post,get } from "../../../Utils/API";
import { ToastContainer, toast } from 'react-toastify';
import { useLocation } from 'react-router-dom'

export default function({curpos}) {



    const location = useLocation()
    const { thisFeaturePerms } = location.state

    useEffect(() => {

    },[])


   

    return (
        
        <div>
        
        
        </div>
    )
}