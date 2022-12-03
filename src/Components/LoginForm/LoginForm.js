import React, { Component, useEffect, useState } from 'react'
import { API_URL, get, post } from '../../Utils/API'
import { Button } from 'rsuite';
import IthacaLogo from '../../Images/logo.png'
import './LoginForm.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';


//'linear-gradient(#e66465, #9198e5)'
//linear-gradient(#1f87ab, #004961 50%, #004961 90%);
export default function LoginForm({setLoggedIn, setLoggedInUser, autoLogin, setLoading}) {
    const [userName, setuserName] = useState("")
    const [password, setPassword] = useState("")

    function userNameChangeHandler(e) {
      setuserName(e.target.value)
    }

    function passwordChangeHandler(e) {
      setPassword(e.target.value)
    }

    async function loginHandler(e) {
      setLoading(true)

      if (!e) {
        autoLogin()
        setLoading(false)
        return
      }
      
      let response = await post(API_URL + "/login",  {userName: userName, password: password})
      var tokenVerification = await post(API_URL + "/validate-token", {token: response.token})
    
      if (tokenVerification.message === "verified") {
        toast.success(<h5>Verified. Logging you in!</h5>, {style: {fontWeight: "bold"}})
        setLoading(false)
        setTimeout(() => {
          localStorage.setItem("token", response.token)
          setLoggedIn(true)
          setLoggedInUser(tokenVerification.user)
        }, 1500)
      } else {
        setLoggedIn(false)
        setLoggedInUser(null)
        setLoading(false)
        toast.error(<h5>Verified. Logging you in!</h5>, {style: {fontWeight: "bold"}})
      }
   }

    useEffect((e) => {
      loginHandler(e)
    }, [])
 
      return (
            <div className="form p-5">
                <ToastContainer/>
                <div className="ithaca-logo-login-container">
                    <img src={IthacaLogo} alt="" className="ithaca-logo-login"/>
                </div>
                <form className='m-5'>
                    <h1>Access Page</h1>
                     <div class="mb-3">
                       <label for="exampleInputEmail1" class="form-label d-flex justify-content-start">Username</label>
                       <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => userNameChangeHandler(e)}/>
                     </div>
                     <div class="mb-3">
                       <label for="exampleInputPassword1" class="form-label d-flex justify-content-start">Password</label>
                       <input type="password" class="form-control" id="exampleInputPassword1" onChange={(e) => passwordChangeHandler(e)}/>
                     </div>

                     <Button appearance="primary" class="btn btn-primary" onClick={(e) => loginHandler(e)} color="blue" active>Login</Button>
                </form>
            </div>
      )
}
  