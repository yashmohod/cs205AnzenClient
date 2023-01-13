import React, { Component, useEffect, useState } from 'react'
import { API_URL, get, post } from '../../Utils/API'
import { Button } from 'rsuite';
import IthacaLogo from '../../Images/logo.png'
import TextField from '@mui/material/TextField';
import { Input } from '@chakra-ui/react'
import './LoginForm.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Text } from '@chakra-ui/react'


//'linear-gradient(#e66465, #9198e5)'
//linear-gradient(#1f87ab, #004961 50%, #004961 90%);
export default function LoginForm({setLoggedIn, setLoggedInUser, autoLogin, setLoading}) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function emailChangeHandler(e) {
      setEmail(e.target.value)
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
      
      let response = await post(API_URL + "/login",  {email: email, password: password})
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
        toast.error(<h5>Wrong Credentials!</h5>, {style: {fontWeight: "bold"}})
      }
   }
   function checkMessage(){
    if(!(localStorage.getItem("message") === null)){
        toast.success(String(localStorage.getItem("message")));
        localStorage.removeItem("message");
    }
}

    useEffect((e) => {
      checkMessage()
      loginHandler(e)
    }, [])
 
      return (
            <div className="form p-5">
                <ToastContainer/>
                <div className="ithaca-logo-login-container" style={{color: "black"}}>
                    <img src={IthacaLogo} alt="" className="ithaca-logo-login"/>
                </div>
                <form className='m-5'>
                      <Text fontSize='4xl' color="black" mb={10}>Access Page</Text>
                     <div class="mb-3">
                       <label for="exampleInputEmail1" class="form-label d-flex justify-content-start" style={{color: "black"}}>Username</label>
                       <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => emailChangeHandler(e)} style={{color: "black"}}/>
                     </div>
                     <div class="mb-3">
                       <label for="exampleInputPassword1" class="form-label d-flex justify-content-start" style={{color: "black"}}>Password</label>
                       <input type="password" class="form-control" id="exampleInputPassword1" onChange={(e) => passwordChangeHandler(e)} style={{color: "black"}}/>
                     </div>

                     <Button appearance="primary" class="btn btn-primary" onClick={(e) => loginHandler(e)} color="blue" active>Login</Button>
                </form>
            </div>
      )
}
  