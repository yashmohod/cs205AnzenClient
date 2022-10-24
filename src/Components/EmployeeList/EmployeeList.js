import { useState , React, useEffect} from "react";
import { API_URL, post,get } from "../../Utils/API";

export default function EmployeeList() {

    const [employeeList,setemployeeList]= useState([]);


    async function getNsetInceidents(){
      let response = await get(API_URL + "/getAllAccounts?token=" +  localStorage.getItem("token"))
      response = JSON.parse(response.accounts)
        response.unshift( {"id":"","firstName":"","lastName":""} );
        setemployeeList(response)

      }


      
  useEffect(() => 
  {   
    getNsetInceidents()
  },[])

    return ( 
        <>{
          employeeList.map((item) => {
            if(item.id!=""){
              return (
                <option key={item.id}  >{item.lastName+","+item.firstName}</option>
              )
            } else{
              return (
                <option key=""  ></option>
              )
            }   
                
                })
        }
        </>
    )
}