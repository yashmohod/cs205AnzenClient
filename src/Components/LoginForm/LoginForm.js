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
import { useSelector, useDispatch } from 'react-redux';
import {userActions} from "../../redux/slices/user"
import { useMsal } from "@azure/msal-react";


export default function LoginForm({autoLogin, setLoading}) {



  const dispatch = useDispatch()
  const { instance } = useMsal();
  function login(){

    instance.loginPopup().then(getToken)
    
  }
  async function getToken(){
    setLoading(true);
    const currentAccount = instance.getActiveAccount();
    var response, tokenVerification
      try {
        response = await post(API_URL + "/login",  {email: currentAccount.username})
        // console.log(response)
        tokenVerification = await post(API_URL + "/validate-token", {token: response.token})
      } catch {
        setLoading(false)
        return
      }

      if (tokenVerification.message === "verified") {
        toast.success(<h5>Verified. Logging you in!</h5>, {style: {fontWeight: "bold"}})
        setLoading(false)
        setTimeout(() => {
          localStorage.setItem("token", response.token)
          dispatch(userActions.updateLoggedIn(true))
          dispatch(userActions.updateUserMetadata(tokenVerification.user))
          localStorage.setItem("firstName", tokenVerification.user.firstName)
        }, 1500)
      } else {
        dispatch(userActions.updateLoggedIn(false))
        dispatch(userActions.updateUserMetadata(null))
        setLoading(false)
        toast.error(<h5>{response.message}</h5>, {style: {fontWeight: "bold"}})
      }
  }
  


 

    useEffect((e) => {
      autoLogin()
      }, [])

      return (
            <div className="form m-2 p-2">
                <ToastContainer/>
                <div className="ithaca-logo-login-container" style={{color: "black"}}>
                    <img src={IthacaLogo} alt="" className="ithaca-logo-login"/>
                </div>
                <form className='m-5'>
                      <Text fontSize='4xl' color="black" mb={10}>Access Page</Text>
                     <Button appearance="primary" className="btn btn-primary" onClick={()=>login()} color="blue" active>Login</Button>
                </form>
            </div>
      )
}
  
