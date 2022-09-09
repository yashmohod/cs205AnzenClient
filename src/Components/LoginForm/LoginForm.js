import React, { Component, useEffect, useState } from 'react'
import SimpleLoginForm from 'simple-login-form'
import 'simple-login-form/dist/index.css'
import { API_URL, get, post } from '../../Utils/API'
import './LoginForm.css'
import IthacaLogo from '../../Images/logo.png'

//'linear-gradient(#e66465, #9198e5)'
//linear-gradient(#1f87ab, #004961 50%, #004961 90%);
export default function LoginForm({setLoggedIn, setLoggedInUser}) {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function emailChangeHandler(e) {
      setEmail(e.target.value)
    }

    function passwordChangeHandler(e) {
      setPassword(e.target.value)
    }

    async function loginHandler(e) {
      //if token is valid, auto log the user in
      if (localStorage.getItem("token") === "true") {
        setLoggedIn(true)
      }
      e.preventDefault()
      let response = await post(API_URL + "/login",  {email: email, password: password})
      if (response.message === "success") {
        setLoggedIn(true)
        setLoggedInUser(response.user)
        localStorage.setItem("token", response.token)
      } else {
        setLoggedIn(false)
      }
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
                       <label for="exampleInputEmail1" class="form-label d-flex justify-content-start">Email address</label>
                       <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => emailChangeHandler(e)}/>
                     </div>
                     <div class="mb-3">
                       <label for="exampleInputPassword1" class="form-label d-flex justify-content-start">Password</label>
                       <input type="password" class="form-control" id="exampleInputPassword1" onChange={(e) => passwordChangeHandler(e)}/>
                     </div>
           
                     <button type="submit" class="btn btn-primary" onClick={(e) => loginHandler(e)}>Login</button>
                    
                </form>
                <a href="">Forgot password?</a>
                <p>No account? <a href="">Sign Up</a></p> 
            </div>
      )
}
  