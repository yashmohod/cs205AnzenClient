import { useState, React, useEffect } from "react";
import { API_URL, post, get } from "../../Utils/API";

export default function DisciplinaryActionsList(props) {

  const [incidents, setdisciplinaryActionName] = useState([]);

  async function getNsetdisciplinaryActionName() {
    let response = await get(API_URL + "/getOrgDisciplinaryActions?token=" + localStorage.getItem("token") + "&org=" + props.org)
    response = response.disciplinaryActions
    response.unshift({ "id": "", "disciplinaryActionName": "" });
    setdisciplinaryActionName(response)

    // console.log(response)
  }



  useEffect(() => {

    getNsetdisciplinaryActionName()
  }, [])

  return (
    <>{
      incidents.map((item) => {
        if (item.disciplinaryActionName == props.selected) {
          return (
            <option key={item.id} selected >{item.disciplinaryActionName}</option>
          )
        } else {
          return (
            <option key={item.id} >{item.disciplinaryActionName}</option>
          )
        }

      })
    }
    </>
  )
}