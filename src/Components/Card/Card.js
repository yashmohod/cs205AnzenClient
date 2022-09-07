import React from "react";
import "./Card.css"

export default function Card(props) {

    return (
        <div className="card-container">
            <div className="card-item">     
                <h3>{props.title}</h3>
                <p>{props.description}</p>
            </div>
        </div>
    )
}