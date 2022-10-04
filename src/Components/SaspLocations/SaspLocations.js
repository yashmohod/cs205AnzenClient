import { useState , React, useEffect} from "react";
import { API_URL, post,get } from "../../Utils/API";

export default function SaspLocations() {

    const [locations,setlocations]= useState([]);


    async function getNsetInceidents(){
        let response = await get(API_URL + "/getLocations?token=" +  localStorage.getItem("token"))
        response = JSON.parse(response.locations)
        response.unshift( {"id":"","locationName":""} );
        setlocations(response)
        
        console.log(locations)
      }


      
  useEffect(() => 
  {   
    getNsetInceidents()
  },[])

    return ( 
        <>{
          locations.map((item) => {
                return (
                  <option key={item.id}  >{item.locationName}</option>
                )
                
                })
        }
        </>
    )
}