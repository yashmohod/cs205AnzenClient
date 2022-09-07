import React, { Component, useState } from 'react'
import SimpleLoginForm from 'simple-login-form'
import 'simple-login-form/dist/index.css'
import { API_URL, get, post } from '../../Utils/API'
import './LoginForm.css'

//'linear-gradient(#e66465, #9198e5)'
//linear-gradient(#1f87ab, #004961 50%, #004961 90%);
export default function LoginForm({setLoggedIn}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function emailChangeHandler(e) {
      setEmail(e.target.value)
    }

    function passwordChangeHandler(e) {
      setPassword(e.target.value)
    }

    async function loginHandler(e) {
      e.preventDefault()
      let response = await post(API_URL + "/login",  {email: email, password: password})
      if (response.message === "success") {
        setLoggedIn(true)
      } else {
        setLoggedIn(false)
      }
    }

      return (
            <div className="form p-5">
                <div className="ithaca-logo-container">
                    <img src="https://lh3.googleusercontent.com/Fqzo91UwOrRgzU7a3p8UT823rNP8nZnrYsSD7QqaFplnEWpp5LRL0D9roG7pP2Na9WGi4MarbS5DM2JOemCEwBo2cQ" alt="" className="ithaca-logo"/>
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
  