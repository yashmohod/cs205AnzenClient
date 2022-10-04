/* eslint-disable react-hooks/exhaustive-deps */
import { useState , React, useEffect} from "react";
import { Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';


export default function TimePicker24H(props) {

    // const [time, setTime] = useState("");
    const[timeH,settimeH] = useState("00");
    const[timeM,settimeM] = useState("00");
    const [hours, setHours] = useState([]);
    const [minutes, setMinutes] = useState([]);
    
    function setHoursNminutes(){
        
        let Thours =[]
        let Tminutes =[]
        for (let i = 0; i <=24;i++) {Thours.push(String(i).padStart(2,"0"))}
        for (let i = 0; i <=60;i++) {Tminutes.push(String(i).padStart(2,"0"))}
        setHours(Thours)
        setMinutes(Tminutes)
    }
    function setTime(){
        let value = timeH+":"+timeM;
        let target={"value":value,"name":props.name}
        let e = {"target":target}
        props.inputChangeHandler(e)
    }
    function setTimeH(h){
        settimeH(h)
        setTime()
    }
    function setTimeM(m){
        settimeM(m)
        setTime()
    }
    useEffect(() => 
    {   setTime();
        setHoursNminutes();

    },[timeH,timeM])

    return ( 

        <InputGroup className="col justify-content-center " onChange={(e) =>setTime()}>
            <div>
            <Form.Label className=" d-flex justify-content-start">Hours</Form.Label>
            <Form.Select aria-label="Default select example" name="Hours" onChange={(e) =>setTimeH(e.target.value)}>
                {
                    hours.map((item) => {
                        return (
                        <option key={item}  >{item}</option>
                        )
                        
                        })
                }
            </Form.Select>
            </div>
            <div>
            <Form.Label className=" d-flex justify-content-start">Min</Form.Label>
            <Form.Select aria-label="Default select example" name="Min" onChange={(e) =>setTimeM(e.target.value)}>
                {
                    minutes.map((item) => {
                        return (
                        <option key={item}  >{item}</option>
                        )
                        
                        })
                }
            </Form.Select>
            </div>
        </InputGroup>
    )
}