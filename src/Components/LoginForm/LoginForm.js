import React, { Component, useEffect, useState } from 'react'
import SimpleLoginForm from 'simple-login-form'
import 'simple-login-form/dist/index.css'
import { API_URL, get, post } from '../../Utils/API'
import './LoginForm.css'
import IthacaLogo from '../../Images/logo.png'

//'linear-gradient(#e66465, #9198e5)'
//linear-gradient(#1f87ab, #004961 50%, #004961 90%);
export default function LoginForm({setLoggedIn, setLoggedInUser, autoLogin}) {
    const [userName, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function emailChangeHandler(e) {
      setEmail(e.target.value)
    }

    function passwordChangeHandler(e) {
      setPassword(e.target.value)
    }

    
 
    async function loginHandler(e) {
      autoLogin()
      e.preventDefault()
      let response = await post(API_URL + "/login",  {userName: userName, password: password})
      var tokenVerification = await post(API_URL + "/validate-token", {token: response.token})

      if (tokenVerification.message === "verified") {
        setOrgNPos(response)
        setLoggedIn(true)
        setLoggedInUser(tokenVerification.user)
      } else {
        setLoggedIn(false)
        setLoggedInUser(null)
        clearOrgNPos()
      }
   }
   async function setOrgNPos(response){
    const org = (await post(API_URL + "/getOrganization", {token: response.token}))
    const pos = (await post(API_URL + "/getPosition", {token: response.token}))
    localStorage.setItem("token", response.token)
    localStorage.setItem("organization", org["organization"])
    localStorage.setItem("position", pos["position"])
   }
   function clearOrgNPos(){
    localStorage.removeItem("organization")
    localStorage.removeItem("position")
   }
    useEffect((e) => {
      loginHandler(e)

    }, [])
 
      return (
            <div className="form p-5">
                <div className="ithaca-logo-login-container">
                    <img src={IthacaLogo} alt="" className="ithaca-logo-login"/>
                </div>
                <form className='m-5'>
                    <h1>Access Page</h1>
                     <div class="mb-3">
                       <label for="exampleInputEmail1" class="form-label d-flex justify-content-start">Username</label>
                       <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => emailChangeHandler(e)}/>
                     </div>
                     <div class="mb-3">
                       <label for="exampleInputPassword1" class="form-label d-flex justify-content-start">Password</label>
                       <input type="password" class="form-control" id="exampleInputPassword1" onChange={(e) => passwordChangeHandler(e)}/>
                     </div>
           
                     <button type="submit" class="btn btn-primary" onClick={(e) => loginHandler(e)}>Login</button>
                    
                </form>
            </div>
      )
}
  