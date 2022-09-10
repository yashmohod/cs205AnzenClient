import React from "react";
import { useState, useEffect } from "react";
import './Incidents.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Nav from "../../Components/Nav/Nav";

export default function Incidents({setLoggedIn, loggedInUser, autoLogin}) {
    const [startDate, setStartDate] = useState(new Date());

    useEffect(() => {
        autoLogin()
    }, [])

    return (
        <div>
             <Nav setLoggedIn={setLoggedIn} loggedInUser={loggedInUser}/>
            <h1>Incidents</h1>
            <select name="cars" id="cars" className="mb-2">
                <option value="volvo">Accidental Property Damage</option>
                <option value="saab">Saab</option>
                <option value="mercedes">Mercedes</option>
                <option value="audi">Audi</option>
            </select>

           
            <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        </div>
    )
}