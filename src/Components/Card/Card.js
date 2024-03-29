import React, { useEffect, useState } from "react";
import "./Card.css"

export default function Card(props) {
    const [styles,setstyle]= useState({})
    const [showDes,setshowDes]= useState(false)

    useEffect(() => {
        const style = props.style
        if(props.description!="" && props.description!=null){
            setshowDes(true)
        }
        setstyle(style)
    });

    return (
        <div className="card-container"  style={styles}>
            <div className="card-item" style={{color: "black"}}>     
                <h3>{props.title}</h3>
                <p>{props.description}</p>
            </div>
        </div>
    )
}