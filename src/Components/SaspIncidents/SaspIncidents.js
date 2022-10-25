import { useState , React, useEffect} from "react";
import { API_URL, post,get } from "../../Utils/API";

export default function SaspIncidents(props) {

    const [incidents,setInceidents]= useState([]);

    async function getNsetInceidents(){
        let response = await get(API_URL + "/getIncidents?token=" +  localStorage.getItem("token"))
        response = JSON.parse(response.incidents)
        response.unshift( {"id":"","incidentName":""} );
        setInceidents(response)
        
        console.log(incidents)
      }


      
  useEffect(() => 
  {   

    getNsetInceidents()
  },[])

    return ( 
        <>{
            incidents.map((item) => {
              if(item.incidentName ==props.selected ){
                return (
                  <option key={item.id} selected >{item.incidentName}</option>
                )
              }else{
                return (
                  <option key={item.id} >{item.incidentName}</option>
                )
              }
                
                })
        }
        </>
    )
}