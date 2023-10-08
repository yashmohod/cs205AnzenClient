import { useState , React, useEffect} from "react";
import { API_URL, post,get } from "../../Utils/API";

export default function EmployeeList({org}) {

    const [employeeList,setemployeeList]= useState([]);


    async function getNsetInceidents(){
      let response  = await get(API_URL + "/getAccounts?token=" +  localStorage.getItem("token")+"&org="+org)

      let accs = [{id:"",firstName:"",lastName:""}];
      if(response.status ==200){
        response.accounts.map((acc)=>{
          accs.push(acc);
        });
      }
      return accs
      }


      
  useEffect(() => 
  {   
    getNsetInceidents().then((response)=>{
      setemployeeList(response)
    })
  },[])

    return ( 
        <>{
          employeeList.map((item) => {
            if(item.id!=""){
              return (
                <option value={item.id}  >{item.lastName+","+item.firstName}</option>
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