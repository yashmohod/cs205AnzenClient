import React from "react";
import { useState } from "react";
import './Incidents.css'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Nav from "../../Components/Nav/Nav";

export default function Incidents() {
    const [startDate, setStartDate] = useState(new Date());


    return (
        <div>
            <Nav/>
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