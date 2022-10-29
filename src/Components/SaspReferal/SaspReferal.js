/* eslint-disable react-hooks/exhaustive-deps */
import { useState , React, useEffect} from "react";
import { Form} from 'react-bootstrap';
import InputGroup from 'react-bootstrap/InputGroup';
import { ToastContainer, toast } from 'react-toastify';


export default function SaspReferal(props) {
    const [refdata,setrefdata] =useState({
        "index":props.index,
        "firstName" :"",
        "middleInitial" :"",
        "lastName" :"",
        "ICID" :"",
        "dob" :"",
        "phoneNo" :"",
        "address" :"",
        
      })
      function inputHandler(e){
        const refTdata = {...refdata,  [e.target.name] : e.target.value}
        if(!props.editVer){
          const newdata = props.allrefdata.map((data)=>{
            if(data.index === props.index){
              return {...refdata,  [e.target.name] : e.target.value}
            }
            else{
              return data
            }
          })
        
          props.setData(props.allrefs, newdata)
        }
        else{
          props.editInputChangeHandler(e)
        }
    
        
      setrefdata(refTdata)
      }
    

      
    
      return(<div>
        <ToastContainer />
        <div className="padding">
        <div className="row">
          <div className="col-0 col-md-2"></div>
            <div className="col-12 col-md-8">
              <Form className="register-form-container p-5">
                <div>
                  {/* {console.log(props.referalData)} */}
                  <Form.Label className=" d-flex justify-content-start">Referal #{props.index+1}</Form.Label>
    
                  <Form.Label className=" d-flex justify-content-start">First name</Form.Label>
                  <Form.Control type="text" placeholder="" name="firstName" onChange={(e)=>inputHandler(e)} value={props.referalData.firstName}/>
    
                  <Form.Label className=" d-flex justify-content-start">Middle int.</Form.Label>
                  <Form.Control type="text" placeholder="" name="middleInitial" onChange={(e)=>inputHandler(e)} value={props.referalData.middleInitial}/>
    
                  <Form.Label className=" d-flex justify-content-start">Last name</Form.Label>
                  <Form.Control type="text" placeholder="" name="lastName" onChange={(e)=>inputHandler(e)} value={props.referalData.lastName}/>
    
                  <Form.Label className=" d-flex justify-content-start">ICID</Form.Label>
                  <Form.Control type="text" placeholder="" name="ICID" onChange={(e)=>inputHandler(e)} value={props.referalData.ICID}/>
    
                  <Form.Label className=" d-flex justify-content-start">DOB</Form.Label>
                  <Form.Control type="date" placeholder="" name="dob" onChange={(e)=>inputHandler(e)} value={props.referalData.dob}/>
    
                  <Form.Label className=" d-flex justify-content-start">Phone no.</Form.Label>
                  <Form.Control type="text" placeholder="" name="phoneNo" onChange={(e)=>inputHandler(e)} value={props.referalData.phoneNo}/>
    
                  <Form.Label className=" d-flex justify-content-start">Local Address</Form.Label>
                  <Form.Control as="textarea" placeholder="" name="address" onChange={(e)=>inputHandler(e)} value={props.referalData.address}/>
                  
    
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
      )
}