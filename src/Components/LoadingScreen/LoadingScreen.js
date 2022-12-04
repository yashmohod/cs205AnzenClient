import React from "react";
import Spin from './Spin.svg'
import './LoadingScreen.css'

export default function LoadingScreen() {

    return (<div className="loading-screen">
                    <img src={Spin}/>
                </div>)
}